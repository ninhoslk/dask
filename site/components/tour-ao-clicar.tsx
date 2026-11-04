"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Maximize2Icon, XIcon } from "lucide-react"

// O tour é pesado (visualizador 360 e fotos de cada ambiente): a página mostra
// só a foto da fachada e o tour carrega quando a pessoa pede, já em tela cheia.
// Onde o navegador não tem tela cheia para elementos (iPhone), o quadro ocupa
// a janela inteira, com um botão para fechar.
export function TourAoClicar({ url, titulo }: { url: string; titulo: string }) {
  const quadro = useRef<HTMLDivElement>(null)
  const [aberto, setAberto] = useState(false)
  const [janelaInteira, setJanelaInteira] = useState(false)

  const telaCheia = async () => {
    const el = quadro.current
    if (!el) return
    try {
      if (!el.requestFullscreen) throw new Error("sem tela cheia")
      // alguns navegadores embutidos nem aceitam nem recusam: sem resposta, vale a janela inteira
      await Promise.race([
        el.requestFullscreen({ navigationUI: "hide" }),
        new Promise((_, recusa) => setTimeout(() => recusa(new Error("sem resposta")), 1200)),
      ])
    } catch {
      if (!document.fullscreenElement) setJanelaInteira(true)
    }
  }

  // sem rolar a página por trás enquanto o tour ocupa a janela
  useEffect(() => {
    if (!janelaInteira) return
    const raiz = document.documentElement
    const antes = raiz.style.overflow
    raiz.style.overflow = "hidden"
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setJanelaInteira(false)
    window.addEventListener("keydown", aoTeclar)
    return () => {
      raiz.style.overflow = antes
      window.removeEventListener("keydown", aoTeclar)
    }
  }, [janelaInteira])

  return (
    <div className="mt-12 flex max-w-4xl flex-col items-start gap-4">
      <div
        ref={quadro}
        data-lenis-prevent
        className={
          janelaInteira
            ? "fixed inset-0 z-[200] bg-black"
            : "media relative aspect-square w-full bg-black sm:aspect-video [&:fullscreen]:rounded-none"
        }
      >
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
            <Image src="/fotos/fachada.jpg" alt="" fill sizes="(min-width: 768px) 56rem, 100vw" className="object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-field/45">
              <button
                type="button"
                className="btn-action"
                onClick={() => {
                  setAberto(true)
                  // dentro do clique: o navegador só libera tela cheia com gesto da pessoa
                  telaCheia()
                }}
              >
                Iniciar o tour 360°
              </button>
            </div>
          </>
        )}
        {janelaInteira && (
          <button
            type="button"
            aria-label="Fechar o tour"
            onClick={() => setJanelaInteira(false)}
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-field text-field-foreground"
          >
            <XIcon aria-hidden className="size-5" />
          </button>
        )}
      </div>
      {aberto && !janelaInteira && (
        <button type="button" className="btn-action inline-flex items-center gap-2" onClick={telaCheia}>
          <Maximize2Icon aria-hidden className="size-4" />
          Ver em tela cheia
        </button>
      )}
    </div>
  )
}
