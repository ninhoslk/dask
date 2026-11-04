// Endereço público do site e dados estruturados (schema.org).
//
// O domínio vem SEMPRE de NEXT_PUBLIC_SITE_URL: ao trocar para o domínio
// definitivo, basta mudar essa variável na Vercel e publicar de novo; o
// sitemap, o robots.txt, as URLs canônicas e as imagens de compartilhamento
// acompanham sozinhos.

import { contato } from "@/lib/site"

export const urlDoSite = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://colegio-dask.vercel.app")

/** URL absoluta de um caminho do site ("/noticias" → https://…/noticias) */
export const absoluta = (caminho: string) => new URL(caminho, urlDoSite).toString()

/** imagem padrão de compartilhamento: foto aérea real da fachada, 1200×630 */
export const imagemCompartilhar = { url: "/og.jpg", width: 1200, height: 630, alt: "Vista aérea do Colégio Dask, em Dracena-SP" }

/** a escola como organização, para a home (Google: painel de conhecimento) */
export function dadosDaEscola() {
  return {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": absoluta("/#organizacao"),
    name: "Colégio Dask",
    legalName: contato.razao,
    url: absoluta("/"),
    logo: absoluta("/logo-dask.png"),
    image: absoluta(imagemCompartilhar.url),
    telephone: "+55-18-3822-3018",
    email: contato.email,
    foundingDate: "1996",
    address: {
      "@type": "PostalAddress",
      streetAddress: contato.endereco.split(" – ")[0],
      addressLocality: "Dracena",
      addressRegion: "SP",
      postalCode: contato.cep,
      addressCountry: "BR",
    },
    parentOrganization: { "@type": "Organization", name: contato.mantenedora },
    sameAs: [contato.instagram, contato.facebook],
  }
}

/** uma notícia como NewsArticle */
export function dadosDaNoticia(n: { slug: string; titulo: string; data: string; resumo: string; imagem: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: n.titulo,
    description: n.resumo,
    datePublished: n.data,
    image: [n.imagem ? new URL(n.imagem, urlDoSite).toString() : absoluta(imagemCompartilhar.url)],
    mainEntityOfPage: absoluta(`/noticias/${n.slug}`),
    publisher: { "@id": absoluta("/#organizacao"), "@type": "School", name: "Colégio Dask", logo: absoluta("/logo-dask.png") },
  }
}

/** <script type="application/ld+json">; escapa "<" para não fechar a tag */
export function JsonLd({ dados }: { dados: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }}
    />
  )
}
