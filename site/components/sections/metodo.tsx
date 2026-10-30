import Image from "next/image"

const sas = [
  {
    titulo: "Livros revistos todo ano",
    texto: "Material didático alinhado à BNCC e atualizado anualmente por especialistas.",
  },
  {
    titulo: "Trilhas digitais",
    texto: "Exercícios e gamificação que continuam a aula do livro no ritmo de cada aluno.",
  },
  {
    titulo: "Avaliações que mostram o caminho",
    texto: "Relatórios de desempenho apontam o que revisar, para o professor e para a família.",
  },
  {
    titulo: "Simulados e olimpíadas",
    texto: "Provas no formato do Enem e dos vestibulares e preparação para olimpíadas científicas.",
  },
]

const arvore = [
  {
    titulo: "Um livro para cada leitor",
    texto: "A plataforma recomenda livros no nível e no interesse de cada aluno, no digital e no papel.",
  },
  {
    titulo: "Leitura acompanhada",
    texto: "O professor vê o retrato de cada aluno e turma e sabe quando indicar e intervir.",
  },
  {
    titulo: "Hábito que cresce",
    texto: "A cada leitura a Floresta cresce; missões e conquistas mantêm o ritmo ao longo do ano.",
  },
]

function Lista({ itens }: { itens: { titulo: string; texto: string }[] }) {
  return (
    <dl className="mt-10 flex flex-col gap-6">
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

export function Metodo() {
  return (
    <section
      id="metodo"
      aria-labelledby="metodo-title"
      className="frame bg-field text-field-foreground"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="grid12 gap-y-6">
        <h2 id="metodo-title" className="head col-span-12 lg:col-span-7" data-reveal>
          Aprender fazendo, com método.
        </h2>
        <p
          className="lead col-span-12 max-w-[42ch] lg:col-span-5 lg:self-end"
          data-reveal
          style={{ "--d": "80ms" } as React.CSSProperties}
        >
          O professor orienta, o aluno põe a mão na massa. Por trás disso
          estão dois parceiros presentes no dia a dia do Dask.
        </p>
      </div>

      {/* SAS: text left, pictures right */}
      <div className="grid12 mt-16 gap-y-10 md:mt-24">
        <div className="col-span-12 lg:col-span-6">
          <span className="logo-chip" data-reveal>
            <Image src="/logos/sas.png" alt="SAS Educação" width={201} height={88} className="h-10 w-auto md:h-12" />
          </span>
          <h3 className="mt-6 text-[clamp(26px,2.6vw,40px)] font-extrabold leading-[1.02] tracking-[-0.04em]" data-reveal>
            Sistema de ensino SAS em todas as séries
          </h3>
          <Lista itens={sas} />
        </div>
        <div className="col-span-12 grid grid-cols-6 gap-4 md:gap-5 lg:col-span-6">
          <figure className="media col-span-6 aspect-[16/10]" data-reveal>
            <Image
              src="/fotos/sas-turma.jpg"
              alt="Estudantes resolvendo exercícios juntos em sala de aula"
              width={1920}
              height={1280}
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </figure>
          <figure className="media col-span-3 aspect-square" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
            <Image
              src="/fotos/realidade-virtual.jpg"
              alt="Aluno do Dask usando óculos de realidade virtual em aula"
              width={1920}
              height={1440}
              sizes="(max-width: 1024px) 50vw, 24vw"
            />
          </figure>
          <figure className="media col-span-3 aspect-square" data-reveal style={{ "--d": "160ms" } as React.CSSProperties}>
            <Image
              src="/fotos/sas-maker.jpg"
              alt="Estudantes montando um projeto de cultura maker"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 50vw, 24vw"
            />
          </figure>
        </div>
      </div>

      {/* Árvore: pictures left, text right */}
      <div className="grid12 mt-20 gap-y-10 md:mt-28">
        <div className="col-span-12 grid grid-cols-6 gap-4 md:gap-5 lg:col-span-6">
          <figure className="media col-span-6 aspect-[16/10]" data-reveal>
            <Image
              src="/fotos/arvore-sala.jpg"
              alt="Alunos do Dask lendo na plataforma Árvore durante a aula de Língua Portuguesa"
              width={2200}
              height={1238}
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </figure>
          <figure className="media col-span-3 aspect-square" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
            <Image
              src="/fotos/arvore-notebook.jpg"
              alt="Notebook aberto na biblioteca digital da Árvore"
              width={2200}
              height={1238}
              sizes="(max-width: 1024px) 50vw, 24vw"
            />
          </figure>
          <figure className="media col-span-3 aspect-square" data-reveal style={{ "--d": "160ms" } as React.CSSProperties}>
            <Image
              src="/fotos/arvore-leitura.jpg"
              alt="Estudante lendo um livro com metas de leitura da Árvore"
              width={2128}
              height={1200}
              sizes="(max-width: 1024px) 50vw, 24vw"
              className="object-[70%_50%]"
            />
          </figure>
        </div>
        <div className="order-first col-span-12 lg:order-none lg:col-span-6">
          <span className="logo-chip" data-reveal>
            <Image src="/logos/arvore.svg" alt="Árvore" width={130} height={29} className="h-8 w-auto md:h-9" />
          </span>
          <h3 className="mt-6 text-[clamp(26px,2.6vw,40px)] font-extrabold leading-[1.02] tracking-[-0.04em]" data-reveal>
            Leitura todo dia, com a Árvore
          </h3>
          <p className="mt-4 max-w-[52ch]" data-reveal>
            Nas aulas de Língua Portuguesa, os alunos usam a Árvore, programa de
            formação leitora com o maior acervo do mercado.
          </p>
          <Lista itens={arvore} />
        </div>
      </div>
    </section>
  )
}
