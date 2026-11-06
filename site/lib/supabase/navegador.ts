"use client"

import { createBrowserClient } from "@supabase/ssr"

import { supabaseChave, supabaseUrl } from "@/lib/supabase/config"

// Cliente do painel no navegador (envio de imagens, Realtime).
export function clienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseChave)
}

/**
 * Entrega o token da sessão ao Realtime antes de assinar um canal. Sem isso a
 * conexão abre como visitante e o RLS (com razão) não manda os rascunhos.
 */
export async function prepararTempoReal(sb: ReturnType<typeof clienteNavegador>) {
  const { data } = await sb.auth.getSession()
  if (data.session) await sb.realtime.setAuth(data.session.access_token)
}

/** Duas marcas de tempo do banco são a mesma versão? (formatos variam: "T"/" ", "+00"/"+00:00") */
export function mesmaVersao(a: string | null | undefined, b: string | null | undefined) {
  const norm = (s: string) => {
    const m = /^(\d{4}-\d\d-\d\d)[T ](\d\d:\d\d:\d\d)(?:\.(\d+))?/.exec(s)
    return m ? `${m[1]}T${m[2]}.${(m[3] ?? "").padEnd(6, "0")}` : s
  }
  return Boolean(a && b) && norm(a!) === norm(b!)
}
