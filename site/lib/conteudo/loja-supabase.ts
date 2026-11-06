import type { SupabaseClient } from "@supabase/supabase-js"

import type { LojaPagina } from "@/lib/conteudo/repositorio"

// Adaptador do repositório da página para o Supabase. Recebe o cliente já
// pronto: o público (leitura em cache) no site, ou o da sessão no painel,
// para que toda escrita passe pelas políticas de RLS de quem está logado.
// A versão de uma linha é a coluna atualizado_em (o gatilho do banco a renova
// a cada mudança).
export function lojaSupabase(sb: SupabaseClient): LojaPagina {
  return {
    async lerConteudo(tabela, pagina) {
      const { data, error } = await sb
        .from(tabela)
        .select("conteudo,atualizado_em,atualizado_por")
        .eq("id", pagina)
        .maybeSingle()
      if (error) return { ok: false }
      return { ok: true, conteudo: data?.conteudo ?? null, versao: data?.atualizado_em ?? null, autor: data?.atualizado_por ?? null }
    },
    async gravarConteudo(tabela, pagina, conteudo, autor, base) {
      if (base) {
        // só grava se ninguém mudou a linha desde a versão que o editor conhece
        const { data, error } = await sb
          .from(tabela)
          .update({ conteudo, atualizado_por: autor })
          .eq("id", pagina)
          .eq("atualizado_em", base)
          .select("atualizado_em")
        if (error) return { ok: false }
        return data.length ? { ok: true, versao: data[0].atualizado_em } : { ok: false, conflito: true }
      }
      const { data, error } = await sb
        .from(tabela)
        .upsert({ id: pagina, conteudo, atualizado_por: autor })
        .select("atualizado_em")
        .maybeSingle()
      return error ? { ok: false } : { ok: true, versao: data?.atualizado_em ?? null }
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
    async lerVersao(id, pagina) {
      const { data, error } = await sb.from("versoes").select("conteudo").eq("id", id).eq("pagina", pagina).maybeSingle()
      return error ? { ok: false } : { ok: true, conteudo: data?.conteudo ?? null }
    },
    async nomesDaEquipe() {
      const { data } = await sb.from("admins").select("user_id,nome")
      return new Map((data ?? []).map((m) => [m.user_id as string, m.nome as string]))
    },
  }
}
