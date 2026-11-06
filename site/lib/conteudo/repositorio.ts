import {
  configDocPadrao,
  documentoPadrao,
  normalizar,
  normalizarConfig,
  type ConfigDoc,
  type Documento,
} from "@/lib/conteudo/documento"
import { falha, type Resultado } from "@/lib/resultado"

// Repositório das páginas editáveis: o único lugar que sabe onde cada documento
// mora (publicado, rascunho, versões, auditoria) e o que fazer quando o banco
// falha. O site, o painel e a prévia só falam com ele. São dois documentos com
// as mesmas regras: "home" (as seções da página inicial) e "site" (as
// informações do site inteiro).
//
// O armazenamento fica atrás de uma costura (LojaPagina): o Supabase em
// produção (loja-supabase.ts) e uma loja em memória nos testes (loja-memoria.ts).

export type Tabela = "paginas" | "rascunhos"
export type Pagina = "home" | "site"

/**
 * Leitura que distingue "não existe" (conteudo: null) de "o banco falhou".
 * `versao` é a marca de quando a linha mudou (para salvar sem sobrescrever) e
 * `autor`, quem mudou.
 */
export type Lido = { ok: true; conteudo: unknown | null; versao?: string | null; autor?: string | null } | { ok: false }

/** Escrita: deu certo (com a versão nova), deu conflito (a versão mudou no caminho) ou falhou. */
export type Gravado = { ok: true; versao: string | null } | { ok: false; conflito?: boolean }

export type LinhaVersao = { id: number; criado_em: string; criado_por: string | null }

/** O mínimo que o repositório precisa do armazenamento. Cada escrita diz se deu certo. */
export type LojaPagina = {
  lerConteudo(tabela: Tabela, pagina: string): Promise<Lido>
  /** Com `base`, grava só se a linha ainda estiver nessa versão (senão: conflito). */
  gravarConteudo(tabela: Tabela, pagina: string, conteudo: unknown, autor: string, base?: string | null): Promise<Gravado>
  registrarVersao(pagina: string, conteudo: unknown): Promise<boolean>
  registrarAuditoria(acao: string, alvo: string, autor: string): Promise<boolean>
  listarVersoes(pagina: string, limite: number): Promise<LinhaVersao[] | null>
  lerVersao(id: number, pagina: string): Promise<Lido>
  nomesDaEquipe(): Promise<Map<string, string>>
}

export type Versao = { id: number; criado_em: string; autor: string }

/** O rascunho como está no banco, para o editor continuar dele. */
export type Estado<D> = { doc: D; versao: string | null; autor: string }

export type ResultadoSalvar<D> =
  | { ok: true; versao: string | null }
  | { ok: false; erro: string; conflito?: Estado<D> }

/** Falha de leitura no painel: melhor uma tela de erro do que editar o conteúdo padrão por engano. */
export class ErroLeitura extends Error {}

const LIMITE_VERSOES = 30

type Formato<D> = { normalizar: (bruto: unknown) => D; padrao: () => D }

const formatos = {
  home: { normalizar, padrao: documentoPadrao } satisfies Formato<Documento>,
  site: { normalizar: normalizarConfig, padrao: configDocPadrao } satisfies Formato<ConfigDoc>,
}

function repositorio<D>(loja: LojaPagina | null, pagina: string, f: Formato<D>) {
  const nome = async (id: string | null | undefined) => {
    if (!id || !loja) return "Outra pessoa da equipe"
    return (await loja.nomesDaEquipe()).get(id) || "Outra pessoa da equipe"
  }

  const estado = async (): Promise<Estado<D> | null> => {
    if (!loja) return null
    const r = await loja.lerConteudo("rascunhos", pagina)
    if (!r.ok) return null
    return { doc: f.normalizar(r.conteudo ?? undefined), versao: r.versao ?? null, autor: await nome(r.autor) }
  }

  return {
    /** Para o site: nunca falha. Sem banco, sem linha ou com erro, mostra o conteúdo padrão. */
    async publicado(): Promise<D> {
      if (!loja) return f.padrao()
      const r = await loja.lerConteudo("paginas", pagina)
      return r.ok && r.conteudo != null ? f.normalizar(r.conteudo) : f.padrao()
    },

    /**
     * Para o painel e a prévia: o rascunho (com a versão dele) e o que está no
     * ar. Sem rascunho salvo, o rascunho começa igual ao publicado. Se o banco
     * falhar, lança ErroLeitura em vez de devolver o padrão (que seria publicado por cima).
     */
    async paraEditar(): Promise<{ rascunho: D; publicado: D; versao: string | null }> {
      if (!loja) throw new ErroLeitura("Banco não configurado.")
      const [r, p] = await Promise.all([loja.lerConteudo("rascunhos", pagina), loja.lerConteudo("paginas", pagina)])
      if (!r.ok || !p.ok) throw new ErroLeitura("Não foi possível ler a página no banco.")
      const publicado = f.normalizar(p.conteudo ?? undefined)
      const rascunho = r.conteudo != null ? f.normalizar(r.conteudo) : publicado
      return { rascunho, publicado, versao: r.versao ?? null }
    },

    /** O rascunho atual do banco (depois de alguém mudar). */
    async rascunho(): Promise<Resultado<Estado<D>>> {
      const e = await estado()
      return e ? { ok: true, dados: e } : falha("Não foi possível ler o rascunho.")
    },

    /**
     * Grava o rascunho só sobre a versão que o editor conhece (`base`). Se outra
     * pessoa salvou no meio do caminho, devolve o conflito com o rascunho dela,
     * em vez de apagar o trabalho de alguém.
     */
    async salvarRascunho(bruto: unknown, autor: string, base?: string | null): Promise<ResultadoSalvar<D>> {
      if (!loja) return { ok: false, erro: "Banco não configurado." }
      const g = await loja.gravarConteudo("rascunhos", pagina, f.normalizar(bruto), autor, base)
      if (g.ok) return { ok: true, versao: g.versao }
      if (!g.conflito) return { ok: false, erro: "Não foi possível salvar o rascunho." }
      const atual = await estado()
      if (!atual) return { ok: false, erro: "Não foi possível salvar o rascunho." }
      return { ok: false, erro: `${atual.autor} alterou este rascunho enquanto você editava.`, conflito: atual }
    },

    /**
     * Coloca o documento no ar e, depois, iguala o rascunho, guarda a versão e
     * registra na auditoria. Se só essas três últimas falharem, a página já está
     * no ar: devolve ok com um aviso dizendo o que faltou, nunca em silêncio.
     */
    async publicar(bruto: unknown, autor: string): Promise<Resultado<{ versao: string | null }>> {
      if (!loja) return falha("Banco não configurado.")
      const doc = f.normalizar(bruto)
      if (!(await loja.gravarConteudo("paginas", pagina, doc, autor)).ok) return falha("Não foi possível publicar.")
      const [rascunho, versao, auditoria] = await Promise.all([
        loja.gravarConteudo("rascunhos", pagina, doc, autor),
        loja.registrarVersao(pagina, doc),
        loja.registrarAuditoria("publicar", pagina, autor),
      ])
      const faltou = [
        !rascunho.ok && "atualizar o rascunho",
        !versao && "guardar a versão no histórico",
        !auditoria && "registrar quem publicou",
      ].filter(Boolean)
      const dados = { versao: rascunho.ok ? rascunho.versao : null }
      if (faltou.length === 0) return { ok: true, dados }
      return { ok: true, dados, aviso: `Publicado, mas não foi possível ${faltou.join(", ")}. Publique de novo para completar.` }
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

    async versao(id: number): Promise<Resultado<D>> {
      if (!loja) return falha("Banco não configurado.")
      if (!Number.isSafeInteger(id)) return falha("Versão inválida.")
      const r = await loja.lerVersao(id, pagina)
      if (!r.ok || r.conteudo == null) return falha("Versão não encontrada.")
      return { ok: true, dados: f.normalizar(r.conteudo) }
    },
  }
}

/** A home (seções da página inicial). */
export function repositorioPagina(loja: LojaPagina | null) {
  return repositorio(loja, "home", formatos.home)
}

/** As informações do site inteiro. */
export function repositorioSite(loja: LojaPagina | null) {
  return repositorio(loja, "site", formatos.site)
}

export const ehPagina = (p: unknown): p is Pagina => p === "home" || p === "site"

/** O repositório certo para a página pedida pelo painel. */
export function repositorioDa(pagina: Pagina, loja: LojaPagina | null) {
  return pagina === "home" ? repositorioPagina(loja) : repositorioSite(loja)
}
