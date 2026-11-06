import "server-only"

import todas from "@/lib/noticias-todas.json"
import { paraCartao, type Noticia, type NoticiaCartao } from "@/lib/noticias-tipos"
import { clientePublico } from "@/lib/supabase/publico"

export type { Noticia }

// Linha do banco (public.noticias) no formato do site.
type Linha = {
  slug: string
  titulo: string
  data: string
  categoria: Noticia["categoria"]
  resumo: string
  conteudo: string
  imagem: string | null
  miniatura: string | null
}

const doBanco = (l: Linha): Noticia => ({
  slug: l.slug,
  titulo: l.titulo,
  data: l.data,
  categoria: l.categoria,
  resumo: l.resumo,
  conteudo: l.conteudo,
  imagem: l.imagem,
  miniatura: l.miniatura,
  urlOriginal: null,
})

// Sem banco (build local, Supabase fora do ar), as notícias importadas do
// WordPress do colégio por scripts/importar-noticias.mjs.
const doArquivo: Noticia[] = todas.map((n) => ({
  slug: n.slug,
  titulo: n.title,
  data: n.date,
  categoria: n.category as Noticia["categoria"],
  resumo: n.excerpt,
  conteudo: n.content,
  imagem: n.image,
  miniatura: n.thumb,
  urlOriginal: n.url,
}))

const colunas = "slug,titulo,data,categoria,resumo,conteudo,imagem,miniatura"
// listas e cartões não precisam do texto inteiro (são 265 notícias)
const colunasCartao = "slug,titulo,data,categoria,resumo,imagem,miniatura"

/**
 * Cartões das notícias publicadas, da mais nova para a mais antiga (todas, ou
 * as `limite` primeiras). Sem banco, com erro ou com a tabela vazia, usa as
 * notícias importadas do WordPress: decisão deliberada, porque a tabela vazia
 * pode ser só um banco ainda não semeado, e o site não deve ficar sem notícias.
 */
export async function listarCartoes(limite?: number): Promise<NoticiaCartao[]> {
  const doArquivoCartoes = () => doArquivo.slice(0, limite).map(paraCartao)
  const sb = clientePublico()
  if (!sb) return doArquivoCartoes()
  const { data, error } = await sb
    .from("noticias")
    .select(colunasCartao)
    .eq("publicado", true)
    .order("data", { ascending: false })
    .limit(limite ?? 2000)
  if (error || !data?.length) return doArquivoCartoes()
  return (data as Omit<Linha, "conteudo">[]).map((l) => paraCartao(doBanco({ ...l, conteudo: "" })))
}

/** Até `quantas` outras notícias da mesma categoria, para o fim da página de uma notícia. */
export async function relacionadas(n: Pick<Noticia, "slug" | "categoria">, quantas = 3): Promise<NoticiaCartao[]> {
  return (await listarCartoes()).filter((x) => x.slug !== n.slug && x.categoria === n.categoria).slice(0, quantas)
}

export async function obterNoticia(slug: string): Promise<Noticia | undefined> {
  if (!/^[a-z0-9-]{1,200}$/.test(slug)) return undefined
  const sb = clientePublico()
  if (sb) {
    const { data, error } = await sb.from("noticias").select(colunas).eq("slug", slug).eq("publicado", true).maybeSingle()
    if (!error && data) return doBanco(data as Linha)
    if (!error) return undefined
  }
  return doArquivo.find((n) => n.slug === slug)
}
