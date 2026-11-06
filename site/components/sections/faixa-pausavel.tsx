"use client"

import { useState } from "react"

// Invólucro da faixa de fotos: um toque (ou Enter/Espaço com foco) pausa e
// retoma; o foco do teclado também pausa enquanto durar (CSS).
export function FaixaPausavel({ children }: { children: React.ReactNode }) {
  const [pausada, setPausada] = useState(false)
  return (
    <div
      className="faixa"
      role="region"
      aria-label={`Fotos do dia a dia no Colégio Dask. ${pausada ? "Pausada; toque ou clique para continuar." : "Toque ou clique para pausar."}`}
      tabIndex={0}
      data-pausada={pausada || undefined}
      onClick={() => setPausada((p) => !p)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setPausada((p) => !p)
        }
      }}
    >
      {children}
    </div>
  )
}
