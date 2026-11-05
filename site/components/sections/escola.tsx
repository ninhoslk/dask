import Image from "next/image"

import { img, imgs, itens, txt, type Conteudo } from "@/lib/conteudo/documento"
import { HistoriaCinematica } from "@/components/historia-cinematica"
import { contato } from "@/lib/site"

export function Escola({ c }: { c: Conteudo }) {
  const retrato = img(c, "retrato")
  const [grande, foto2, foto3] = imgs(c, "fotos")
  const historia = itens(c, "historia")
  return (
    <section id="escola" aria-labelledby="escola-title">
      <h2 id="escola-title" className="sr-only">
        A escola
      </h2>

      <div className="frame grid12 gap-y-10" style={{ paddingBlock: "var(--section-gap)" }}>
        <div className="col-span-12 lg:col-span-7">
          <p
            data-reveal
            className="text-[22px] leading-[1.25] tracking-[-0.02em] md:text-[clamp(24px,2.5vw,36px)] md:leading-[1.2]"
          >
            <span className="dropcap-portrait">
              <Image
                src={retrato.src}
                alt={retrato.alt}
                width={1920}
                height={1440}
                sizes="(max-width: 640px) 120px, 160px"
              />
            </span>
            <strong className="font-semibold">{txt(c, "destaque")}</strong> {txt(c, "paragrafo1")}
          </p>
          <p
            data-reveal
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="mt-[1.2em] text-[22px] leading-[1.25] tracking-[-0.02em] text-muted-foreground md:text-[clamp(24px,2.5vw,36px)] md:leading-[1.2]"
          >
            {txt(c, "paragrafo2")}
          </p>
          <dl className="small mt-10 grid grid-cols-3 gap-4 md:max-w-xl">
            <div data-reveal>
              <dt className="text-muted-foreground">Onde</dt>
              <dd className="font-semibold">Jardim América, {contato.cidade}</dd>
            </div>
            <div data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
              <dt className="text-muted-foreground">Desde</dt>
              <dd className="font-semibold">1996</dd>
            </div>
            <div data-reveal style={{ "--d": "160ms" } as React.CSSProperties}>
              <dt className="text-muted-foreground">Secretaria</dt>
              <dd className="font-semibold">
                <a href={contato.telefoneHref} className="link">
                  {contato.telefone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* photo pair closing the right side */}
        <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-5 lg:gap-5">
          <figure className="media col-span-2 aspect-[16/10]" data-reveal>
            <Image
              src={grande.src}
              alt={grande.alt}
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </figure>
          <figure className="media aspect-square" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
            <Image
              src={foto2.src}
              alt={foto2.alt}
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 20vw"
            />
          </figure>
          <figure className="media aspect-square" data-reveal style={{ "--d": "180ms" } as React.CSSProperties}>
            <Image
              src={foto3.src}
              alt={foto3.alt}
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 20vw"
            />
          </figure>
        </div>
      </div>

      <div className="bg-field text-field-foreground">
        <HistoriaCinematica titulo={txt(c, "tituloHistoria")} marcos={historia} />
      </div>
    </section>
  )
}
