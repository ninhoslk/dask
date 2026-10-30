import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { supabaseChave, supabaseConfigurado, supabaseUrl } from "@/lib/supabase/config"

// Só roda no painel: renova a sessão do Supabase (cookies) a cada pedido e
// manda para o login quem não está autenticado. A verificação de que a pessoa
// é da equipe acontece de novo no servidor (lib/admin/sessao.ts).
export async function proxy(request: NextRequest) {
  const resposta = NextResponse.next({ request })
  const login = request.nextUrl.pathname === "/admin/login"
  if (!supabaseConfigurado) return resposta

  const sb = createServerClient(supabaseUrl, supabaseChave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        for (const { name, value } of lista) request.cookies.set(name, value)
        for (const { name, value, options } of lista) resposta.cookies.set(name, value, options)
      },
    },
  })
  const {
    data: { user },
  } = await sb.auth.getUser()

  if (!user && !login) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = ""
    return NextResponse.redirect(url)
  }
  return resposta
}

export const config = {
  matcher: ["/admin/:path*"],
}
