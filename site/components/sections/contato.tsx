import Image from "next/image"

import { FaixaFotos } from "@/components/sections/faixa-fotos"
import { contato, mensagemVisita, whatsappLink } from "@/lib/site"

export function Contato() {
  return (
    <section
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
            Venha nos visitar
          </h2>
          <p className="mt-6 text-[22px] leading-[1.25] tracking-[-0.02em] md:text-[clamp(24px,2.4vw,34px)]">
            Conheça as salas, o laboratório, a quadra e as pessoas que vão
            acompanhar seu filho.
          </p>
        </div>

        <div className="col-span-12 grid grid-cols-[96px_1fr] gap-5 sm:grid-cols-[140px_1fr] md:col-span-5 md:col-start-8 md:grid-cols-[160px_1fr] md:gap-8">
          <div className="media drift aspect-square" data-reveal>
            <Image
              src="/fotos/campus.jpg"
              alt="Alunos no gramado do campus do Colégio Dask"
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
    </section>
  )
}
