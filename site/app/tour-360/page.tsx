import type { Metadata } from "next"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TourAoClicar } from "@/components/tour-ao-clicar"
import { clientePublico } from "@/lib/supabase/publico"
import { permiteIncorporar } from "@/lib/tour"

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
  // Se o site do tour proíbe ser incorporado, um quadro em branco seria pior
  // que um botão: o visitante abre o tour direto, em outra aba.
  const incorporavel = url ? await permiteIncorporar(url, { revalidate: 3600 }) : false

  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <main id="conteudo" className="frame pb-32">
        <h1 className="head mt-20 md:mt-28">{data?.titulo || padrao.titulo}</h1>
        <p className="lead mt-6 max-w-[46ch] text-muted-foreground">{data?.descricao || padrao.descricao}</p>
        {url ? (
          incorporavel ? (
            <TourAoClicar url={url} titulo={data?.titulo || padrao.titulo} />
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-action mt-12 inline-flex">
              Abrir o tour
            </a>
          )
        ) : (
          <p className="mt-12 inline-block rounded-full bg-tint px-5 py-3 font-semibold">Tour em preparação</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
