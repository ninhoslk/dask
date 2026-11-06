import type Lenis from "lenis"

// A instância da rolagem suave (Lenis) fica aqui para que outros componentes,
// como o botão "voltar ao topo", rolem pela mesma inércia.
let instancia: Lenis | undefined
const ouvintes = new Set<(l: Lenis | undefined) => void>()

export function definirRolagem(l: Lenis | undefined) {
  instancia = l
  ouvintes.forEach((f) => f(l))
}

/** avisa agora e a cada troca da instância (ela é recriada quando muda o movimento reduzido) */
export function aoMudarRolagem(f: (l: Lenis | undefined) => void) {
  ouvintes.add(f)
  f(instancia)
  return () => {
    ouvintes.delete(f)
  }
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
