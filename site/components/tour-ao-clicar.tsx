"use client"

import { useState } from "react"
import Image from "next/image"

// O tour é pesado (visualizador 360 e fotos de cada ambiente): a página mostra
// só a foto da fachada e o tour carrega quando a pessoa pede.
export function TourAoClicar({ url, titulo }: { url: string; titulo: string }) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="media relative mt-12 aspect-[4/5] sm:aspect-video">
      {aberto ? (
        <iframe
          src={url}
          title={titulo}
          className="size-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
        />
      ) : (
        <>
          <Image src="/fotos/fachada.jpg" alt="" fill sizes="(min-width: 768px) 90vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 grid place-items-center bg-field/45">
            <button type="button" className="btn-action" onClick={() => setAberto(true)}>
              Iniciar o tour 360°
            </button>
          </div>
        </>
      )}
    </div>
  )
}
