import type { MetadataRoute } from "next"

import { listarNoticias } from "@/lib/noticias"
import { absoluta } from "@/lib/seo"

// Páginas públicas + uma entrada por notícia. O domínio vem de
// NEXT_PUBLIC_SITE_URL (lib/seo.tsx).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const noticias = await listarNoticias()
  const maisRecente = noticias[0] ? new Date(noticias[0].data) : new Date()

  const paginas: MetadataRoute.Sitemap = [
    { url: absoluta("/"), changeFrequency: "weekly", priority: 1, lastModified: maisRecente },
    { url: absoluta("/noticias"), changeFrequency: "weekly", priority: 0.8, lastModified: maisRecente },
    { url: absoluta("/central-do-aluno"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluta("/tour-360"), changeFrequency: "yearly", priority: 0.5 },
  ]

  return [
    ...paginas,
    ...noticias.map((n) => ({
      url: absoluta(`/noticias/${n.slug}`),
      lastModified: new Date(n.data),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ]
}
