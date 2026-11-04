"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

import { definirRolagem } from "@/lib/rolagem"

// Rolagem com inércia, nos mesmos parâmetros da ONFORM (lerp 0,085). O toque
// continua nativo (syncTouch desligado) e listas, diálogos e campos de texto
// rolam sozinhos. O painel administrativo usa a rolagem do navegador. Com movimento reduzido, a rolagem fica a do navegador.
export function RolagemSuave() {
  const noPainel = usePathname()?.startsWith("/admin") ?? false

  useEffect(() => {
    if (noPainel) return
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | undefined
    let frame = 0

    // Dentro de uma área [data-rolagem-direta] (a abertura em frames) a rolagem
    // para assim que a roda para: sem inércia. O Lenis amortece pelo tempo
    // (1 - e^(-lerp·60·dt)), então lerp 1 ainda desliza; 1000 é instantâneo.
    const tick = (t: number) => {
      if (lenis) {
        const direta = document.querySelector<HTMLElement>("[data-rolagem-direta]")
        let dentro = false
        if (direta) {
          const topo = direta.getBoundingClientRect().top + lenis.animatedScroll
          const fim = topo + direta.offsetHeight - window.innerHeight
          dentro = lenis.animatedScroll >= topo - 1 && lenis.animatedScroll < fim
        }
        lenis.options.lerp = dentro ? 1000 : 0.085
      }
      lenis?.raf(t)
      frame = requestAnimationFrame(tick)
    }

    const configurar = () => {
      cancelAnimationFrame(frame)
      lenis?.destroy()
      lenis = undefined
      if (!reduzido.matches) {
        lenis = new Lenis({
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          anchors: true,
          prevent: (no) =>
            Boolean(
              no.closest?.(
                "dialog,textarea,select,[role=dialog],[role=listbox],[data-radix-popper-content-wrapper],[data-lenis-prevent]"
              )
            ),
        })
        frame = requestAnimationFrame(tick)
      }
      definirRolagem(lenis)
    }

    configurar()
    reduzido.addEventListener("change", configurar)
    return () => {
      reduzido.removeEventListener("change", configurar)
      cancelAnimationFrame(frame)
      lenis?.destroy()
      definirRolagem(undefined)
    }
  }, [noPainel])

  return null
}
