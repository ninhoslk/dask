import type { LinhaVersao, LojaPagina, Tabela } from "@/lib/conteudo/repositorio"

// Adaptador em memória do repositório da página, para os testes. `falhar`
// escolhe quais operações devolvem erro, como se o banco tivesse caído.
// Cada gravação muda a versão da linha, como o gatilho atualizado_em do banco.
export type OperacaoLoja = keyof LojaPagina | `gravar:${Tabela}` | `ler:${Tabela}`

type Linha = { conteudo: unknown; versao: string; autor: string | null }

export function lojaMemoria(
  inicial: Partial<Record<Tabela, unknown>> = {},
  equipe: Record<string, string> = {},
  pagina = "home"
) {
  let relogio = 0
  const marca = () => `v${++relogio}`
  const tabelas: Record<Tabela, Map<string, Linha>> = { paginas: new Map(), rascunhos: new Map() }
  for (const [t, c] of Object.entries(inicial) as [Tabela, unknown][]) {
    tabelas[t].set(pagina, { conteudo: c, versao: marca(), autor: null })
  }
  const versoes: (LinhaVersao & { pagina: string; conteudo: unknown })[] = []
  const auditoria: { acao: string; alvo: string; autor: string }[] = []
  const falhar = new Set<OperacaoLoja>()

  const loja: LojaPagina = {
    async lerConteudo(tabela, p) {
      if (falhar.has("lerConteudo") || falhar.has(`ler:${tabela}`)) return { ok: false }
      const l = tabelas[tabela].get(p)
      return { ok: true, conteudo: l?.conteudo ?? null, versao: l?.versao ?? null, autor: l?.autor ?? null }
    },
    async gravarConteudo(tabela, p, conteudo, autor, base) {
      if (falhar.has("gravarConteudo") || falhar.has(`gravar:${tabela}`)) return { ok: false }
      const atual = tabelas[tabela].get(p)
      if (base && atual?.versao !== base) return { ok: false, conflito: true }
      const versao = marca()
      tabelas[tabela].set(p, { conteudo, versao, autor })
      return { ok: true, versao }
    },
    async registrarVersao(p, conteudo) {
      if (falhar.has("registrarVersao")) return false
      relogio += 1
      versoes.push({ id: relogio, criado_em: new Date(relogio * 1000).toISOString(), criado_por: null, pagina: p, conteudo })
      return true
    },
    async registrarAuditoria(acao, alvo, autor) {
      if (falhar.has("registrarAuditoria")) return false
      auditoria.push({ acao, alvo, autor })
      return true
    },
    async listarVersoes(p, limite) {
      if (falhar.has("listarVersoes")) return null
      return versoes
        .filter((v) => v.pagina === p)
        .sort((a, b) => b.criado_em.localeCompare(a.criado_em))
        .slice(0, limite)
        .map(({ id, criado_em, criado_por }) => ({ id, criado_em, criado_por }))
    },
    async lerVersao(id, p) {
      if (falhar.has("lerVersao")) return { ok: false }
      return { ok: true, conteudo: versoes.find((v) => v.id === id && v.pagina === p)?.conteudo ?? null }
    },
    async nomesDaEquipe() {
      return new Map(Object.entries(equipe))
    },
  }

  /** Simula outra pessoa gravando o rascunho por fora do editor. */
  const gravarPorFora = (tabela: Tabela, conteudo: unknown, autor: string) =>
    tabelas[tabela].set(pagina, { conteudo, versao: marca(), autor })

  /** Conteúdo guardado numa tabela (para os testes conferirem). */
  const conteudo = (tabela: Tabela) => tabelas[tabela].get(pagina)?.conteudo

  return { loja, tabelas, versoes, auditoria, falhar, gravarPorFora, conteudo }
}
