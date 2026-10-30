import Image from "next/image"

// Prints are placed around the headline, never on it.
const prints = [
  {
    src: "/fotos/era-uma-vez.jpg",
    alt: "Alunas do Fundamental I fantasiadas no espetáculo Era uma vez",
    className:
      "left-[var(--margin)] top-[6%] w-[44vw] rotate-[-6deg] md:left-[5%] md:top-[8%] md:w-[16vw] md:rotate-[-8deg]",
  },
  {
    src: "/fotos/volei-time.jpg",
    alt: "Time de vôlei feminino do Colégio Dask na quadra",
    className:
      "right-[var(--margin)] bottom-[13%] w-[44vw] rotate-[5deg] md:right-[6%] md:bottom-auto md:top-[8%] md:w-[18vw] md:rotate-[6deg]",
  },
  {
    src: "/fotos/natal-coral.jpg",
    alt: "Coral de Natal com alunos de camiseta azul do Dask",
    className: "hidden md:block right-[16%] bottom-[-5%] w-[15vw] rotate-[-3deg]",
  },
  {
    src: "/fotos/teatro-compadecida.jpg",
    alt: "Alunos encenando o Auto da Compadecida",
    className: "hidden md:block left-[6%] bottom-[16%] w-[15vw] rotate-[4deg]",
  },
]

export function Vida() {
  return (
    <section
      id="vida"
      aria-labelledby="vida-title"
      className="prints mt-[var(--section-gap)] bg-brand text-foreground"
    >
      <h2
        id="vida-title"
        className="display relative z-[3] text-center text-[21vw] leading-[0.85] md:text-[clamp(120px,13vw,220px)]"
      >
        <span className="block">Vida</span>
        <span className="block">no Dask</span>
      </h2>

      {prints.map((p, i) => (
        <figure
          key={p.src}
          className={`print aspect-[3/4] ${p.className}`}
          data-reveal
          style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
        >
          <Image src={p.src} alt={p.alt} width={1920} height={1440} sizes="(max-width: 768px) 44vw, 19vw" />
        </figure>
      ))}

      <p className="absolute bottom-6 left-5 z-[3] max-w-[30ch] text-[15px] font-semibold md:left-[var(--margin)] md:max-w-[44ch] md:text-base">
        Teatro, coral de Natal, vôlei, xadrez, tênis de mesa e acantonamento:
        a escola continua depois do sinal.
      </p>
    </section>
  )
}
