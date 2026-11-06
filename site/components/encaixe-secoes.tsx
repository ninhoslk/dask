"use client"

import { useEffect } from "react"
import type Lenis from "lenis"

import { aoMudarRolagem } from "@/lib/rolagem"

// Encaixe automático das seções da home. Quando a rolagem para de vez
// (inércia incluída, e com o dedo fora da tela), a página desliza até o ponto
// de encaixe mais próximo, se estiver perto:
//   - o começo de cada elemento [data-encaixe];
//   - nos mais altos que a tela, também o fim (o último trecho encosta embaixo).
// No meio de uma seção alta não há ponto, então a leitura fica livre.
// "Perto" depende do sentido: descendo, até 30% de uma tela antes do ponto ou
// 10% depois; subindo, o inverso. Quem passa direto não é puxado de volta.
// Não age enquanto um elemento [data-sem-encaixe] ocupa 25% da tela ou mais:
// a abertura em vídeo, a robótica e "Nossa história" rolam livres.
// Vale no computador e no celular. Com movimento reduzido, não age.
const antes = 0.3
const depois = 0.1
const ocupacaoLivre = 0.25
const pausa = 140

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

    const telaLivre = () => {
      const tela = window.innerHeight
      for (const el of document.querySelectorAll<HTMLElement>("[data-sem-encaixe]")) {
        const r = el.getBoundingClientRect()
        const visivel = Math.min(r.bottom, tela) - Math.max(r.top, 0)
        if (visivel >= tela * ocupacaoLivre) return true
      }
      return false
    }

    const pontos = () => {
      const tela = window.innerHeight
      const lista: number[] = []
      for (const el of document.querySelectorAll<HTMLElement>("[data-encaixe]")) {
        const r = el.getBoundingClientRect()
        const topo = r.top + window.scrollY
        lista.push(topo)
        if (r.height > tela + 40) lista.push(topo + r.height - tela)
      }
      return lista
    }

    const terminar = () => {
      encaixando = false
      clearTimeout(fimEncaixe)
    }

    const conferir = () => {
      espera = 0
      if (reduzido.matches || tocando || encaixando || !direcao) return
      if (lenis && Math.abs(lenis.targetScroll - lenis.scroll) >= 1) return
      if (telaLivre()) return
      const atual = window.scrollY
      const tela = window.innerHeight
      const limite = document.documentElement.scrollHeight - tela
      let melhor: number | undefined
      for (const p of pontos()) {
        const alvo = Math.min(Math.max(p, 0), limite)
        const d = atual - alvo // negativo: o ponto ainda está abaixo
        const perto =
          direcao > 0 ? d >= -tela * antes && d <= tela * depois : d <= tela * antes && d >= -tela * depois
        if (perto && (melhor === undefined || Math.abs(d) < Math.abs(atual - melhor))) melhor = alvo
      }
      if (melhor === undefined || Math.abs(atual - melhor) < 2) return
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
