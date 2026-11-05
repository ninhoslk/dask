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

// "Nossa história" contada pela rolagem: a seção fica fixa na tela e uma linha
// turquesa percorre a faixa dos anos; ao alcançar cada ano, aparece o bloco
// com o fato daquele ano. Reversível (scrub). Com movimento reduzido ou sem
// JavaScript, fica a lista original.
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
      const luzes = gsap.utils.toArray<HTMLElement>(".historia-ponto-luz", raiz)
      const blocos = gsap.utils.toArray<HTMLElement>(".historia-bloco", raiz)
      const fill = raiz.querySelector<HTMLElement>(".historia-fill")
      const ampliado = celular ? 1.12 : 1.15
      const futuro = { opacity: 0.35, scale: 1, color: "var(--field-foreground)" }
      const ativo = { opacity: 1, scale: ampliado, color: "var(--brand)" }
      const percorrido = { opacity: 0.75, scale: 1, color: "var(--field-foreground)" }

      // início: só os anos; linha vazia, nenhum bloco
      gsap.set(anos, futuro)
      gsap.set(luzes, { opacity: 0, scale: 0.4 })
      gsap.set(blocos, { autoAlpha: 0, y: 24 })
      gsap.set(fill, { scaleX: 0 })

      // a linha começa na borda esquerda e termina no último ano; os anos ficam
      // a meio passo da borda, então ela chega ao ano i no tempo 0,5 + i
      const inicio = 0.5
      const tl = gsap.timeline({
        defaults: { duration: 0.35, ease: "power2.out" },
        scrollTrigger: {
          trigger: raiz,
          start: "top top",
          end: () => `+=${window.innerHeight * (celular ? 0.7 : 0.8) * (n + 1)}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // linha: avança junto com a rolagem, sem saltos
      tl.to(fill, { scaleX: 1, duration: n - inicio, ease: "none" }, 0)

      for (let i = 0; i < n; i++) {
        const t = inicio + i
        if (i > 0) {
          tl.to(anos[i - 1], percorrido, t - 0.05)
            .to(blocos[i - 1], { autoAlpha: 0, y: -16, duration: 0.25, ease: "power2.in" }, t - 0.15)
        }
        tl.to(anos[i], ativo, t)
          .to(luzes[i], { opacity: 1, scale: 1 }, t)
          .to(blocos[i], { autoAlpha: 1, y: 0 }, t + 0.1)
      }

      // depois do último fato, uma pausa curta e a página segue
      tl.to({}, { duration: 0.7 })
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
      <div className="historia-palco frame grid12">
        <h3 className="col-span-12 self-start text-[clamp(32px,3.6vw,56px)] font-extrabold leading-none tracking-[-0.045em] lg:col-span-3">
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

        <div
          className="historia-conteudo col-span-12 self-start lg:col-span-9"
          aria-hidden="true"
          style={{ "--n": n } as React.CSSProperties}
        >
          <div className="historia-trilha">
            <div className="historia-linha">
              <div className="historia-fill" />
            </div>
            {marcos.map((m, i) => (
              <div key={i} className="historia-marco">
                <span className="historia-ano tabular-nums">{m.titulo}</span>
                <span className="historia-ponto">
                  <span className="historia-ponto-luz" />
                </span>
              </div>
            ))}
          </div>

          <div className="historia-blocos">
            {marcos.map((m, i) => (
              <div key={i} className="historia-bloco" style={{ "--i": i } as React.CSSProperties}>
                <span className="historia-bloco-ano tabular-nums">{m.titulo}</span>
                <span className="historia-bloco-texto">{m.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
