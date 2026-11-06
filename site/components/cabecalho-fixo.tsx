"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/site-header"

// O cabeçalho da página some quando ela rola (na home, junto com a abertura).
// Este é o mesmo cabeçalho, preso no topo: aparece quando a pessoa rola para
// cima e some quando ela volta a descer, para o menu estar sempre a um gesto.
// Fica escondido enquanto o cabeçalho original ainda está na tela.
// Trabalho por scroll em um requestAnimationFrame, escrevendo no DOM.
export function CabecalhoFixo() {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    let ultimoY = window.scrollY
    let visivel = false

    const mostrar = (sim: boolean) => {
      if (sim === visivel) return
      visivel = sim
      el.toggleAttribute("data-visivel", sim)
      el.inert = !sim
    }

    const atualizar = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - ultimoY
      ultimoY = y
      // o cabeçalho original é o primeiro <header> fora deste invólucro
      const original = Array.from(document.querySelectorAll("header")).find((h) => !el.contains(h))
      const originalNaTela = original ? original.getBoundingClientRect().bottom > 0 : y < window.innerHeight
      if (originalNaTela || y < 80) return mostrar(false)
      if (delta < -4) mostrar(true)
      else if (delta > 4) mostrar(false)
    }
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(atualizar)
    }

    el.inert = true
    window.addEventListener("scroll", agendar, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", agendar)
      visivel = false
      el.removeAttribute("data-visivel")
    }
  }, [pathname])

  if (pathname?.startsWith("/admin")) return null

  return (
    <div ref={ref} className="cabecalho-fixo frame">
      <SiteHeader />
    </div>
  )
}
