import { documentoPadrao, normalizar, type Documento } from "@/lib/conteudo/documento"
import { falha, type Resultado } from "@/lib/resultado"

// Repositório da página editável: o único lugar que sabe onde o documento
// mora (publicado, rascunho, versões, auditoria) e o que fazer quando o banco
// falha. O site, o painel e a prévia só falam com ele.
//
// O armazenamento fica atrás de uma costura (LojaPagina): o Supabase em
// produção (loja-supabase.ts) e uma loja em memória nos testes (loja-memoria.ts).

export type Tabela = "paginas" | "rascunhos"

/** Leitura que distingue "não existe" (conteudo: null) de "o banco falhou". */
export type Lido = { ok: true; conteudo: unknown | null } | { ok: false }

export type LinhaVersao = { id: number; criado_em: string; criado_por: string | null }

/** O mínimo que o repositório precisa do armazenamento. Cada escrita diz se deu certo. */
export type LojaPagina = {
  lerConteudo(tabela: Tabela, pagina: string): Promise<Lido>
  gravarConteudo(tabela: Tabela, pagina: string, conteudo: Documento, autor: string): Promise<boolean>
  registrarVersao(pagina: string, conteudo: Documento): Promise<boolean>
  registrarAuditoria(acao: string, alvo: string, autor: string): Promise<boolean>
  listarVersoes(pagina: string, limite: number): Promise<LinhaVersao[] | null>
  lerVersao(id: number): Promise<Lido>
  nomesDaEquipe(): Promise<Map<string, string>>
}

export type Versao = { id: number; criado_em: string; autor: string }

/** Falha de leitura no painel: melhor uma tela de erro do que editar o conteúdo padrão por engano. */
export class ErroLeitura extends Error {}

const LIMITE_VERSOES = 30

export function repositorioPagina(loja: LojaPagina | null, pagina = "home") {
  return {
    /** Para o site: nunca falha. Sem banco, sem linha ou com erro, mostra o conteúdo padrão. */
    async publicado(): Promise<Documento> {
      if (!loja) return documentoPadrao()
      const r = await loja.lerConteudo("paginas", pagina)
      return r.ok && r.conteudo != null ? normalizar(r.conteudo) : documentoPadrao()
    },

    /**
     * Para o painel e a prévia: o rascunho e o que está no ar. Sem rascunho
     * salvo, o rascunho começa igual ao publicado. Se o banco falhar, lança
     * ErroLeitura em vez de devolver o padrão (que seria publicado por cima).
     */
    async paraEditar(): Promise<{ rascunho: Documento; publicado: Documento }> {
      if (!loja) throw new ErroLeitura("Banco não configurado.")
      const [r, p] = await Promise.all([loja.lerConteudo("rascunhos", pagina), loja.lerConteudo("paginas", pagina)])
      if (!r.ok || !p.ok) throw new ErroLeitura("Não foi possível ler a página no banco.")
      const publicado = normalizar(p.conteudo ?? undefined)
      const rascunho = r.conteudo != null ? normalizar(r.conteudo) : publicado
      return { rascunho, publicado }
    },

    async salvarRascunho(bruto: unknown, autor: string): Promise<Resultado> {
      if (!loja) return falha("Banco não configurado.")
      const ok = await loja.gravarConteudo("rascunhos", pagina, normalizar(bruto), autor)
      return ok ? { ok: true } : falha("Não foi possível salvar o rascunho.")
    },

    /**
     * Coloca o documento no ar e, depois, iguala o rascunho, guarda a versão e
     * registra na auditoria. Se só essas três últimas falharem, a página já está
     * no ar: devolve ok com um aviso dizendo o que faltou, nunca em silêncio.
     */
    async publicar(bruto: unknown, autor: string): Promise<Resultado> {
      if (!loja) return falha("Banco não configurado.")
      const doc = normalizar(bruto)
      if (!(await loja.gravarConteudo("paginas", pagina, doc, autor))) return falha("Não foi possível publicar.")
      const [rascunho, versao, auditoria] = await Promise.all([
        loja.gravarConteudo("rascunhos", pagina, doc, autor),
        loja.registrarVersao(pagina, doc),
        loja.registrarAuditoria("publicar", pagina, autor),
      ])
      const faltou = [
        !rascunho && "atualizar o rascunho",
        !versao && "guardar a versão no histórico",
        !auditoria && "registrar quem publicou",
      ].filter(Boolean)
      if (faltou.length === 0) return { ok: true }
      return { ok: true, aviso: `Publicado, mas não foi possível ${faltou.join(", ")}. Publique de novo para completar.` }
    },

    async versoes(): Promise<Resultado<Versao[]>> {
      if (!loja) return falha("Banco não configurado.")
      const linhas = await loja.listarVersoes(pagina, LIMITE_VERSOES)
      if (!linhas) return falha("Não foi possível ler o histórico.")
      const nomes = await loja.nomesDaEquipe()
      return {
        ok: true,
        dados: linhas.map((v) => ({
          id: v.id,
          criado_em: v.criado_em,
          autor: (v.criado_por && nomes.get(v.criado_por)) || "Equipe",
        })),
      }
    },

    async versao(id: number): Promise<Resultado<Documento>> {
      if (!loja) return falha("Banco não configurado.")
      if (!Number.isSafeInteger(id)) return falha("Versão inválida.")
      const r = await loja.lerVersao(id)
      if (!r.ok || r.conteudo == null) return falha("Versão não encontrada.")
      return { ok: true, dados: normalizar(r.conteudo) }
    },
  }
}
