"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const abas = [
  { href: "/admin", rotulo: "Editor visual" },
  { href: "/admin/noticias", rotulo: "Notícias" },
  { href: "/admin/midia", rotulo: "Mídia" },
  { href: "/admin/tour-360", rotulo: "Tour 360°" },
]

export function NavPainel() {
  const atual = usePathname()
  return (
    <nav aria-label="Painel" className="flex gap-1 overflow-x-auto">
      {abas.map((a) => {
        const ativo = a.href === "/admin" ? atual === "/admin" : atual.startsWith(a.href)
        return (
          <Link
            key={a.href}
            href={a.href}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
              ativo ? "bg-field text-field-foreground" : "hover:bg-tint"
            )}
          >
            {a.rotulo}
          </Link>
        )
      })}
    </nav>
  )
}
