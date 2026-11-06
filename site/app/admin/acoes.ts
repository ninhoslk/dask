"use server"

import { revalidatePath } from "next/cache"
import sanitizeHtml from "sanitize-html"

import { adminOuErro } from "@/lib/admin/sessao"
import { normalizar, normalizarConfig, type ConfigDoc, type Documento } from "@/lib/conteudo/documento"
import { permiteIncorporar } from "@/lib/tour"

type Resultado<T = undefined> = { ok: true; dados?: T } | { ok: false; erro: string }

const falha = (erro: string): Resultado<never> => ({ ok: false, erro })

// Tudo o que o painel muda passa por aqui. Cada ação confere a sessão por
// conta própria, valida a entrada e só então escreve, sempre com o token do
// usuário: as políticas de RLS do banco são a última barreira.

// ---------------------------------------------------------------- páginas
// "home": seções da página inicial. "site": informações do site inteiro.
export type Pagina = "home" | "site"
export type DocDaPagina = Documento | ConfigDoc

const paginaValida = (p: unknown): p is Pagina => p === "home" || p === "site"
const normalizarDa = (p: Pagina, bruto: unknown): DocDaPagina => (p === "home" ? normalizar(bruto) : normalizarConfig(bruto))

/** O que o editor precisa para continuar de onde o banco está. */
export type Estado = { doc: DocDaPagina; versao: string; autor: string }

export type ResultadoSalvar =
  | { ok: true; versao: string }
  | { ok: false; erro: string; conflito?: Estado }

type Sessao = Extract<Awaited<ReturnType<typeof adminOuErro>>, { sb: unknown }>

async function nomeDe(a: Sessao, id: string | null) {
  if (!id) return "Equipe"
  if (id === a.user.id) return "Você (em outra aba)"
  const { data } = await a.sb.from("admins").select("nome").eq("user_id", id).maybeSingle()
  return data?.nome || "Equipe"
}

/** Rascunho atual no banco (para recarregar depois de mudança de outra pessoa). */
export async function lerRascunho(pagina: Pagina): Promise<Resultado<Estado>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  if (!paginaValida(pagina)) return falha("Página inválida.")
  const { data, error } = await a.sb.from("rascunhos").select("conteudo,atualizado_em,atualizado_por").eq("id", pagina).maybeSingle()
  if (error || !data) return falha("Não foi possível ler o rascunho.")
  return {
    ok: true,
    dados: { doc: normalizarDa(pagina, data.conteudo), versao: data.atualizado_em, autor: await nomeDe(a, data.atualizado_por) },
  }
}

// Salva só se o rascunho no banco ainda é a versão que o editor conhece: se
// outra pessoa salvou no meio do caminho, devolve o conflito em vez de apagar
// o trabalho dela.
export async function salvarRascunho(pagina: Pagina, bruto: unknown, base: string | null): Promise<ResultadoSalvar> {
  const a = await adminOuErro()
  if ("erro" in a) return { ok: false, erro: a.erro! }
  if (!paginaValida(pagina)) return { ok: false, erro: "Página inválida." }
  const doc = normalizarDa(pagina, bruto)
  let consulta = a.sb.from("rascunhos").update({ conteudo: doc, atualizado_por: a.user.id }).eq("id", pagina)
  if (base) consulta = consulta.eq("atualizado_em", base)
  const { data, error } = await consulta.select("atualizado_em")
  if (error) return { ok: false, erro: "Não foi possível salvar o rascunho." }
  if (data?.length) return { ok: true, versao: data[0].atualizado_em }

  const atual = await lerRascunho(pagina)
  if (!atual.ok) return { ok: false, erro: atual.erro }
  return { ok: false, erro: `${atual.dados!.autor} alterou este rascunho enquanto você editava.`, conflito: atual.dados }
}

export async function publicar(pagina: Pagina, bruto: unknown): Promise<ResultadoSalvar> {
  const a = await adminOuErro()
  if ("erro" in a) return { ok: false, erro: a.erro! }
  if (!paginaValida(pagina)) return { ok: false, erro: "Página inválida." }
  const doc = normalizarDa(pagina, bruto)
  const pub = await a.sb.from("paginas").upsert({ id: pagina, conteudo: doc, atualizado_por: a.user.id })
  if (pub.error) return { ok: false, erro: "Não foi possível publicar." }
  const ras = await a.sb
    .from("rascunhos")
    .upsert({ id: pagina, conteudo: doc, atualizado_por: a.user.id })
    .select("atualizado_em")
    .single()
  await a.sb.from("versoes").insert({ pagina, conteudo: doc })
  await a.sb.from("auditoria").insert({ acao: "publicar", alvo: pagina, user_id: a.user.id })
  revalidatePath("/", "layout")
  return { ok: true, versao: ras.data?.atualizado_em ?? "" }
}

export type Versao = { id: number; criado_em: string; autor: string }

export async function listarVersoes(pagina: Pagina): Promise<Resultado<Versao[]>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  if (!paginaValida(pagina)) return falha("Página inválida.")
  const { data, error } = await a.sb
    .from("versoes")
    .select("id,criado_em,criado_por")
    .eq("pagina", pagina)
    .order("criado_em", { ascending: false })
    .limit(30)
  if (error) return falha("Não foi possível ler o histórico.")
  const { data: equipe } = await a.sb.from("admins").select("user_id,nome")
  const nomes = new Map((equipe ?? []).map((m) => [m.user_id, m.nome]))
  return {
    ok: true,
    dados: data.map((v) => ({ id: v.id, criado_em: v.criado_em, autor: nomes.get(v.criado_por) || "Equipe" })),
  }
}

export async function lerVersao(pagina: Pagina, id: number): Promise<Resultado<DocDaPagina>> {
  const a = await adminOuErro()
  if ("erro" in a) return falha(a.erro!)
  if (!paginaValida(pagina) || !Number.isSafeInteger(id)) return falha("Versão inválida.")
  const { data, error } = await a.sb.from("versoes").select("conteudo").eq("id", id).eq("pagina", pagina).maybeSingle()
  if (error || !data) return falha("Versão não encontrada.")
  return { ok: true, dados: normalizarDa(pagina, data.conteudo) }
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

const tagsNoticia = ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "img", "figure", "figcaption"]

// Texto simples vira parágrafos; HTML vindo do WordPress é aceito, mas limpo.
function conteudoSeguro(texto: string) {
  const html = /<\/?[a-z][\s\S]*>/i.test(texto)
    ? texto
    : texto
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`)
        .join("\n")
  return sanitizeHtml(html, {
    allowedTags: tagsNoticia,
    allowedAttributes: { a: ["href"], img: ["src", "alt", "width", "height"] },
    allowedSchemes: ["https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
  })
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
  const conteudo = conteudoSeguro(String(f.conteudo ?? "").slice(0, 150000))
  const resumo = String(f.resumo ?? "").trim().slice(0, 600) || sanitizeHtml(conteudo, { allowedTags: [] }).slice(0, 280)

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
