import "server-only"

import { redirect } from "next/navigation"
import { connection } from "next/server"

import { supabaseConfigurado } from "@/lib/supabase/config"
import { clienteServidor } from "@/lib/supabase/servidor"

export type Papel = "admin" | "editor"

/**
 * Garante que quem chamou é da equipe do painel. Usado no layout, na prévia e
 * no começo de TODA ação do servidor: uma ação pode ser chamada direto, sem
 * passar pela página, então nenhuma confia na verificação de outra.
 * getUser() valida o token no servidor do Supabase (não só lê o cookie).
 */
export async function exigirAdmin() {
  // nunca pré-renderizar o painel: a resposta depende de quem pede
  await connection()
  if (!supabaseConfigurado) redirect("/admin/login?erro=config")
  const sb = await clienteServidor()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data: membro } = await sb.from("admins").select("nome,papel").eq("user_id", user.id).maybeSingle()
  if (!membro) {
    await sb.auth.signOut()
    redirect("/admin/login?erro=acesso")
  }
  return { sb, user, nome: membro.nome as string, papel: membro.papel as Papel }
}

/** Para ações chamadas pelo cliente: devolve erro em vez de redirecionar. */
export async function adminOuErro() {
  await connection()
  if (!supabaseConfigurado) return { erro: "Banco não configurado." } as const
  const sb = await clienteServidor()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return { erro: "Sessão expirada. Entre de novo." } as const
  const { data: membro } = await sb.from("admins").select("papel").eq("user_id", user.id).maybeSingle()
  if (!membro) return { erro: "Sem permissão." } as const
  return { sb, user, papel: membro.papel as Papel } as const
}
