import Image from "next/image"

import { contato, linhaDoTempo } from "@/lib/site"

export function Escola() {
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
                src="/fotos/professoras.jpg"
                alt="Duas professoras do Colégio Dask com a camiseta da escola"
                width={1920}
                height={1440}
                sizes="(max-width: 640px) 120px, 160px"
              />
            </span>
            <strong className="font-semibold">O Colégio Dask</strong> nasceu da
            ideia de um grupo de professores de Dracena. Ensinar, para nós, é
            revelar o talento de cada aluno.
          </p>
          <p
            data-reveal
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="mt-[1.2em] text-[22px] leading-[1.25] tracking-[-0.02em] text-muted-foreground md:text-[clamp(24px,2.5vw,36px)] md:leading-[1.2]"
          >
            Hoje são mais de 700 alunos, do Fundamental I ao Médio. O nome
            mudou em 2022; a ideia continua: evoluir para transformar.
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
              src="/fotos/formandos.jpg"
              alt="Formandos do Colégio Dask reunidos no palco"
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </figure>
          <figure className="media aspect-square" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
            <Image
              src="/fotos/makernificos.jpg"
              alt="Equipe de robótica Makerníficos com professores"
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 20vw"
            />
          </figure>
          <figure className="media aspect-square" data-reveal style={{ "--d": "180ms" } as React.CSSProperties}>
            <Image
              src="/fotos/patio-turma.jpg"
              alt="Alunos do Fundamental posando na quadra de areia"
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 20vw"
            />
          </figure>
        </div>
      </div>

      <div className="bg-field text-field-foreground">
        <div className="frame grid12 gap-y-8" style={{ paddingBlock: "clamp(64px, 7vw, 112px)" }}>
          <h3 className="col-span-12 text-[clamp(32px,3.6vw,56px)] font-extrabold leading-none tracking-[-0.045em] lg:col-span-3" data-reveal>
            Nossa história
          </h3>
          <ol className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-9 lg:grid-cols-7">
            {linhaDoTempo.map((item, i) => (
              <li
                key={item.ano}
                data-reveal
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                <span className="block text-4xl font-extrabold tracking-[-0.05em] text-brand tabular-nums">
                  {item.ano}
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
