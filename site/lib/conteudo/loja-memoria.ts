import type { Documento } from "@/lib/conteudo/documento"
import type { LinhaVersao, LojaPagina, Tabela } from "@/lib/conteudo/repositorio"

// Adaptador em memória do repositório da página, para os testes. `falhar`
// escolhe quais operações devolvem erro, como se o banco tivesse caído.
export type OperacaoLoja = keyof LojaPagina | `gravar:${Tabela}` | `ler:${Tabela}`

export function lojaMemoria(inicial: Partial<Record<Tabela, unknown>> = {}, equipe: Record<string, string> = {}) {
  const tabelas: Record<Tabela, Map<string, unknown>> = { paginas: new Map(), rascunhos: new Map() }
  for (const [t, c] of Object.entries(inicial) as [Tabela, unknown][]) tabelas[t].set("home", c)
  const versoes: (LinhaVersao & { pagina: string; conteudo: Documento })[] = []
  const auditoria: { acao: string; alvo: string; autor: string }[] = []
  const falhar = new Set<OperacaoLoja>()
  let relogio = 0

  const loja: LojaPagina = {
    async lerConteudo(tabela, pagina) {
      if (falhar.has("lerConteudo") || falhar.has(`ler:${tabela}`)) return { ok: false }
      return { ok: true, conteudo: tabelas[tabela].get(pagina) ?? null }
    },
    async gravarConteudo(tabela, pagina, conteudo) {
      if (falhar.has("gravarConteudo") || falhar.has(`gravar:${tabela}`)) return false
      tabelas[tabela].set(pagina, conteudo)
      return true
    },
    async registrarVersao(pagina, conteudo) {
      if (falhar.has("registrarVersao")) return false
      relogio += 1
      versoes.push({ id: relogio, criado_em: new Date(relogio * 1000).toISOString(), criado_por: null, pagina, conteudo })
      return true
    },
    async registrarAuditoria(acao, alvo, autor) {
      if (falhar.has("registrarAuditoria")) return false
      auditoria.push({ acao, alvo, autor })
      return true
    },
    async listarVersoes(pagina, limite) {
      if (falhar.has("listarVersoes")) return null
      return versoes
        .filter((v) => v.pagina === pagina)
        .sort((a, b) => b.criado_em.localeCompare(a.criado_em))
        .slice(0, limite)
        .map(({ id, criado_em, criado_por }) => ({ id, criado_em, criado_por }))
    },
    async lerVersao(id) {
      if (falhar.has("lerVersao")) return { ok: false }
      return { ok: true, conteudo: versoes.find((v) => v.id === id)?.conteudo ?? null }
    },
    async nomesDaEquipe() {
      return new Map(Object.entries(equipe))
    },
  }

  return { loja, tabelas, versoes, auditoria, falhar }
}
