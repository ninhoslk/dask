import Image from "next/image"

import { imgs, txt, type Conteudo } from "@/lib/conteudo/documento"

// Prints are placed around the headline, never on it: one slot per photo.
const lugares = [
  "left-[var(--margin)] top-[6%] w-[44vw] rotate-[-6deg] md:left-[5%] md:top-[8%] md:w-[16vw] md:rotate-[-8deg]",
  "right-[var(--margin)] bottom-[9%] w-[38vw] rotate-[5deg] md:right-[3%] md:bottom-auto md:top-[5%] md:w-[15vw] md:rotate-[6deg]",
  "hidden md:block right-[5%] bottom-[-7%] w-[13vw] rotate-[-3deg]",
  "hidden md:block left-[6%] bottom-[16%] w-[15vw] rotate-[4deg]",
]

export function Vida({ c }: { c: Conteudo }) {
  const prints = imgs(c, "fotos").slice(0, lugares.length).map((f, i) => ({ ...f, className: lugares[i] }))
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
        <span className="block">{txt(c, "titulo1")}</span>
        <span className="block">{txt(c, "titulo2")}</span>
      </h2>

      {prints.map((p, i) => (
        <figure
          key={i}
          className={`print aspect-[3/4] ${p.className}`}
          data-reveal
          style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
        >
          <Image src={p.src} alt={p.alt} width={1920} height={1440} sizes="(max-width: 768px) 44vw, 19vw" />
        </figure>
      ))}

      <p className="absolute bottom-6 left-5 z-[3] max-w-[30ch] text-[15px] font-semibold md:left-[var(--margin)] md:max-w-[44ch] md:text-base">
        {txt(c, "legenda")}
      </p>
    </section>
  )
}
