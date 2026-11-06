"use client"

import { useEffect, useRef } from "react"

import { lst, txt, type Conteudo } from "@/lib/conteudo/documento"

type Palavra = { texto: string; titulo?: boolean }

// The sentence split into words; punctuation stays glued to its word so a
// line never starts with a comma.
function palavrasDa(inicio: string, frase: string[]): Palavra[] {
  const lista: Palavra[] = inicio
    .split(/\s+/)
    .filter(Boolean)
    .map((texto) => ({ texto, titulo: true }))
  frase.forEach((nome, i) => {
    const fim = i < frase.length - 2 ? "," : i === frase.length - 2 ? "" : "."
    const partes = nome.split(/\s+/).filter(Boolean)
    partes.forEach((p, j) => lista.push({ texto: j === partes.length - 1 ? p + fim : p }))
    if (i === frase.length - 2) lista.push({ texto: "e" })
  })
  return lista
}

// Reading effect, after onform.studio: a reading line sits at 58% of the
// viewport; as each line of text crosses it, its words fill left to right in
// sequence. On a fine pointer, words step aside from the cursor. Everything is
// written straight to the DOM inside one requestAnimationFrame.
export function Conquistas({ c }: { c: Conteudo }) {
  const palavras = palavrasDa(txt(c, "inicio"), lst(c, "lista"))
  const chave = palavras.map((w) => w.texto).join(" ")
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const p = ref.current
    if (!p) return
    const words = Array.from(p.querySelectorAll<HTMLElement>("[data-palavra]"))
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)")
    const fills = new Array<number>(words.length).fill(-1)

    let linhas: { i: number; meio: number }[][] = []
    let faixa = 1
    let tipo = 40
    let sujo = true
    let frame = 0

    const medir = () => {
      const cs = getComputedStyle(p)
      faixa = parseFloat(cs.lineHeight) || 1
      tipo = parseFloat(cs.fontSize) || 40
      const mapa = new Map<number, { i: number; meio: number }[]>()
      words.forEach((w, i) => {
        const topo = w.offsetTop
        if (!mapa.has(topo)) mapa.set(topo, [])
        mapa.get(topo)!.push({ i, meio: topo + w.offsetHeight / 2 })
      })
      linhas = [...mapa.values()]
      sujo = false
    }

    const ler = () => {
      frame = 0
      if (sujo) medir()
      const linha = window.innerHeight * 0.58
      const topo = p.getBoundingClientRect().top
      for (const itens of linhas) {
        const progresso = reduzido.matches
          ? 1
          : Math.max(0, Math.min(1, (linha + faixa / 2 - topo - itens[0].meio) / faixa))
        itens.forEach(({ i }, pos) => {
          const fill = Math.round(Math.max(0, Math.min(1, progresso * itens.length - pos)) * 100)
          if (fills[i] !== fill) {
            words[i].style.setProperty("--fill", `${fill}%`)
            fills[i] = fill
          }
        })
      }
    }
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(ler)
    }
    const invalidar = () => {
      sujo = true
      geometriaSuja = true
      agendar()
    }

    // --- words stepping aside from the pointer ---
    const itens = words.map((w) => ({ w, x: 0, y: 0, l: 0, t: 0, lw: 0, lh: 0 }))
    const ponteiro = { x: 0, y: 0, ativo: false }
    let geometriaSuja = true
    let hoverFrame = 0
    let hoverTempo = 0
    let selecionando = false

    const medirPalavras = () => {
      for (const it of itens) {
        it.l = it.w.offsetLeft
        it.t = it.w.offsetTop
        it.lw = it.w.offsetWidth
        it.lh = it.w.offsetHeight
      }
      geometriaSuja = false
    }
    const animarHover = (tempo: number) => {
      hoverFrame = 0
      if (geometriaSuja) medirPalavras()
      if (sujo) medir()
      const r = p.getBoundingClientRect()
      const lx = ponteiro.x - r.left
      const ly = ponteiro.y - r.top
      const ativo =
        ponteiro.ativo && !selecionando && lx >= 0 && lx <= r.width && ly >= 0 && ly <= r.height
      const raio = Math.max(140, Math.min(220, tipo * 3.8))
      const forcaX = Math.max(22, Math.min(36, tipo * 0.65))
      const forcaY = Math.max(18, Math.min(28, tipo * 0.48))
      const dt = Math.min(tempo - hoverTempo || 16.7, 40)
      hoverTempo = tempo
      const ease = 1 - Math.exp(-dt / (ativo ? 75 : 230))
      let movendo = false
      for (const it of itens) {
        let ax = 0
        let ay = 0
        if (ativo) {
          const dx = it.l + it.lw / 2 - lx
          const dy = it.t + it.lh / 2 - ly
          const dist = Math.hypot(dx, dy)
          const queda = Math.max(0, 1 - dist / raio) ** 1.6
          ax = dist > 1 ? (dx / dist) * forcaX * queda : 0
          ay = dist > 1 ? (dy / dist) * forcaY * queda : -forcaY
        }
        const x = it.x + (ax - it.x) * ease
        const y = it.y + (ay - it.y) * ease
        if (Math.abs(x - ax) > 0.025 || Math.abs(y - ay) > 0.025) movendo = true
        if (Math.abs(x) < 0.025 && Math.abs(y) < 0.025 && !ax && !ay) {
          if (it.x || it.y) it.w.style.removeProperty("transform")
          it.x = it.y = 0
        } else {
          it.x = x
          it.y = y
          it.w.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${(x * 0.07).toFixed(3)}deg)`
        }
      }
      if (movendo) agendarHover()
      else hoverTempo = 0
    }
    const agendarHover = () => {
      if (!hoverFrame && fino.matches && !reduzido.matches) hoverFrame = requestAnimationFrame(animarHover)
    }
    const limparHover = () => {
      cancelAnimationFrame(hoverFrame)
      hoverFrame = hoverTempo = 0
      ponteiro.ativo = false
      for (const it of itens) {
        it.x = it.y = 0
        it.w.style.removeProperty("transform")
      }
    }
    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || selecionando || !fino.matches || reduzido.matches) return
      ponteiro.x = e.clientX
      ponteiro.y = e.clientY
      ponteiro.ativo = true
      agendarHover()
    }
    const aoSair = () => {
      ponteiro.ativo = false
      agendarHover()
    }
    const aoPressionar = () => {
      selecionando = true
      limparHover()
    }
    const aoSoltar = () => {
      selecionando = false
    }

    p.classList.add("lendo")
    ler()
    window.addEventListener("scroll", agendar, { passive: true })
    window.addEventListener("resize", invalidar, { passive: true })
    reduzido.addEventListener("change", agendar)
    document.fonts?.ready.then(invalidar)
    const ro = new ResizeObserver(invalidar)
    ro.observe(p)
    p.addEventListener("pointermove", aoMover, { passive: true })
    p.addEventListener("pointerleave", aoSair)
    p.addEventListener("pointerdown", aoPressionar)
    window.addEventListener("pointerup", aoSoltar)

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(hoverFrame)
      ro.disconnect()
      window.removeEventListener("scroll", agendar)
      window.removeEventListener("resize", invalidar)
      reduzido.removeEventListener("change", agendar)
      p.removeEventListener("pointermove", aoMover)
      p.removeEventListener("pointerleave", aoSair)
      p.removeEventListener("pointerdown", aoPressionar)
      window.removeEventListener("pointerup", aoSoltar)
    }
  }, [chave])

  const titulo = palavras.filter((w) => w.titulo)
  const resto = palavras.filter((w) => !w.titulo)

  return (
    <section data-encaixe aria-labelledby="conquistas-title" className="conquistas frame bg-field text-field-foreground">
      <p ref={ref} className="leitura">
        <span id="conquistas-title" role="heading" aria-level={2}>
          {titulo.map((w, i) => (
            <span key={i}>
              <span data-palavra>{w.texto}</span>{" "}
            </span>
          ))}
        </span>
        {resto.map((w, i) => (
          <span key={i}>
            <span data-palavra>{w.texto}</span>
            {i < resto.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </section>
  )
}
