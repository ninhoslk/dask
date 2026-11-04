import type { Metadata } from "next"

import { PaginaInicial } from "@/components/pagina-inicial"
import { SiteFooter } from "@/components/site-footer"
import { resolver } from "@/lib/conteudo/documento"
import { documentoPublicado } from "@/lib/conteudo/obter"
import { listarNoticias } from "@/lib/noticias"
import { paraCartao } from "@/lib/noticias-tipos"
import { JsonLd, dadosDaEscola } from "@/lib/seo"

export const metadata: Metadata = { alternates: { canonical: "/" } }

export default async function Home() {
  const [doc, noticias] = await Promise.all([documentoPublicado(), listarNoticias()])

  return (
    <>
      <JsonLd dados={dadosDaEscola()} />
      <main id="conteudo">
        <PaginaInicial secoes={resolver(doc)} noticias={noticias.slice(0, 5).map(paraCartao)} />
      </main>
      <SiteFooter />
    </>
  )
}
