// Importa TODAS as notícias do WordPress do colégio para site/lib/noticias-todas.json.
// Uso (dentro de site/): node ../scripts/importar-noticias.mjs
//
// As imagens continuam hospedadas em colegiodask.com.br (não são baixadas):
// 265 capas em alta somariam dezenas de MB ao repositório. O HTML de cada post
// é limpo aqui (sanitize-html) para que o site só renderize marcação segura.
import { writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"

const require = createRequire(resolve("package.json"))
const sanitizeHtml = require("sanitize-html")

const API = "https://colegiodask.com.br/wp-json/wp/v2/posts"
const categorias = { 1: "Geral", 7: "Eventos", 8: "Ensino" }

const entidades = { "&#8211;": "–", "&#8212;": "—", "&#8216;": "‘", "&#8217;": "’", "&#8220;": "“", "&#8221;": "”", "&#8230;": "…", "&amp;": "&", "&nbsp;": " ", "&#038;": "&", "&quot;": '"', "&#039;": "'", "&lt;": "<", "&gt;": ">" }
const texto = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#?\w+;/g, (e) => entidades[e] ?? (e.startsWith("&#") ? String.fromCodePoint(parseInt(e.slice(2), 10)) : e))
    .replace(/\s+/g, " ")
    .trim()

// Many posts were pasted from Facebook: text in nested <div>s and emoji drawn
// as images from fbcdn. Divs become paragraph breaks and emoji images their alt.
const blocos = /^<(p|h2|h3|h4|ul|ol|figure|blockquote|img)\b/
const paragrafos = (html) =>
  html
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => (blocos.test(c) ? c : `<p>${c.replace(/\n/g, "<br>")}</p>`))
    .join("\n")

const limpar = (html) =>
  paragrafos(
    sanitizeHtml(
      html
        .replace(/<img[^>]*fbcdn\.net[^>]*alt="([^"]*)"[^>]*>/g, "$1")
        .replace(/<img[^>]*alt="([^"]*)"[^>]*fbcdn\.net[^>]*>/g, "$1")
        .replace(/<\/?div[^>]*>/g, "\n\n"),
      {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "img", "figure", "figcaption"],
    allowedAttributes: { a: ["href"], img: ["src", "alt", "width", "height"] },
    allowedSchemes: ["https", "mailto", "tel"],
    transformTags: {
      h1: "h2",
      a: (tag, attribs) => ({ tagName: "a", attribs: { href: attribs.href ?? "", target: "_blank", rel: "noopener noreferrer" } }),
      img: (tag, attribs) => ({ tagName: "img", attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    },
      }
    )
  )
    // the WordPress gallery leaves empty paragraphs behind
    .replace(/<p>(\s|<br>|&nbsp;)*<\/p>/g, "")
    .trim()

const todas = []
for (let pagina = 1; ; pagina++) {
  const r = await fetch(`${API}?per_page=100&page=${pagina}&_embed=wp:featuredmedia&orderby=date&order=desc`)
  if (!r.ok) break
  const lote = await r.json()
  if (!lote.length) break
  for (const p of lote) {
    const m = p._embedded?.["wp:featuredmedia"]?.[0]
    const tamanhos = m?.media_details?.sizes ?? {}
    const capa = tamanhos.large ?? tamanhos.medium_large ?? tamanhos.full
    const mini = tamanhos.medium_large ?? tamanhos.medium ?? capa
    todas.push({
      slug: p.slug,
      title: texto(p.title.rendered),
      date: p.date_gmt + "Z",
      category: categorias[p.categories?.[0]] ?? "Geral",
      excerpt: texto(p.excerpt.rendered),
      image: capa?.source_url ?? null,
      imageW: capa?.width ?? null,
      imageH: capa?.height ?? null,
      thumb: mini?.source_url ?? null,
      url: p.link,
      content: limpar(p.content.rendered),
    })
  }
  const total = Number(r.headers.get("x-wp-totalpages"))
  if (pagina >= total) break
}

writeFileSync("lib/noticias-todas.json", JSON.stringify(todas))
console.log(`${todas.length} notícias gravadas em lib/noticias-todas.json`)
