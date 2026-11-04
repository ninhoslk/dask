"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { SiteHeader } from "@/components/site-header"
import {
  alturaSecao,
  blocos,
  carregamentoParalelo,
  duracaoTransicao,
  larguraMobile,
  sequencias,
  type SequenciaFrames,
} from "@/lib/hero-cinematico"
import { Linhas } from "@/components/linhas"
import { txt, type Conteudo } from "@/lib/conteudo/documento"
import { mensagemVisita, whatsappLink } from "@/lib/site"

// Abertura de tela cheia: o voo do drone até a porta do Dask avança e volta
// conforme o scroll. A seção é alta e o palco fica preso (sticky) enquanto o
// progresso vai de 0 a 1; o frame desenhado no canvas é progresso × (n − 1).
// Todo o trabalho por scroll acontece num único requestAnimationFrame e
// escreve direto no DOM, sem re-render do React.

const consultaReduzido = "(prefers-reduced-motion: reduce)"
const assinarReduzido = (aviso: () => void) => {
  const mq = window.matchMedia(consultaReduzido)
  mq.addEventListener("change", aviso)
  return () => mq.removeEventListener("change", aviso)
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** opacidade de um bloco para um dado progresso: rampa de entrada e de saída */
function visibilidade(p: number, entra: number, sai: number) {
  const d = duracaoTransicao
  const dentro = entra <= 0 ? 1 : clamp((p - (entra - d)) / d)
  const fora = sai >= 1 ? 1 : clamp(((sai + d) - p) / d)
  return Math.min(dentro, fora)
}

/** desenha a imagem cobrindo o canvas inteiro, sem distorcer (object-fit: cover) */
function desenharCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * escala
  const dh = img.naturalHeight * escala
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

export function HeroCinematico({ c }: { c: Conteudo }) {
  const secaoRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barraRef = useRef<HTMLDivElement>(null)
  const dicaRef = useRef<HTMLDivElement>(null)
  const blocosRef = useRef<(HTMLDivElement | null)[]>([])
  // "estatico": prefers-reduced-motion; fica só o poster e o primeiro texto
  const reduzido = useSyncExternalStore(
    assinarReduzido,
    () => window.matchMedia(consultaReduzido).matches,
    () => false
  )
  const modo = reduzido ? "estatico" : "animado"
  const [primeiroFrame, setPrimeiroFrame] = useState(false)

  useEffect(() => {
    if (reduzido) return

    const secao = secaoRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!secao || !canvas || !ctx) return

    let seq: SequenciaFrames = sequencias.desktop
    let frames: (HTMLImageElement | null)[] = []
    let estado: ("vazio" | "carregando" | "ok" | "erro")[] = []
    let emVoo = 0
    let alvo = 0
    let desenhado = -1
    let raf = 0
    let ativo = true

    const escolherSequencia = () =>
      window.innerWidth < larguraMobile ? sequencias.mobile : sequencias.desktop

    const iniciarSequencia = (nova: SequenciaFrames) => {
      seq = nova
      frames = new Array(seq.quantidade).fill(null)
      estado = new Array(seq.quantidade).fill("vazio")
      desenhado = -1
      secao.style.height = `${window.innerWidth < larguraMobile ? alturaSecao.mobile : alturaSecao.desktop}svh`
    }

    const url = (i: number) => `${seq.pasta}/${String(i).padStart(3, "0")}.webp`

    // carrega primeiro o frame alvo e seus vizinhos, depois o resto em ondas
    const proximoParaCarregar = () => {
      for (let r = 0; r < seq.quantidade; r++) {
        for (const i of [alvo + r, alvo - r]) {
          if (i >= 0 && i < seq.quantidade && estado[i] === "vazio") return i
        }
      }
      return -1
    }

    const bombear = () => {
      while (ativo && emVoo < carregamentoParalelo) {
        const i = proximoParaCarregar()
        if (i < 0) return
        const img = new Image()
        img.decoding = "async"
        estado[i] = "carregando"
        emVoo++
        const sequenciaDaVez = seq
        img.onload = () => {
          emVoo--
          if (sequenciaDaVez !== seq) return bombear()
          frames[i] = img
          estado[i] = "ok"
          if (i === 0) setPrimeiroFrame(true)
          // redesenha se este frame está mais perto do alvo do que o atual
          if (Math.abs(i - alvo) < Math.abs(desenhado - alvo) || desenhado < 0) agendar()
          bombear()
        }
        img.onerror = () => {
          emVoo--
          // se nenhum frame carregar, o poster continua visível e os textos
          // seguem animando pelo scroll normalmente
          estado[i] = "erro"
          bombear()
        }
        img.src = url(i)
      }
    }

    // o frame mais próximo do alvo que já está carregado
    const melhorDisponivel = () => {
      for (let r = 0; r < seq.quantidade; r++) {
        if (frames[alvo - r]) return alvo - r
        if (frames[alvo + r]) return alvo + r
      }
      return -1
    }

    const ajustarCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        desenhado = -1
      }
    }

    const atualizar = () => {
      raf = 0
      const rect = secao.getBoundingClientRect()
      const percurso = secao.offsetHeight - window.innerHeight
      const p = percurso > 0 ? clamp(-rect.top / percurso) : 0

      alvo = Math.round(p * (seq.quantidade - 1))
      const i = melhorDisponivel()
      if (i >= 0 && i !== desenhado) {
        desenharCover(ctx, frames[i]!, canvas.width, canvas.height)
        desenhado = i
      }

      blocos.forEach((b, n) => {
        const el = blocosRef.current[n]
        if (!el) return
        const o = visibilidade(p, b.entra, b.sai)
        el.style.opacity = String(o)
        el.style.transform = `translate3d(0, ${(1 - o) * 28}px, 0)`
        // invisível não bloqueia cliques nem recebe foco
        const visivel = o > 0.05
        el.style.visibility = visivel ? "visible" : "hidden"
        el.inert = !visivel
      })

      if (barraRef.current) barraRef.current.style.transform = `scaleX(${p})`
      if (dicaRef.current) dicaRef.current.style.opacity = String(clamp(1 - p / 0.04))

      bombear()
    }

    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(atualizar)
    }

    const aoRedimensionar = () => {
      const nova = escolherSequencia()
      if (nova !== seq) iniciarSequencia(nova)
      ajustarCanvas()
      agendar()
    }

    iniciarSequencia(escolherSequencia())
    ajustarCanvas()
    atualizar()

    window.addEventListener("scroll", agendar, { passive: true })
    window.addEventListener("resize", aoRedimensionar)

    return () => {
      ativo = false
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", agendar)
      window.removeEventListener("resize", aoRedimensionar)
      secao.style.height = ""
    }
  }, [reduzido])

  const estatico = modo === "estatico"

  return (
    <section
      ref={secaoRef}
      aria-labelledby="hero-title"
      className="cine"
      data-modo={modo}
      data-rolagem-direta
    >
      <div className="cine-palco">
        {/* poster: aparece até o primeiro frame e é o fallback */}
        <picture className="cine-poster" data-oculto={(!estatico && primeiroFrame) || undefined}>
          <source media={`(max-width: ${larguraMobile - 1}px)`} srcSet={sequencias.mobile.poster} />
          <img
            src={sequencias.desktop.poster}
            alt="Vista aérea do prédio do Colégio Dask, em Dracena-SP"
            fetchPriority="high"
          />
        </picture>
        {!estatico && <canvas ref={canvasRef} className="cine-canvas" aria-hidden="true" />}
        <div className="cine-veu" aria-hidden="true" />

        <div className="frame relative z-20 pt-5">
          <SiteHeader tom="claro" />
        </div>

        <div className="cine-textos frame">
          <div
            ref={(el) => {
              blocosRef.current[0] = el
            }}
            className="cine-bloco"
          >
            <h1 id="hero-title" className="display text-[clamp(52px,10vw,176px)] text-white">
              <Linhas texto={txt(c, "titulo1")} />
            </h1>
            <p className="lead mt-6 max-w-[36ch] text-white/90">
              {txt(c, "texto1")}
            </p>
            {estatico && (
              <a
                href={whatsappLink(mensagemVisita)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action mt-8 text-lg"
              >
                {txt(c, "botao")}
              </a>
            )}
          </div>

          <div
            ref={(el) => {
              blocosRef.current[1] = el
            }}
            className="cine-bloco"
            style={estatico ? { display: "none" } : undefined}
          >
            <p className="display text-[clamp(40px,6.4vw,112px)] text-white">
              <Linhas texto={txt(c, "titulo2")} />
            </p>
            <p className="lead mt-6 max-w-[36ch] text-white/90">
              {txt(c, "texto2")}
            </p>
          </div>

          <div
            ref={(el) => {
              blocosRef.current[2] = el
            }}
            className="cine-bloco"
            style={estatico ? { display: "none" } : undefined}
          >
            <p className="display text-[clamp(44px,7.4vw,128px)] text-white">
              <Linhas texto={txt(c, "titulo3")} />
            </p>
            <p className="lead mt-6 max-w-[36ch] text-white/90">
              {txt(c, "texto3")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={whatsappLink(mensagemVisita)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action text-lg"
              >
                {txt(c, "botao")}
              </a>
              <a href="#ensino" className="link font-semibold text-white">
                Ver séries e turnos
              </a>
            </div>
          </div>
        </div>

        {!estatico && (
          <>
            <div ref={dicaRef} className="cine-dica" aria-hidden="true">
              <span>Role para chegar à escola</span>
              <span className="cine-dica-linha" />
            </div>
            <div className="cine-progresso" aria-hidden="true">
              <div ref={barraRef} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
