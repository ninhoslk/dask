import Image from "next/image"

import noticias from "@/lib/noticias.json"

type Noticia = (typeof noticias)[number]

// The robotics section already shows this post's cover, so the news list
// uses another photo from the same post.
const outraFoto: Record<string, string> = {
  "dia-de-celebrar-conquistas-que-vao-muito-alem-dos-conteudos-didaticos":
    "/fotos/robotica-bandeira-2.jpg",
}

const formato = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

// Excerpts come cut mid-sentence from WordPress; keep whole sentences only.
function resumo(texto: string) {
  const fim = Math.max(texto.lastIndexOf("!"), texto.lastIndexOf("."))
  return fim > 60 ? texto.slice(0, fim + 1) : texto
}

function Data({ n }: { n: Noticia }) {
  return (
    <p className="small mt-1 text-muted-foreground">
      <time dateTime={n.date}>{formato.format(new Date(n.date))}</time>
    </p>
  )
}

export function Noticias() {
  const [destaque, ...resto] = noticias

  return (
    <section
      id="noticias"
      aria-labelledby="noticias-title"
      className="frame"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="grid12 items-end gap-y-6">
        <h2 id="noticias-title" className="head col-span-12 md:col-span-8" data-reveal>
          Acontece no Dask
        </h2>
        <a
          href="https://colegiodask.com.br/blog/"
          target="_blank"
          rel="noopener noreferrer"
          className="link col-span-12 font-semibold md:col-span-4 md:justify-self-end"
        >
          Todas as notícias
        </a>
      </div>

      <div className="grid12 mt-14 gap-y-14">
        <article className="col-span-12 lg:col-span-6" data-reveal>
          <a href={destaque.url} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="media aspect-[4/3]">
              <Image
                src={outraFoto[destaque.slug] ?? destaque.image}
                alt=""
                width={1024}
                height={768}
                sizes="(max-width: 768px) 100vw, 48vw"
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-5">
              <h3 className="text-[19px] md:text-[26px] font-extrabold leading-[1.05] tracking-[-0.04em] text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {destaque.title}
              </h3>
              <Data n={destaque} />
              <p className="mt-3 max-w-[60ch]">{resumo(destaque.excerpt)}</p>
            </div>
          </a>
        </article>

        <ul className="col-span-12 grid gap-7 md:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:grid-cols-1">
          {resto.slice(0, 4).map((n, i) => (
            <li
              key={n.slug}
              data-reveal
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
            >
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[88px_1fr] items-start gap-4 sm:grid-cols-[112px_1fr]"
              >
                <div className="media aspect-square">
                  <Image src={n.image} alt="" width={240} height={240} sizes="112px" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                    {n.title}
                  </h3>
                  <Data n={n} />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
