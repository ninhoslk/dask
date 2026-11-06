import sanitizeHtml from "sanitize-html"

// Uma regra só para o HTML das notícias: o que o painel grava e o que a
// página mostra usam a mesma lista de marcações permitidas. O texto é limpo
// ao gravar e de novo ao mostrar: o HTML da página nunca depende só do banco.

const TAGS = ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "img", "figure", "figcaption"]
const ESQUEMAS = ["https", "mailto", "tel"]

const pareceHtml = (texto: string) => /<\/?[a-z][\s\S]*>/i.test(texto)

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** Para gravar: texto simples vira parágrafos; HTML (como o do WordPress) é aceito, mas limpo. */
export function htmlParaGravar(texto: string) {
  const html = pareceHtml(texto)
    ? texto
    : texto
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${escapar(p).replace(/\n/g, "<br>")}</p>`)
        .join("\n")
  return sanitizeHtml(html, {
    allowedTags: TAGS,
    allowedAttributes: { a: ["href"], img: ["src", "alt", "width", "height"] },
    allowedSchemes: ESQUEMAS,
    allowedSchemesByTag: { img: ["https"] },
  })
}

/** Para mostrar: mesma lista de marcações; todo link abre em outra aba, sem passar referência. */
export function htmlParaMostrar(html: string) {
  return sanitizeHtml(html, {
    allowedTags: TAGS,
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height", "loading", "decoding"] },
    allowedSchemes: ESQUEMAS,
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      a: (_tag, attribs) => ({
        tagName: "a",
        attribs: { href: attribs.href ?? "", target: "_blank", rel: "noopener noreferrer nofollow" },
      }),
    },
  })
}

/** Texto puro do HTML, para montar um resumo quando a equipe não escreveu um. */
export const textoPuro = (html: string) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
