"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

import { definirRolagem } from "@/lib/rolagem"

// Rolagem com inércia, nos mesmos parâmetros da ONFORM (lerp 0,085). O toque
// continua nativo (syncTouch desligado) e listas, diálogos e campos de texto
// rolam sozinhos. O painel administrativo usa a rolagem do navegador. Com movimento reduzido, a rolagem fica a do navegador.
export function RolagemSuave() {
  const caminho = usePathname()
  const noPainel = caminho?.startsWith("/admin") ?? false
  const instancia = useRef<Lenis | undefined>(undefined)

  // Troca de página: o Next já pôs a rolagem no lugar certo (topo, âncora ou a
  // posição de antes, ao voltar). Se a inércia da página anterior ainda estava
  // correndo, o Lenis continuaria indo para o destino antigo e a página nova
  // abriria no fim. Aqui o Lenis para e assume a posição atual. Roda antes da
  // pintura (layout effect), depois que o Next rolou. Com âncora no endereço
  // (/#ensino) não mexe: a rolagem até a âncora ainda vai acontecer.
  useLayoutEffect(() => {
    if (window.location.hash) return
    instancia.current?.scrollTo(window.scrollY, { immediate: true, force: true })
  }, [caminho])

  useEffect(() => {
    if (noPainel) return
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | undefined
    let frame = 0

    const tick = (t: number) => {
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
      instancia.current = lenis
      definirRolagem(lenis)
    }

    configurar()
    reduzido.addEventListener("change", configurar)
    return () => {
      reduzido.removeEventListener("change", configurar)
      cancelAnimationFrame(frame)
      lenis?.destroy()
      instancia.current = undefined
      definirRolagem(undefined)
    }
  }, [noPainel])

  return null
}
