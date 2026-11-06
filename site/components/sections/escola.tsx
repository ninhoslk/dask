import Image from "next/image"
import Link from "next/link"

import { img, imgs, itens, txt, type Conteudo } from "@/lib/conteudo/documento"
import { contato, mensagemVisita, whatsappLink } from "@/lib/site"

export function Escola({ c }: { c: Conteudo }) {
  const retrato = img(c, "retrato")
  const [grande, foto2, foto3] = imgs(c, "fotos")
  const historia = itens(c, "historia")
  return (
    <section id="escola" aria-labelledby="escola-title">
      <h2 id="escola-title" className="sr-only">
        A escola
      </h2>

      {/* revista aberta: os dois parágrafos lado a lado e, embaixo, as três
          fotos numa faixa de mesma altura. Sem colunas de alturas diferentes,
          não sobra vazio em nenhuma largura. */}
      <div className="frame" style={{ paddingBlock: "var(--section-gap)" }}>
        <div className="grid12 gap-y-[1.2em] text-[22px] leading-[1.25] tracking-[-0.02em] md:text-[clamp(24px,2.5vw,36px)] md:leading-[1.2]">
          <p data-reveal className="col-span-12 lg:col-span-6">
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
            className="col-span-12 text-muted-foreground lg:col-span-6"
          >
            {txt(c, "paragrafo2")}
          </p>
        </div>

        <div className="grid12 mt-10 items-end gap-y-8 md:mt-14">
          <dl className="col-span-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-6">
            <div data-reveal className="col-span-2 sm:col-span-1">
              <dt className="small text-muted-foreground">Onde</dt>
              <dd className="font-semibold">
                Jardim América, <span className="whitespace-nowrap">{contato.cidade}</span>
              </dd>
            </div>
            <div data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
              <dt className="small text-muted-foreground">Desde</dt>
              <dd className="font-semibold">{txt(c, "desde")}</dd>
            </div>
            <div data-reveal style={{ "--d": "160ms" } as React.CSSProperties}>
              <dt className="small text-muted-foreground">Secretaria</dt>
              <dd className="font-semibold">
                <a href={contato.telefoneHref} className="link">
                  {contato.telefone}
                </a>
              </dd>
            </div>
          </dl>
          <div
            className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-6"
            data-reveal
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            <a href={whatsappLink(mensagemVisita)} target="_blank" rel="noopener noreferrer" className="btn-action">
              Agendar visita
            </a>
            <Link href="/tour-360" className="link font-semibold">
              Conheça a escola no Tour 360°
            </Link>
          </div>
        </div>

        {/* faixa de fotos: a grande ocupa metade, as outras duas um quarto cada */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 lg:grid-cols-4 lg:gap-5">
          <figure className="media col-span-2 aspect-[16/10] lg:aspect-auto lg:h-[clamp(320px,26vw,520px)]" data-reveal>
            <Image
              src={grande.src}
              alt={grande.alt}
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </figure>
          <figure className="media aspect-square lg:aspect-auto lg:h-[clamp(320px,26vw,520px)]" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
            <Image
              src={foto2.src}
              alt={foto2.alt}
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </figure>
          <figure className="media aspect-square lg:aspect-auto lg:h-[clamp(320px,26vw,520px)]" data-reveal style={{ "--d": "180ms" } as React.CSSProperties}>
            <Image
              src={foto3.src}
              alt={foto3.alt}
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </figure>
        </div>
      </div>

      <div className="bg-field text-field-foreground">
        <div className="frame grid12 gap-y-8" style={{ paddingBlock: "clamp(64px, 7vw, 112px)" }}>
          <h3 className="col-span-12 text-[clamp(32px,3.6vw,56px)] font-extrabold leading-none tracking-[-0.045em] lg:col-span-3" data-reveal>
            {txt(c, "tituloHistoria")}
          </h3>
          <ol className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-9 lg:grid-cols-7">
            {historia.map((item, i) => (
              <li
                key={i}
                data-reveal
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                <span className="block text-4xl font-extrabold tracking-[-0.05em] text-brand tabular-nums">
                  {item.titulo}
                </span>
                <span className="small mt-2 block opacity-90">{item.texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
