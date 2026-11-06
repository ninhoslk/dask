import Image from "next/image"
import { MapPinIcon } from "lucide-react"

import { FaixaFotos } from "@/components/sections/faixa-fotos"
import { img, txt, type Conteudo } from "@/lib/conteudo/documento"
import { contato, mensagemVisita, whatsappLink } from "@/lib/site"

export function Contato({ c }: { c: Conteudo }) {
  const foto = img(c, "foto")
  const fachada = img(c, "fachada")
  return (
    <section
      data-encaixe
      id="contato"
      aria-labelledby="contato-title"
      className="frame bg-tint"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="-mx-[var(--margin)] mb-16 md:mb-24">
        <FaixaFotos reverso />
      </div>

      <div className="grid12 items-start gap-y-10">
        <div className="col-span-12 md:col-span-6" data-reveal>
          <h2 id="contato-title" className="head">
            {txt(c, "titulo")}
          </h2>
          <p className="mt-6 text-[22px] leading-[1.25] tracking-[-0.02em] md:text-[clamp(24px,2.4vw,34px)]">
            {txt(c, "texto")}
          </p>
        </div>

        <div className="col-span-12 grid grid-cols-[96px_1fr] gap-5 sm:grid-cols-[140px_1fr] md:col-span-5 md:col-start-8 md:grid-cols-[160px_1fr] md:gap-8">
          <div className="media drift aspect-square" data-reveal>
            <Image
              src={foto.src}
              alt={foto.alt}
              width={1920}
              height={1440}
              sizes="160px"
            />
          </div>
          <div
            className="flex flex-col gap-3"
            data-reveal
            style={{ "--d": "90ms" } as React.CSSProperties}
          >
            <p className="text-lg font-semibold">Como prefere falar com a gente?</p>
            <a
              href={whatsappLink(mensagemVisita)}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-lg"
            >
              WhatsApp {contato.whatsapp}
            </a>
            <a href={`mailto:${contato.email}`} className="link text-lg break-all">
              {contato.email}
            </a>
            <p className="small text-muted-foreground">
              {contato.endereco}, {contato.cidade}
            </p>
          </div>
        </div>
      </div>

      {/* where we are: the façade from the drone beside the live map */}
      <section className="grid12 mt-16 gap-y-5 md:mt-24" aria-labelledby="localizacao-title">
        <h3
          id="localizacao-title"
          className="col-span-12 text-[clamp(26px,2.6vw,40px)] font-extrabold leading-[1.02] tracking-[-0.04em]"
          data-reveal
        >
          {txt(c, "tituloLocal")}
        </h3>
        <figure className="media col-span-12 aspect-[16/10] lg:col-span-7 lg:aspect-auto" data-reveal>
          <Image
            src={fachada.src}
            alt={fachada.alt}
            width={2000}
            height={1126}
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </figure>
        <div
          className="col-span-12 flex flex-col gap-4 lg:col-span-5"
          data-reveal
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <div className="media aspect-[4/3] w-full">
            <iframe
              src={contato.mapaEmbed}
              title="Mapa com a localização do Colégio Dask em Dracena-SP"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full border-0"
              data-lenis-prevent
            />
          </div>
          <a href={contato.mapa} target="_blank" rel="noopener noreferrer" className="btn-action self-start">
            <MapPinIcon aria-hidden className="size-4" />
            Como chegar
          </a>
        </div>
      </section>
    </section>
  )
}
