import type { Metadata } from "next"

import { ListaNoticias } from "@/components/lista-noticias"
import { RedesSociais } from "@/components/redes-sociais"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { preencher, txt } from "@/lib/conteudo/documento"
import { configPublicada } from "@/lib/conteudo/obter"
import { listarCartoes } from "@/lib/noticias"

export async function generateMetadata(): Promise<Metadata> {
  const nome = txt((await configPublicada()).identidade, "nome")
  return {
    title: `Notícias · ${nome}`,
    description: `Tudo o que acontece no ${nome}: ensino, eventos, olimpíadas, robótica e a vida na escola.`,
  }
}

export default async function PaginaNoticias() {
  const [noticias, cfg] = await Promise.all([listarCartoes(), configPublicada()])
  const primeiroAno = noticias.length ? new Date(noticias[noticias.length - 1].data).getFullYear() : 2022

  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <main id="conteudo" className="frame pb-32">
        <div className="grid12 mt-20 items-end gap-y-6 md:mt-28">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="head">{txt(cfg.paginas, "noticiasTitulo")}</h1>
            <p className="lead mt-6 max-w-[46ch] text-muted-foreground">
              {preencher(txt(cfg.paginas, "noticiasTexto"), { total: String(noticias.length), ano: String(primeiroAno) })}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:justify-self-end">
            <RedesSociais />
          </div>
        </div>
        <ListaNoticias noticias={noticias} />
      </main>
      <SiteFooter />
    </>
  )
}
