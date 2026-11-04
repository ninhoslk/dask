import type { Metadata } from "next"

import { ListaNoticias } from "@/components/lista-noticias"
import { RedesSociais } from "@/components/redes-sociais"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { listarNoticias } from "@/lib/noticias"
import { paraCartao } from "@/lib/noticias-tipos"

export const metadata: Metadata = {
  alternates: { canonical: "/noticias" },
  title: "Notícias · Colégio Dask",
  description: "Tudo o que acontece no Colégio Dask: ensino, eventos, olimpíadas, robótica e a vida na escola.",
}

export default async function PaginaNoticias() {
  const noticias = (await listarNoticias()).map(paraCartao)
  const primeiroAno = noticias.length ? new Date(noticias[noticias.length - 1].data).getFullYear() : 2022

  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <main id="conteudo" className="frame pb-32">
        <div className="grid12 mt-20 items-end gap-y-6 md:mt-28">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="head">Acontece no Dask</h1>
            <p className="lead mt-6 max-w-[46ch] text-muted-foreground">
              {noticias.length} notícias desde {primeiroAno}, do
              blog do colégio e das nossas redes.
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
