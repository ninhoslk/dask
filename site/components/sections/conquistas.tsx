"use client"

import { useEffect, useRef, useState } from "react"

import { conquistas } from "@/lib/site"

// Names as one run-on sentence. The lit name follows the scroll: the section is
// taller than the screen and the sentence stays pinned while the reader moves
// through it, so each stretch of scrolling lights the next name.
export function Conquistas() {
  const [lit, setLit] = useState(0)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const run = el.offsetHeight - window.innerHeight
      const progress = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0
      setLit(Math.min(conquistas.length - 1, Math.floor(progress * conquistas.length)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="conquistas-title"
      className="conquistas bg-field text-field-foreground"
    >
      <div className="conquistas-palco frame">
        <p className="names text-[24px] font-extrabold leading-[1.1] tracking-[-0.035em] md:text-[clamp(40px,4.6vw,68px)] md:leading-[1.0]">
          <span id="conquistas-title" role="heading" aria-level={2}>
            Nossos alunos estiveram{" "}
          </span>
          {conquistas.map((nome, i) => (
            <span key={nome}>
              <span data-name {...(i <= lit ? { "data-lit": "" } : {})} {...(i === lit ? { "data-now": "" } : {})}>
                {nome}
              </span>
              {i < conquistas.length - 2 ? ", " : i === conquistas.length - 2 ? " e " : "."}
            </span>
          ))}
        </p>
        <p className="small mt-8 opacity-80 md:mt-12" aria-hidden="true">
          {lit + 1} de {conquistas.length}
        </p>
      </div>
    </section>
  )
}
