"use server"

import { revalidatePath } from "next/cache"

import { adminOuErro } from "@/lib/admin/sessao"
import type { Documento } from "@/lib/conteudo/documento"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina, type Versao } from "@/lib/conteudo/repositorio"
import { htmlParaGravar, textoPuro } from "@/lib/noticias-html"
import { falha, type Resultado } from "@/lib/resultado"
import { permiteIncorporar } from "@/lib/tour"

export type { Versao }

// Tudo o que o painel muda passa por aqui. Cada ação confere a sessão por
// conta própria, valida a entrada e só então escreve, sempre com o token do
// usuário: as políticas de RLS do banco são a última barreira.

// ---------------------------------------------------------------- página
// A regra de onde o documento mora e do que fazer em cada falha fica no
// repositório (lib/conteudo/repositorio.ts); aqui só a sessão e o cache.
export async function salvarRascunho(bruto: unknown): Promise<Resultado> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  return repositorioPagina(lojaSupabase(a.sb)).salvarRascunho(bruto, a.user.id)
}

export async function publicar(bruto: unknown): Promise<Resultado> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  const r = await repositorioPagina(lojaSupabase(a.sb)).publicar(bruto, a.user.id)
  if (r.ok) revalidatePath("/", "layout")
  return r
}

export async function listarVersoes(): Promise<Resultado<Versao[]>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  return repositorioPagina(lojaSupabase(a.sb)).versoes()
}

export async function lerVersao(id: number): Promise<Resultado<Documento>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  return repositorioPagina(lojaSupabase(a.sb)).versao(id)
}

// ---------------------------------------------------------------- notícias
export type NoticiaForm = {
  id?: string
  slug: string
  titulo: string
  data: string
  categoria: "Geral" | "Ensino" | "Eventos"
  resumo: string
  conteudo: string
  imagem: string
  publicado: boolean
}

const slugDe = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)

export async function salvarNoticia(f: NoticiaForm): Promise<Resultado<{ id: string }>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)

  const titulo = String(f.titulo ?? "").trim().slice(0, 300)
  if (!titulo) return falha("Dê um título à notícia.")
  const slug = slugDe(String(f.slug || titulo))
  if (!slug) return falha("Endereço (slug) inválido.")
  const categoria = (["Geral", "Ensino", "Eventos"] as const).includes(f.categoria) ? f.categoria : "Geral"
  const data = new Date(f.data)
  if (Number.isNaN(data.getTime())) return falha("Data inválida.")
  const imagem = String(f.imagem ?? "").trim()
  if (imagem && !/^https:\/\/[^\s"'<>]+$/.test(imagem)) return falha("A imagem precisa ser um endereço https.")
  const conteudo = htmlParaGravar(String(f.conteudo ?? "").slice(0, 150000))
  const resumo = String(f.resumo ?? "").trim().slice(0, 600) || textoPuro(conteudo).slice(0, 280)

  const linha = {
    slug,
    titulo,
    data: data.toISOString(),
    categoria,
    resumo,
    conteudo,
    imagem: imagem || null,
    miniatura: imagem || null,
    publicado: Boolean(f.publicado),
  }

  const id = typeof f.id === "string" && /^[0-9a-f-]{36}$/i.test(f.id) ? f.id : undefined
  const res = id
    ? await a.sb.from("noticias").update(linha).eq("id", id).select("id").single()
    : await a.sb.from("noticias").insert(linha).select("id").single()
  if (res.error) {
    return falha(res.error.code === "23505" ? "Já existe uma notícia com esse endereço." : "Não foi possível salvar a notícia.")
  }
  await a.sb.from("auditoria").insert({ acao: id ? "editar notícia" : "criar notícia", alvo: slug, user_id: a.user.id })
  revalidatePath("/", "layout")
  return { ok: true, dados: { id: res.data.id } }
}

export async function apagarNoticia(id: string): Promise<Resultado> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  if (!/^[0-9a-f-]{36}$/i.test(id)) return falha("Notícia inválida.")
  const { error } = await a.sb.from("noticias").delete().eq("id", id)
  if (error) return falha("Não foi possível apagar.")
  await a.sb.from("auditoria").insert({ acao: "apagar notícia", alvo: id, user_id: a.user.id })
  revalidatePath("/", "layout")
  return { ok: true }
}

// ---------------------------------------------------------------- tour 360
export type TourForm = { ativo: boolean; titulo: string; descricao: string; url_embed: string }

/** Aceita o endereço puro ou o código `<iframe src="…">` copiado do site do tour. */
function enderecoDoTour(entrada: string) {
  const texto = entrada.trim()
  const src = /<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(texto)?.[1] ?? texto
  return src.replaceAll("&amp;", "&").trim()
}

export async function salvarTour(f: TourForm): Promise<Resultado<{ semQuadro: boolean }>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  const url = enderecoDoTour(String(f.url_embed ?? ""))
  if (url && !/^https:\/\/[^\s"'<>]+$/.test(url)) return falha("O endereço do tour precisa começar com https://")
  if (f.ativo && !url) return falha("Para ativar, informe o endereço do tour.")
  const semQuadro = Boolean(url && f.ativo && !(await permiteIncorporar(url)))
  const { error } = await a.sb
    .from("tour360")
    .update({
      ativo: Boolean(f.ativo),
      titulo: String(f.titulo ?? "").trim().slice(0, 200) || "Tour 360° pelo Colégio Dask",
      descricao: String(f.descricao ?? "").trim().slice(0, 1000),
      url_embed: url || null,
    })
    .eq("id", 1)
  if (error) return falha("Não foi possível salvar.")
  await a.sb.from("auditoria").insert({ acao: "editar tour 360", alvo: url, user_id: a.user.id })
  revalidatePath("/", "layout")
  return { ok: true, dados: { semQuadro } }
}

// ---------------------------------------------------------------- mídia
export async function apagarMidia(nome: string): Promise<Resultado> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  if (!/^[\w-]{1,80}\.(jpe?g|png|webp|avif|gif)$/i.test(nome)) return falha("Arquivo inválido.")
  const { error } = await a.sb.storage.from("midia").remove([nome])
  if (error) return falha("Não foi possível apagar o arquivo.")
  await a.sb.from("auditoria").insert({ acao: "apagar mídia", alvo: nome, user_id: a.user.id })
  return { ok: true }
}
