"use client"

import { useEffect } from "react"
import type Lenis from "lenis"
import Snap from "lenis/snap"

import { aoMudarRolagem } from "@/lib/rolagem"

// Ao sair da abertura em vídeo, a rolagem para encaixada no começo da
// Apresentação ("Do 1º ano ao vestibular…"), que no computador ocupa uma tela.
// Só age quando a pessoa solta a roda perto desse ponto (até 40% da tela antes
// ou depois); links e "voltar ao topo" não são afetados. Só no computador e só
// com a rolagem suave ligada (sem ela, com movimento reduzido, nada muda).
export function EncaixeApresentacao({ alvo }: { alvo: string }) {
  useEffect(() => {
    const largo = window.matchMedia("(min-width: 1024px)")
    let snap: Snap | undefined
    let lenisAtual: Lenis | undefined

    const montar = () => {
      snap?.destroy()
      snap = undefined
      const el = document.getElementById(alvo)
      if (!lenisAtual || !el || !largo.matches) return
      snap = new Snap(lenisAtual, { type: "proximity", distanceThreshold: "40%", debounce: 180, duration: 0.9 })
      snap.addElement(el, { align: "start" })
    }

    const sair = aoMudarRolagem((l) => {
      lenisAtual = l
      montar()
    })
    largo.addEventListener("change", montar)
    return () => {
      sair()
      largo.removeEventListener("change", montar)
      snap?.destroy()
    }
  }, [alvo])

  return null
}
