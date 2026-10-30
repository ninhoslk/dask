"use client"

import { useState } from "react"
import { CheckIcon, LinkIcon } from "lucide-react"

import { IconeFacebook, IconeLinkedIn, IconePinterest, IconeWhatsApp } from "@/components/icones-redes"
import { linksDeCompartilhamento } from "@/lib/site"

const icones = {
  Facebook: IconeFacebook,
  LinkedIn: IconeLinkedIn,
  Pinterest: IconePinterest,
  WhatsApp: IconeWhatsApp,
}

// Compartilhar a notícia no Facebook, LinkedIn, Pinterest e WhatsApp, ou
// copiar o link (para colar no Instagram, que não tem compartilhamento web).
export function Compartilhar({ url, titulo, imagem }: { url: string; titulo: string; imagem?: string }) {
  const [copiado, setCopiado] = useState(false)

  return (
    <div>
      <p className="font-semibold">Compartilhar</p>
      <ul className="mt-3 flex flex-wrap gap-3">
        {linksDeCompartilhamento(url, titulo, imagem).map(({ rede, href }) => {
          const Icone = icones[rede]
          return (
            <li key={rede}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="rede" aria-label={`Compartilhar no ${rede}`}>
                <Icone className="size-5" />
                {rede}
              </a>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            className="rede"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url)
                setCopiado(true)
                setTimeout(() => setCopiado(false), 2000)
              } catch {
                // sem permissão de área de transferência: nada a fazer
              }
            }}
          >
            {copiado ? <CheckIcon aria-hidden className="size-5" /> : <LinkIcon aria-hidden className="size-5" />}
            <span aria-live="polite">{copiado ? "Link copiado" : "Copiar link"}</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
