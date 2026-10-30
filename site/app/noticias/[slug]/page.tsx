import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { Compartilhar } from "@/components/compartilhar"
import { RedesSociais } from "@/components/redes-sociais"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { htmlSeguro, listarNoticias, obterNoticia } from "@/lib/noticias"
import { formatoData, resumoInteiro } from "@/lib/noticias-tipos"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://colegio-dask.vercel.app"

export async function generateStaticParams() {
  return (await listarNoticias()).map((n) => ({ slug: n.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await obterNoticia((await params).slug)
  if (!n) return {}
  return {
    title: `${n.titulo} · Colégio Dask`,
    description: resumoInteiro(n.resumo),
    openGraph: { title: n.titulo, description: resumoInteiro(n.resumo), images: n.imagem ? [n.imagem] : undefined, type: "article" },
  }
}

export default async function PaginaNoticia({ params }: Props) {
  const { slug } = await params
  const n = await obterNoticia(slug)
  if (!n) notFound()

  const todas = await listarNoticias()
  const relacionadas = todas.filter((x) => x.slug !== n.slug && x.categoria === n.categoria).slice(0, 3)
  const url = `${siteUrl}/noticias/${n.slug}`

  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <main id="conteudo" className="frame pb-32">
        <Link href="/noticias" className="link mt-14 inline-flex items-center gap-2 font-semibold md:mt-20">
          <ArrowLeftIcon aria-hidden className="size-4" />
          Todas as notícias
        </Link>

        <article className="mt-8">
          <header className="max-w-5xl">
            <p className="small font-semibold text-sky">{n.categoria}</p>
            <h1 className="mt-2 text-[clamp(32px,4.6vw,68px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-balance">
              {n.titulo}
            </h1>
            <p className="small mt-4 text-muted-foreground">
              <time dateTime={n.data}>{formatoData.format(new Date(n.data))}</time>
            </p>
          </header>

          {n.imagem && (
            <div className="media mt-10 max-h-[78svh] md:mt-14">
              <Image
                src={n.imagem}
                alt=""
                width={1600}
                height={1066}
                sizes="100vw"
                priority
                unoptimized={n.imagem.startsWith("http")}
                className="max-h-[78svh]"
              />
            </div>
          )}

          <div className="grid12 mt-10 gap-y-10 md:mt-14">
            <div
              className="noticia-texto col-span-12 lg:col-span-7"
              dangerouslySetInnerHTML={{ __html: htmlSeguro(n.conteudo) }}
            />
            <aside className="col-span-12 flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
              <Compartilhar url={url} titulo={n.titulo} imagem={n.imagem ?? undefined} />
              <div>
                <p className="font-semibold">Siga o Dask</p>
                <div className="mt-3">
                  <RedesSociais />
                </div>
              </div>
            </aside>
          </div>
        </article>

        {relacionadas.length > 0 && (
          <section aria-labelledby="relacionadas" className="mt-24">
            <h2 id="relacionadas" className="text-[clamp(26px,2.6vw,40px)] font-extrabold tracking-[-0.04em]">
              Mais de {n.categoria === "Geral" ? "o Dask" : n.categoria}
            </h2>
            <ul className="mt-8 grid gap-8 md:grid-cols-3">
              {relacionadas.map((r) => (
                <li key={r.slug}>
                  <Link href={`/noticias/${r.slug}`} className="group block">
                    <div className="media aspect-[4/3]">
                      {r.miniatura && <Image src={r.miniatura} alt="" width={768} height={576} unoptimized sizes="33vw" />}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                      {r.titulo}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
