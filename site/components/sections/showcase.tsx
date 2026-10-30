"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

// One photograph of the Makerníficos, seen from three distances as the reader
// scrolls: the whole team, the flag, then the medals. Scale and translate only,
// so every step transitions smoothly.
const stages = [
  { scale: 1, y: 0 },
  { scale: 1.3, y: 7 },
  { scale: 1.55, y: -13 },
]

const legenda =
  "Os Makerníficos ficaram em 1º lugar na etapa regional da OBR, nível 2 técnico, e o Dask fez história no Torneio Brasil de Robótica."

export function Showcase() {
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
            Robótica é aula <span className="sr-only">com pódio.</span>
          </h2>

          <div className="flex w-full flex-col items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8">
            <span className="hidden md:block" />
            <div className="showcase-frame">
              <Image
                src="/fotos/robotica-bandeira.jpg"
                alt="Equipe Makerníficos do Colégio Dask com a bandeira e as medalhas"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 48vw"
                style={{ transform: `scale(${s.scale}) translateY(${s.y}%)` }}
              />
            </div>
            {/* desktop: caption beside the frame; the phone copy sits below "com pódio." */}
            <p
              className="showcase-caption hidden max-w-[28ch] md:block"
              style={{
                opacity: stage === 2 ? 1 : 0,
                transform: stage === 2 ? "none" : "translateY(12px)",
              }}
            >
              {legenda}
            </p>
          </div>

          <p
            aria-hidden="true"
            className="showcase-second display relative z-10 mt-[0.1em] text-center text-[13vw] md:-mt-[0.3em] md:text-[clamp(56px,7.4vw,124px)]"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "none" : "translateY(0.2em)",
            }}
          >
            com pódio.
          </p>
          <p className="mt-5 max-w-[32ch] text-center md:hidden">{legenda}</p>
        </div>
      </div>
    </section>
  )
}
