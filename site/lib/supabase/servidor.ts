import "server-only"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { supabaseChave, supabaseUrl } from "@/lib/supabase/config"

// Cliente do painel no servidor: usa a sessão (cookies) de quem está
// logado, então toda escrita passa pelas políticas de RLS desse usuário.
export async function clienteServidor() {
  const loja = await cookies()
  return createServerClient(supabaseUrl, supabaseChave, {
    cookies: {
      getAll: () => loja.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) loja.set(name, value, options)
        } catch {
          // chamado de um Server Component: o proxy renova os cookies
        }
      },
    },
  })
}
