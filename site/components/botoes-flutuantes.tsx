"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ArrowUpIcon } from "lucide-react"

import { useConfig } from "@/components/config-site"
import { IconeInstagram, IconeWhatsApp } from "@/components/icones-redes"
import { contatoDe, redesDe } from "@/lib/conteudo/dados"
import { rolarPara } from "@/lib/rolagem"

// Canto inferior direito: WhatsApp sempre visível; Instagram logo acima; o
// "voltar ao topo" só aparece depois de uma tela e meia de rolagem, para não
// poluir a abertura. Fora do ar no painel administrativo.
export function BotoesFlutuantes() {
  const pathname = usePathname()
  const topo = useRef<HTMLButtonElement>(null)
  const cfg = useConfig()
  const { whatsappVisita, nome } = contatoDe(cfg)
  const instagram = redesDe(cfg).find((r) => r.icone === "instagram")

  useEffect(() => {
    const b = topo.current
    if (!b) return
    let frame = 0
    let visivel: boolean | undefined
    const atualizar = () => {
      frame = 0
      const mostrar = window.scrollY > window.innerHeight * 1.5
      if (mostrar === visivel) return
      visivel = mostrar
      b.toggleAttribute("data-visivel", mostrar)
      b.inert = !mostrar
    }
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(atualizar)
    }
    atualizar()
    window.addEventListener("scroll", agendar, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", agendar)
    }
  }, [pathname])

  if (pathname?.startsWith("/admin")) return null

  return (
    <div className="flutuantes" aria-label="Atalhos" role="group">
      <button
        ref={topo}
        type="button"
        className="flutuante flutuante-topo"
        aria-label="Voltar ao topo"
        onClick={() => rolarPara(0)}
      >
        <ArrowUpIcon aria-hidden className="size-5" />
      </button>
      {instagram && (
        <a
          href={instagram.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flutuante flutuante-instagram"
          aria-label={`Instagram do ${nome}`}
        >
          <IconeInstagram className="size-5" />
        </a>
      )}
      {whatsappVisita && (
        <a
          href={whatsappVisita}
          target="_blank"
          rel="noopener noreferrer"
          className="flutuante flutuante-whatsapp"
          aria-label="Conversar no WhatsApp da secretaria"
        >
          <IconeWhatsApp className="size-7" />
        </a>
      )}
    </div>
  )
}
