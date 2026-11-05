"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type Marco = { titulo: string; texto: string }

const consulta = "(prefers-reduced-motion: reduce)"
const assinar = (aviso: () => void) => {
  const m = window.matchMedia(consulta)
  m.addEventListener("change", aviso)
  return () => m.removeEventListener("change", aviso)
}
// no servidor (e sem JavaScript) a linha do tempo é a lista estática
const comMovimento = () => !window.matchMedia(consulta).matches
const noServidor = () => false

// "Nossa história" contada pela rolagem: a seção fica fixa na tela e cada
// rolada avança um ano. A trilha turquesa enche até o ano ativo; o último
// marco (Colégio Dask) segura um instante antes de liberar a página.
// Com movimento reduzido, fica a lista de sempre.
export function HistoriaCinematica({ titulo, marcos }: { titulo: string; marcos: Marco[] }) {
  const animar = useSyncExternalStore(assinar, comMovimento, noServidor)

  if (!animar || marcos.length < 2) {
    return (
      <div className="frame grid12 gap-y-8" style={{ paddingBlock: "clamp(64px, 7vw, 112px)" }}>
        <h3
          className="col-span-12 text-[clamp(32px,3.6vw,56px)] font-extrabold leading-none tracking-[-0.045em] lg:col-span-3"
          data-reveal
        >
          {titulo}
        </h3>
        <ol className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-9 lg:grid-cols-7">
          {marcos.map((item, i) => (
            <li key={i} data-reveal style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <span className="block text-4xl font-extrabold tracking-[-0.05em] text-brand tabular-nums">
                {item.titulo}
              </span>
              <span className="small mt-2 block opacity-90">{item.texto}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return <Cinematica titulo={titulo} marcos={marcos} />
}

function Cinematica({ titulo, marcos }: { titulo: string; marcos: Marco[] }) {
  const raizRef = useRef<HTMLDivElement>(null)
  const n = marcos.length

  useEffect(() => {
    const raiz = raizRef.current
    if (!raiz) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia(raiz)

    mm.add({ celular: "(max-width: 639px)", maior: "(min-width: 640px)" }, (ctx) => {
      const celular = Boolean(ctx.conditions?.celular)
      const anos = gsap.utils.toArray<HTMLElement>(".historia-ano", raiz)
      const fatos = gsap.utils.toArray<HTMLElement>(".historia-fato", raiz)
      const pontos = gsap.utils.toArray<HTMLElement>(".historia-ponto", raiz)
      const fill = raiz.querySelector<HTMLElement>(".historia-fill")
      const escalaAtiva = celular ? 1.18 : 1.3
      const brilho = "0 0 22px color-mix(in srgb, var(--brand) 55%, transparent)"
      const semBrilho = "0 0 0px color-mix(in srgb, var(--brand) 0%, transparent)"

      // estado inicial: primeiro ano ativo, primeiro fato à vista
      gsap.set(anos, { opacity: 0.38, scale: 1, color: "var(--field-foreground)", textShadow: semBrilho })
      gsap.set(anos[0], { opacity: 1, scale: escalaAtiva, color: "var(--brand)", textShadow: brilho })
      gsap.set(pontos, { scale: 0.6, opacity: 0.5 })
      gsap.set(pontos[0], { scale: 1, opacity: 1 })
      gsap.set(fatos, { autoAlpha: 0, y: 40, scale: 0.96 })
      gsap.set(fatos[0], { autoAlpha: 1, y: 0, scale: 1 })
      gsap.set(fill, { scaleX: 0.5 / n })

      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.5 },
        scrollTrigger: {
          trigger: raiz,
          start: "top top",
          end: () => `+=${window.innerHeight * (celular ? 0.75 : 0.9) * n}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // trilha: enche do centro do primeiro ano ao centro do último
      tl.to(fill, { scaleX: (n - 0.5) / n, ease: "none", duration: n - 1 }, 0)

      for (let i = 1; i < n; i++) {
        const t = i - 0.5
        tl.to(fatos[i - 1], { autoAlpha: 0, y: -40, scale: 0.98, duration: 0.35, ease: "power2.in" }, t - 0.2)
          .to(fatos[i], { autoAlpha: 1, y: 0, scale: 1 }, t + 0.1)
          .to(anos[i - 1], { opacity: 0.38, scale: 1, color: "var(--field-foreground)", textShadow: semBrilho }, t - 0.1)
          .to(anos[i], { opacity: 1, scale: escalaAtiva, color: "var(--brand)", textShadow: brilho }, t)
          .to(pontos[i - 1], { scale: 0.6, opacity: 0.5 }, t - 0.1)
          .to(pontos[i], { scale: 1, opacity: 1 }, t)
      }

      // último marco: a trilha fecha e o fato final cresce um pouco; segura antes de soltar
      tl.to(fill, { scaleX: 1, ease: "none", duration: 0.4 }, n - 1)
        .to(fatos[n - 1], { scale: 1.04, duration: 0.4 }, n - 1)
        .to({}, { duration: 0.6 })
    })

    // outras seções mudam de altura ao carregar imagens; recalcula o pin
    const recalcular = () => ScrollTrigger.refresh()
    window.addEventListener("load", recalcular)
    return () => {
      window.removeEventListener("load", recalcular)
      mm.revert()
    }
  }, [n])

  return (
    <div ref={raizRef} className="historia">
      <div className="historia-palco frame">
        <h3 className="text-[clamp(32px,3.6vw,56px)] font-extrabold leading-none tracking-[-0.045em]">
          {titulo}
        </h3>

        {/* leitores de tela recebem a lista inteira; a cena visual é decorativa */}
        <ol className="sr-only">
          {marcos.map((m, i) => (
            <li key={i}>
              {m.titulo}: {m.texto}
            </li>
          ))}
        </ol>

        <div className="historia-cena" aria-hidden="true">
          {marcos.map((m, i) => (
            <p key={i} className="historia-fato" data-final={i === n - 1 || undefined}>
              <span className="historia-fato-ano tabular-nums">{m.titulo}</span>
              <span className="historia-fato-texto">{m.texto}</span>
            </p>
          ))}
        </div>

        <div className="historia-trilha" aria-hidden="true" style={{ "--n": n } as React.CSSProperties}>
          <div className="historia-linha">
            <div className="historia-fill" />
          </div>
          {marcos.map((m, i) => (
            <div key={i} className="historia-marco">
              <span className="historia-ponto" />
              <span className="historia-ano tabular-nums">{m.titulo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
