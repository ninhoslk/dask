"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { supabaseConfigurado } from "@/lib/supabase/config"
import { clienteServidor } from "@/lib/supabase/servidor"

export type EstadoLogin = { erro?: string }

// Freio simples por IP além do limite do próprio Supabase Auth: depois de 5
// tentativas erradas em 10 minutos, espera. (Em memória: vale por instância.)
const tentativas = new Map<string, { n: number; desde: number }>()
const JANELA = 10 * 60 * 1000

const GENERICO = "E-mail ou senha incorretos."

export async function entrar(_: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  if (!supabaseConfigurado) return { erro: "O painel ainda não está ligado ao banco." }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  const agora = Date.now()
  const t = tentativas.get(ip)
  if (t && agora - t.desde < JANELA && t.n >= 5) {
    return { erro: "Muitas tentativas. Aguarde alguns minutos e tente de novo." }
  }

  const email = String(form.get("email") ?? "").trim().toLowerCase()
  const senha = String(form.get("senha") ?? "")
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email) || senha.length < 8 || senha.length > 200) {
    return { erro: GENERICO }
  }

  const sb = await clienteServidor()
  const { data, error } = await sb.auth.signInWithPassword({ email, password: senha })
  if (error || !data.user) {
    const atual = t && agora - t.desde < JANELA ? t : { n: 0, desde: agora }
    tentativas.set(ip, { n: atual.n + 1, desde: atual.desde })
    // mesma mensagem para "não existe" e "senha errada": não revela contas
    return { erro: error?.status === 429 ? "Muitas tentativas. Aguarde alguns minutos." : GENERICO }
  }

  const { data: membro } = await sb.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle()
  if (!membro) {
    await sb.auth.signOut()
    return { erro: "Esta conta não tem acesso ao painel." }
  }

  tentativas.delete(ip)
  await sb.from("auditoria").insert({ acao: "login", alvo: email, user_id: data.user.id })
  redirect("/admin")
}

export async function sair() {
  const sb = await clienteServidor()
  await sb.auth.signOut()
  redirect("/admin/login")
}
