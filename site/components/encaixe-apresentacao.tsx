"use client"

import { useEffect } from "react"
import type Lenis from "lenis"

import { aoMudarRolagem } from "@/lib/rolagem"

// Ao sair da abertura em vídeo, a rolagem termina encaixada no começo da
// Apresentação ("Do 1º ano ao vestibular…"), que no computador ocupa uma tela.
// Só corrige quando a rolagem já parou de vez (inércia incluída), vinha
// descendo e parou perto do ponto: até 30% de uma tela antes ou 10% depois.
// Quem passa direto não é puxado de volta, e subir nunca é interrompido.
// Só no computador e só com a rolagem suave (sem ela, nada muda).
const antes = 0.3
const depois = 0.1

export function EncaixeApresentacao({ alvo }: { alvo: string }) {
  useEffect(() => {
    const largo = window.matchMedia("(min-width: 1024px)")
    let desligar: (() => void) | undefined

    const montar = (lenis: Lenis | undefined) => {
      desligar?.()
      desligar = undefined
      const el = document.getElementById(alvo)
      if (!lenis || !el) return

      let espera = 0
      let direcao = 0
      let corrigindo = false

      // já chegou ao destino da roda (a inércia acabou), mesmo que o Lenis
      // continue emitindo frações de pixel
      const parou = () => Math.abs(lenis.targetScroll - lenis.scroll) < 1

      const conferir = () => {
        espera = 0
        if (!largo.matches || !parou() || direcao <= 0) return
        const topo = el.getBoundingClientRect().top + window.scrollY
        const distancia = lenis.scroll - topo
        const tela = window.innerHeight
        if (Math.abs(distancia) < 2 || distancia < -tela * antes || distancia > tela * depois) return
        corrigindo = true
        lenis.scrollTo(topo, {
          duration: 0.5,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            corrigindo = false
          },
        })
      }

      const aoRolar = () => {
        if (corrigindo) return
        if (lenis.direction) direcao = lenis.direction
        if (parou() && !espera) espera = window.setTimeout(conferir, 120)
      }

      // um novo giro da roda adia a conferência e cancela um encaixe em curso
      const aoGirar = () => {
        corrigindo = false
        clearTimeout(espera)
        espera = 0
      }

      lenis.on("scroll", aoRolar)
      lenis.on("virtual-scroll", aoGirar)
      desligar = () => {
        clearTimeout(espera)
        lenis.off("scroll", aoRolar)
        lenis.off("virtual-scroll", aoGirar)
      }
    }

    const sair = aoMudarRolagem(montar)
    return () => {
      sair()
      desligar?.()
    }
  }, [alvo])

  return null
}
