import type { SupabaseClient } from "@supabase/supabase-js"

import type { LojaPagina } from "@/lib/conteudo/repositorio"

// Adaptador do repositório da página para o Supabase. Recebe o cliente já
// pronto: o público (leitura em cache) no site, ou o da sessão no painel,
// para que toda escrita passe pelas políticas de RLS de quem está logado.
export function lojaSupabase(sb: SupabaseClient): LojaPagina {
  return {
    async lerConteudo(tabela, pagina) {
      const { data, error } = await sb.from(tabela).select("conteudo").eq("id", pagina).maybeSingle()
      return error ? { ok: false } : { ok: true, conteudo: data?.conteudo ?? null }
    },
    async gravarConteudo(tabela, pagina, conteudo, autor) {
      const { error } = await sb.from(tabela).upsert({ id: pagina, conteudo, atualizado_por: autor })
      return !error
    },
    async registrarVersao(pagina, conteudo) {
      const { error } = await sb.from("versoes").insert({ pagina, conteudo })
      return !error
    },
    async registrarAuditoria(acao, alvo, autor) {
      const { error } = await sb.from("auditoria").insert({ acao, alvo, user_id: autor })
      return !error
    },
    async listarVersoes(pagina, limite) {
      const { data, error } = await sb
        .from("versoes")
        .select("id,criado_em,criado_por")
        .eq("pagina", pagina)
        .order("criado_em", { ascending: false })
        .limit(limite)
      return error ? null : data
    },
    async lerVersao(id) {
      const { data, error } = await sb.from("versoes").select("conteudo").eq("id", id).maybeSingle()
      return error ? { ok: false } : { ok: true, conteudo: data?.conteudo ?? null }
    },
    async nomesDaEquipe() {
      const { data } = await sb.from("admins").select("user_id,nome")
      return new Map((data ?? []).map((m) => [m.user_id as string, m.nome as string]))
    },
  }
}
