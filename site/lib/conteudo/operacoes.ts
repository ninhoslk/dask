import { novaSecao, type Documento, type SecaoDoc } from "@/lib/conteudo/documento"
import { tipoDaSecao, type IdSecao, type Valor } from "@/lib/conteudo/esquema"

// O que o painel pode fazer com o documento da home, como funções puras:
// recebem o documento e devolvem o próximo (ou o mesmo, quando a operação
// não vale). O editor (arrastar, botões, campos) e a barra da prévia usam
// estas mesmas regras. A principal: seções fixas (a abertura) ficam no topo,
// na ordem delas, e não podem ser movidas, ocultadas, removidas nem passadas.
// As seções são achadas pelo id da seção na página (`SecaoDoc.id`).

const fixa = (s: SecaoDoc | undefined) => Boolean(s && tipoDaSecao[s.tipo].fixa)
const achar = (doc: Documento, id: string) => doc.secoes.find((s) => s.id === id)
const com = (doc: Documento, secoes: SecaoDoc[]): Documento => ({ ...doc, secoes })

/** Quantas seções fixas abrem o documento (normalizar já as põe no começo). */
const fixasNoTopo = (doc: Documento) => {
  let n = 0
  while (n < doc.secoes.length && fixa(doc.secoes[n])) n++
  return n
}

/** A seção pode subir (-1) ou descer (1) uma posição? */
export function podeMover(doc: Documento, id: string, direcao: -1 | 1): boolean {
  if (fixa(achar(doc, id))) return false
  const i = doc.secoes.findIndex((s) => s.id === id)
  const j = i + direcao
  return i >= 0 && j >= fixasNoTopo(doc) && j < doc.secoes.length
}

/** Sobe ou desce a seção uma posição (se puder). */
export function moverSecao(doc: Documento, id: string, direcao: -1 | 1): Documento {
  if (!podeMover(doc, id, direcao)) return doc
  const i = doc.secoes.findIndex((s) => s.id === id)
  const secoes = [...doc.secoes]
  ;[secoes[i], secoes[i + direcao]] = [secoes[i + direcao], secoes[i]]
  return com(doc, secoes)
}

/** Arrastar: põe a seção `de` no lugar da seção `para`. Seções fixas não entram. */
export function reordenarSecao(doc: Documento, de: string, para: string): Documento {
  if (de === para || fixa(achar(doc, de)) || fixa(achar(doc, para))) return doc
  const i = doc.secoes.findIndex((s) => s.id === de)
  const j = doc.secoes.findIndex((s) => s.id === para)
  if (i < 0 || j < 0) return doc
  const secoes = [...doc.secoes]
  const [movida] = secoes.splice(i, 1)
  secoes.splice(j, 0, movida)
  return com(doc, secoes)
}

/** Mostra ou oculta a seção no site. A abertura não pode ser ocultada. */
export function alternarSecao(doc: Documento, id: string): Documento {
  const s = achar(doc, id)
  if (!s || fixa(s)) return doc
  return com(doc, doc.secoes.map((x) => (x.id === id ? { ...x, visivel: !x.visivel } : x)))
}

/** Muda um campo da seção; `undefined` volta o campo ao texto/foto padrão. */
export function mudarCampo(doc: Documento, id: string, chave: string, valor: Valor | undefined): Documento {
  return com(
    doc,
    doc.secoes.map((s) => {
      if (s.id !== id) return s
      const campos = { ...s.campos }
      if (valor === undefined) delete campos[chave]
      else campos[chave] = valor
      return { ...s, campos }
    })
  )
}

/** A seção pode ser duplicada? Só as que não são únicas (as extras). */
export const podeDuplicar = (doc: Documento, id: string) => {
  const s = achar(doc, id)
  return Boolean(s && !tipoDaSecao[s.tipo].unica && !tipoDaSecao[s.tipo].fixa)
}

/** Cópia da seção logo abaixo dela, com id novo e os mesmos campos. */
export function duplicarSecao(doc: Documento, id: string): Documento {
  if (!podeDuplicar(doc, id)) return doc
  const i = doc.secoes.findIndex((s) => s.id === id)
  const original = doc.secoes[i]
  const copia = novaSecao(original.tipo, doc.secoes.map((s) => s.id), structuredClone(original.campos))
  return com(doc, [...doc.secoes.slice(0, i + 1), copia, ...doc.secoes.slice(i + 1)])
}

/** Tira a seção da página. A abertura não sai. */
export function removerSecao(doc: Documento, id: string): Documento {
  const s = achar(doc, id)
  if (!s || fixa(s)) return doc
  return com(doc, doc.secoes.filter((x) => x.id !== id))
}

/** Tipos que dá para acrescentar agora: os repetíveis e os únicos que não estão na página. */
export function tiposDisponiveis(doc: Documento): IdSecao[] {
  const presentes = new Set(doc.secoes.map((s) => s.tipo))
  return Object.values(tipoDaSecao)
    .filter((t) => !t.fixa && !(t.unica && presentes.has(t.id)))
    .map((t) => t.id)
}

/** Acrescenta uma seção nova no fim; devolve o documento e o id dela. */
export function acrescentarSecao(doc: Documento, tipo: IdSecao): { doc: Documento; id: string | null } {
  if (!tiposDisponiveis(doc).includes(tipo)) return { doc, id: null }
  const nova = novaSecao(tipo, doc.secoes.map((s) => s.id))
  return { doc: com(doc, [...doc.secoes, nova]), id: nova.id }
}
