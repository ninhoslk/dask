"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { clienteNavegador, prepararTempoReal } from "@/lib/supabase/navegador"

// Recarrega os dados da página do painel quando alguém da equipe muda uma das
// tabelas (Realtime do Supabase), e também ao voltar para a aba. Assim a lista
// nunca fica velha sem ninguém perceber.
export function AtualizarAoMudar({ tabelas }: { tabelas: string[] }) {
  const router = useRouter()
  const chave = tabelas.join(",")

  useEffect(() => {
    const sb = clienteNavegador()
    let espera: ReturnType<typeof setTimeout> | undefined
    const recarregar = () => {
      clearTimeout(espera)
      espera = setTimeout(() => router.refresh(), 300)
    }
    let ativo = true
    let canal: ReturnType<typeof sb.channel> | undefined
    prepararTempoReal(sb).then(() => {
      if (!ativo) return
      canal = sb.channel(`painel-${chave}`)
      for (const t of chave.split(",")) {
        canal = canal.on("postgres_changes", { event: "*", schema: "public", table: t }, recarregar)
      }
      canal.subscribe()
    })
    const aoVoltar = () => document.visibilityState === "visible" && recarregar()
    document.addEventListener("visibilitychange", aoVoltar)
    return () => {
      ativo = false
      clearTimeout(espera)
      document.removeEventListener("visibilitychange", aoVoltar)
      if (canal) sb.removeChannel(canal)
    }
  }, [chave, router])

  return null
}
