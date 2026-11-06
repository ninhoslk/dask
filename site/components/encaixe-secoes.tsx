"use client"

import { useEffect } from "react"
import type Lenis from "lenis"

import { escolherEncaixe, pontosDeEncaixe, zonaLivreNaTela, type Faixa } from "@/lib/encaixe"
import { aoMudarRolagem } from "@/lib/rolagem"

// Encaixe automático das seções da home: quando a rolagem para de vez
// (inércia incluída, e com o dedo fora da tela), mede a página e pergunta à
// regra de lib/encaixe.ts para onde deslizar. A regra (o que é "perto",
// zonas livres, fim das seções altas) está lá, com testes.
// Vale no computador e no celular. Com movimento reduzido, não age.
const pausa = 140

const faixas = (seletor: string): Faixa[] =>
  [...document.querySelectorAll<HTMLElement>(seletor)].map((el) => {
    const r = el.getBoundingClientRect()
    return { topo: r.top, altura: r.height }
  })

export function EncaixeSecoes() {
  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | undefined
    let espera = 0
    let ultimaPosicao = window.scrollY
    let direcao = 0
    let tocando = false
    let encaixando = false
    let fimEncaixe = 0

    const terminar = () => {
      encaixando = false
      clearTimeout(fimEncaixe)
    }

    const conferir = () => {
      espera = 0
      if (reduzido.matches || tocando || encaixando || !direcao) return
      if (lenis && Math.abs(lenis.targetScroll - lenis.scroll) >= 1) return
      const tela = window.innerHeight
      if (zonaLivreNaTela(faixas("[data-sem-encaixe]"), tela)) return
      const atual = window.scrollY
      const melhor = escolherEncaixe({
        atual,
        direcao: direcao > 0 ? 1 : -1,
        tela,
        limite: document.documentElement.scrollHeight - tela,
        pontos: pontosDeEncaixe(faixas("[data-encaixe]"), atual, tela),
      })
      if (melhor === undefined) return
      encaixando = true
      if (lenis) {
        lenis.scrollTo(melhor, {
          duration: 0.55,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          onComplete: terminar,
        })
      } else {
        window.scrollTo({ top: melhor, behavior: "smooth" })
      }
      // garante a saída do estado mesmo se o deslize for interrompido
      fimEncaixe = window.setTimeout(terminar, 900)
    }

    const aoRolar = () => {
      const y = window.scrollY
      if (Math.abs(y - ultimaPosicao) >= 1) direcao = y > ultimaPosicao ? 1 : -1
      ultimaPosicao = y
      if (encaixando) return
      clearTimeout(espera)
      espera = window.setTimeout(conferir, pausa)
    }

    // qualquer gesto novo cancela a conferência e um encaixe em curso
    const aoGesto = () => {
      clearTimeout(espera)
      espera = 0
      // o próprio gesto (roda do Lenis ou toque nativo) substitui o deslize
      if (encaixando) terminar()
    }
    const aoTocar = () => {
      tocando = true
      aoGesto()
    }
    const aoSoltar = () => {
      tocando = false
      clearTimeout(espera)
      espera = window.setTimeout(conferir, pausa)
    }

    window.addEventListener("scroll", aoRolar, { passive: true })
    window.addEventListener("wheel", aoGesto, { passive: true })
    window.addEventListener("keydown", aoGesto)
    window.addEventListener("touchstart", aoTocar, { passive: true })
    window.addEventListener("touchend", aoSoltar, { passive: true })
    window.addEventListener("touchcancel", aoSoltar, { passive: true })
    const sair = aoMudarRolagem((l) => {
      lenis = l
    })

    return () => {
      sair()
      clearTimeout(espera)
      clearTimeout(fimEncaixe)
      window.removeEventListener("scroll", aoRolar)
      window.removeEventListener("wheel", aoGesto)
      window.removeEventListener("keydown", aoGesto)
      window.removeEventListener("touchstart", aoTocar)
      window.removeEventListener("touchend", aoSoltar)
      window.removeEventListener("touchcancel", aoSoltar)
    }
  }, [])

  return null
}
