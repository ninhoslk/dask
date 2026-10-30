import type { Metadata } from "next"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { clientePublico } from "@/lib/supabase/publico"

export const metadata: Metadata = {
  title: "Tour 360° · Colégio Dask",
  description: "Conheça os espaços do Colégio Dask em um tour virtual 360°.",
}

const padrao = {
  titulo: "Tour 360° pelo Colégio Dask",
  descricao: "Em breve você vai poder conhecer cada espaço da escola sem sair de casa.",
}

export default async function Tour360() {
  const sb = clientePublico()
  const { data } = sb
    ? await sb.from("tour360").select("ativo,titulo,descricao,url_embed").eq("id", 1).maybeSingle()
    : { data: null }
  const url = data?.ativo && data.url_embed?.startsWith("https://") ? data.url_embed : null

  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <main id="conteudo" className="frame pb-32">
        <h1 className="head mt-20 md:mt-28">{data?.titulo || padrao.titulo}</h1>
        <p className="lead mt-6 max-w-[46ch] text-muted-foreground">{data?.descricao || padrao.descricao}</p>
        {url ? (
          <>
            <div className="media mt-12 aspect-video">
              <iframe
                src={url}
                title={data?.titulo || padrao.titulo}
                className="size-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                loading="lazy"
              />
            </div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-action mt-6 inline-flex">
              Abrir o tour em tela cheia
            </a>
          </>
        ) : (
          <p className="mt-12 inline-block rounded-full bg-tint px-5 py-3 font-semibold">Tour em preparação</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
