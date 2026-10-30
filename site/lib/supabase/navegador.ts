"use client"

import { createBrowserClient } from "@supabase/ssr"

import { supabaseChave, supabaseUrl } from "@/lib/supabase/config"

// Cliente do painel no navegador (envio de imagens direto ao Storage).
export function clienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseChave)
}
