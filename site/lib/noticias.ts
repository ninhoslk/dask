import "server-only"

import sanitizeHtml from "sanitize-html"

import todas from "@/lib/noticias-todas.json"
import type { Noticia } from "@/lib/noticias-tipos"
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
  url_original: string | null
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
  urlOriginal: l.url_original,
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

const colunas = "slug,titulo,data,categoria,resumo,conteudo,imagem,miniatura,url_original"

export async function listarNoticias(): Promise<Noticia[]> {
  const sb = clientePublico()
  if (!sb) return doArquivo
  const { data, error } = await sb
    .from("noticias")
    .select(colunas)
    .eq("publicado", true)
    .order("data", { ascending: false })
    .limit(2000)
  if (error || !data?.length) return doArquivo
  return (data as Linha[]).map(doBanco)
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

// O texto da notícia é limpo de novo na hora de mostrar, mesmo já tendo sido
// limpo ao salvar: o que vai para o HTML da página nunca depende só do banco.
export function htmlSeguro(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "img", "figure", "figcaption"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height", "loading", "decoding"] },
    allowedSchemes: ["https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      a: (_tag, attribs) => ({
        tagName: "a",
        attribs: { href: attribs.href ?? "", target: "_blank", rel: "noopener noreferrer nofollow" },
      }),
    },
  })
}

