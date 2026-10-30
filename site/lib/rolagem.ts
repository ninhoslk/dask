import type Lenis from "lenis"

// A instância da rolagem suave (Lenis) fica aqui para que outros componentes,
// como o botão "voltar ao topo", rolem pela mesma inércia.
let instancia: Lenis | undefined

export function definirRolagem(l: Lenis | undefined) {
  instancia = l
}

export function rolarPara(alvo: number | HTMLElement) {
  if (instancia) {
    instancia.scrollTo(alvo)
    return
  }
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (typeof alvo === "number") {
    window.scrollTo({ top: alvo, behavior: reduzido ? "auto" : "smooth" })
  } else {
    alvo.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" })
  }
}
