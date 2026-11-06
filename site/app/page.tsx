import { PaginaInicial } from "@/components/pagina-inicial"
import { SiteFooter } from "@/components/site-footer"
import { resolver } from "@/lib/conteudo/documento"
import { documentoPublicado } from "@/lib/conteudo/obter"
import { listarCartoes } from "@/lib/noticias"

export default async function Home() {
  const [doc, noticias] = await Promise.all([documentoPublicado(), listarCartoes(5)])

  return (
    <>
      <main id="conteudo">
        <PaginaInicial secoes={resolver(doc)} noticias={noticias} />
      </main>
      <SiteFooter />
    </>
  )
}
