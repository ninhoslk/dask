import Image from "next/image"
import Link from "next/link"

import { txt, type Conteudo } from "@/lib/conteudo/documento"
import { formatoData, resumoInteiro, type NoticiaCartao } from "@/lib/noticias-tipos"

// The robotics section already shows this post's cover, so the news list
// uses another photo from the same post.
const outraFoto: Record<string, string> = {
  "dia-de-celebrar-conquistas-que-vao-muito-alem-dos-conteudos-didaticos":
    "/fotos/robotica-bandeira-2.jpg",
}

function Data({ n }: { n: NoticiaCartao }) {
  return (
    <p className="small mt-1 text-muted-foreground">
      <time dateTime={n.data}>{formatoData.format(new Date(n.data))}</time>
    </p>
  )
}

export function Noticias({ c, noticias }: { c: Conteudo; noticias: NoticiaCartao[] }) {
  const [destaque, ...resto] = noticias
  if (!destaque) return null
  const capa = outraFoto[destaque.slug] ?? destaque.imagem

  return (
    <section
      data-encaixe
      id="noticias"
      aria-labelledby="noticias-title"
      className="frame"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="grid12 items-end gap-y-6">
        <h2 id="noticias-title" className="head col-span-12 md:col-span-8" data-reveal>
          {txt(c, "titulo")}
        </h2>
        <Link href="/noticias" className="link col-span-12 font-semibold md:col-span-4 md:justify-self-end">
          {txt(c, "link")}
        </Link>
      </div>

      <div className="grid12 mt-14 gap-y-14">
        <article className="col-span-12 lg:col-span-6" data-reveal>
          <Link href={`/noticias/${destaque.slug}`} className="group block">
            {capa && (
              <div className="media aspect-[4/3]">
                <Image
                  src={capa}
                  alt=""
                  width={1024}
                  height={768}
                  sizes="(max-width: 768px) 100vw, 48vw"
                  unoptimized={capa.startsWith("http")}
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div className="mt-5">
              <h3 className="text-[19px] md:text-[26px] font-extrabold leading-[1.05] tracking-[-0.04em] text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {destaque.titulo}
              </h3>
              <Data n={destaque} />
              <p className="mt-3 max-w-[60ch]">{resumoInteiro(destaque.resumo)}</p>
            </div>
          </Link>
        </article>

        <ul className="col-span-12 grid gap-7 md:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:grid-cols-1">
          {resto.slice(0, 4).map((n, i) => (
            <li
              key={n.slug}
              data-reveal
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
            >
              <Link
                href={`/noticias/${n.slug}`}
                className="group grid grid-cols-[88px_1fr] items-start gap-4 sm:grid-cols-[112px_1fr]"
              >
                <div className="media aspect-square">
                  {n.miniatura && (
                    <Image src={n.miniatura} alt="" width={240} height={240} sizes="112px" unoptimized={n.miniatura.startsWith("http")} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                    {n.titulo}
                  </h3>
                  <Data n={n} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
