import Image from "next/image"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { imgs, itens, txt, type Conteudo } from "@/lib/conteudo/documento"
import type { Imagem } from "@/lib/conteudo/esquema"
import { parceiros } from "@/lib/site"

function Lista({ itens }: { itens: { titulo: string; texto: string }[] }) {
  return (
    <dl className="mt-8 flex flex-col gap-5">
      {itens.map((p, i) => (
        <div
          key={p.titulo}
          data-reveal
          style={{ "--d": `${120 + i * 70}ms` } as React.CSSProperties}
          className="grid gap-1 sm:grid-cols-[minmax(0,14ch)_1fr] sm:gap-8"
        >
          <dt className="font-semibold text-brand">{p.titulo}</dt>
          <dd>{p.texto}</dd>
        </div>
      ))}
    </dl>
  )
}

type Foto = Imagem & { className?: string }

// One partner: text with its logo on one side, a compact photo cluster on the
// other (one wide picture beside two stacked squares), so both columns end at
// about the same height. Logo and "Ver mais" open the partner's own site.
function Parceiro({
  nome,
  verMais,
  site,
  logo,
  titulo,
  texto,
  itens,
  fotos,
  invertido = false,
  className,
}: {
  nome: string
  verMais: string
  site: string
  logo: React.ReactNode
  titulo: string
  texto?: string
  itens: { titulo: string; texto: string }[]
  fotos: Foto[]
  invertido?: boolean
  className?: string
}) {
  const [grande, ...pequenas] = fotos
  return (
    <div className={cn("grid12 items-center gap-y-10", className)}>
      <div className={cn("col-span-12 lg:col-span-6", invertido && "lg:order-last")}>
        <a
          href={site}
          target="_blank"
          rel="noopener noreferrer"
          className="logo-chip transition-transform duration-200 hover:scale-[1.03]"
          aria-label={`Site do ${nome}`}
          data-reveal
        >
          {logo}
        </a>
        <h3 className="mt-6 text-[clamp(26px,2.6vw,40px)] font-extrabold leading-[1.02] tracking-[-0.04em]" data-reveal>
          {titulo}
        </h3>
        {texto && (
          <p className="mt-4 max-w-[52ch]" data-reveal>
            {texto}
          </p>
        )}
        <Lista itens={itens} />
        <a href={site} target="_blank" rel="noopener noreferrer" className="btn-action mt-8" data-reveal>
          {verMais}
          <ArrowUpRightIcon aria-hidden className="size-4" />
        </a>
      </div>
      <div className="col-span-12 grid grid-cols-3 grid-rows-2 gap-4 md:gap-5 lg:col-span-6">
        <figure className="media col-span-2 row-span-2" data-reveal>
          <Image
            src={grande.src}
            alt={grande.alt}
            width={1920}
            height={1280}
            sizes="(max-width: 1024px) 66vw, 32vw"
            className={grande.className}
          />
        </figure>
        {pequenas.map((f, i) => (
          <figure
            key={i}
            className="media aspect-square"
            data-reveal
            style={{ "--d": `${90 + i * 70}ms` } as React.CSSProperties}
          >
            <Image src={f.src} alt={f.alt} width={1200} height={1200} sizes="(max-width: 1024px) 33vw, 16vw" className={f.className} />
          </figure>
        ))}
      </div>
    </div>
  )
}

export function Metodo({ c }: { c: Conteudo }) {
  const [sas1, sas2, sas3] = imgs(c, "sasFotos")
  const [arv1, arv2, arv3] = imgs(c, "arvoreFotos")
  return (
    <section
      id="metodo"
      aria-labelledby="metodo-title"
      className="frame bg-field text-field-foreground"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="flex flex-col gap-6">
        <h2 id="metodo-title" className="head" data-reveal>
          {txt(c, "titulo")}
        </h2>
        <p
          className="lead max-w-[42ch]"
          data-reveal
          style={{ "--d": "80ms" } as React.CSSProperties}
        >
          {txt(c, "texto")}
        </p>
      </div>

      <Parceiro
        nome="SAS Educação"
        verMais="Ver mais sobre o SAS"
        site={parceiros.sas}
        logo={<Image src="/logos/sas.png" alt="SAS Educação" width={201} height={88} className="h-10 w-auto md:h-12" />}
        titulo={txt(c, "sasTitulo")}
        itens={itens(c, "sasItens")}
        fotos={[sas1, sas2, sas3]}
        className="mt-14 md:mt-20"
      />

      <Parceiro
        nome="Árvore"
        verMais="Ver mais sobre a Árvore"
        site={parceiros.arvore}
        logo={<Image src="/logos/arvore.svg" alt="Árvore" width={130} height={29} className="h-8 w-auto md:h-9" />}
        titulo={txt(c, "arvoreTitulo")}
        texto={txt(c, "arvoreTexto")}
        itens={itens(c, "arvoreItens")}
        fotos={[arv1, arv2, { ...arv3, className: arv3.src === "/fotos/arvore-leitura.jpg" ? "object-[70%_50%]" : undefined }]}
        invertido
        className="mt-16 md:mt-24"
      />
    </section>
  )
}
