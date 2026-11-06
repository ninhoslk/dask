"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

import type { ConteudoDe } from "@/lib/conteudo/esquema"

// One photograph of the Makerníficos, seen from three distances as the reader
// scrolls: the whole team, the flag, then the medals. Scale and translate only,
// so every step transitions smoothly.
const stages = [
  { scale: 1, y: 0 },
  { scale: 1.3, y: 7 },
  { scale: 1.55, y: -13 },
]

export function Showcase({ c }: { c: ConteudoDe<"robotica"> }) {
  const foto = c.foto
  const [stage, setStage] = useState(0)
  const markers = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStage(Number((entry.target as HTMLElement).dataset.stage))
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    markers.current.forEach((m) => m && observer.observe(m))
    return () => observer.disconnect()
  }, [])

  const s = stages[stage]

  return (
    <section
      data-sem-encaixe
      aria-labelledby="robotica-title"
      className="showcase"
      style={{ marginTop: "var(--section-gap)" }}
    >
      {stages.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            markers.current[i] = el
          }}
          data-stage={i}
          aria-hidden="true"
          className="absolute left-0 size-0.5"
          style={{ top: `${i * 55 + 30}vh` }}
        />
      ))}

      <div className="showcase-stage frame">
        <div className="flex w-full flex-col items-center">
          <h2
            id="robotica-title"
            className="display relative z-10 mb-[0.15em] text-center text-[13vw] md:text-[clamp(56px,7.4vw,124px)]"
          >
            {c.titulo1} <span className="sr-only">{c.titulo2}</span>
          </h2>

          <div className="showcase-frame">
            <Image
              src={foto.src}
              alt={foto.alt}
              width={1600}
              height={900}
              // a foto chega a 1,55x do quadro no último passo do zoom; pede a
              // versão do tamanho ampliado para não borrar
              sizes="(max-width: 768px) 155vw, 75vw"
              style={{ transform: `scale(${s.scale}) translateY(${s.y}%)` }}
            />
          </div>

          <p
            aria-hidden="true"
            className="showcase-second display relative z-10 mt-[0.3em] text-center text-[13vw] md:mt-[0.35em] md:text-[clamp(56px,7.4vw,124px)]"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "none" : "translateY(0.2em)",
            }}
          >
            {c.titulo2}
          </p>
        </div>
      </div>
    </section>
  )
}
