import { PaginaInicial } from "@/components/pagina-inicial"
import { SiteFooter } from "@/components/site-footer"
import { resolver } from "@/lib/conteudo/documento"
import { documentoPublicado } from "@/lib/conteudo/obter"
import { listarNoticias } from "@/lib/noticias"
import { paraCartao } from "@/lib/noticias-tipos"

export default async function Home() {
  const [doc, noticias] = await Promise.all([documentoPublicado(), listarNoticias()])

  return (
    <>
      <main id="conteudo">
        <PaginaInicial secoes={resolver(doc)} noticias={noticias.slice(0, 5).map(paraCartao)} />
      </main>
      <SiteFooter />
    </>
  )
}
