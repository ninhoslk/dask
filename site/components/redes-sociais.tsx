"use client"

import { GlobeIcon } from "lucide-react"

import { useConfig } from "@/components/config-site"
import { IconeFacebook, IconeInstagram, IconeLinkedIn } from "@/components/icones-redes"
import { redesDe } from "@/lib/conteudo/dados"

export function IconeRede({ icone, className }: { icone: string; className?: string }) {
  if (icone === "instagram") return <IconeInstagram className={className} />
  if (icone === "facebook") return <IconeFacebook className={className} />
  if (icone === "linkedin") return <IconeLinkedIn className={className} />
  return <GlobeIcon aria-hidden className={className} />
}

// Perfis oficiais do colégio (Informações do site → Redes sociais).
export function RedesSociais() {
  const redes = redesDe(useConfig())
  return (
    <ul className="flex flex-wrap gap-3">
      {redes.map((r) => (
        <li key={r.id}>
          <a href={r.link} target="_blank" rel="noopener noreferrer" className="rede">
            <IconeRede icone={r.icone} className="size-5" />
            {r.nome}
          </a>
        </li>
      ))}
    </ul>
  )
}
