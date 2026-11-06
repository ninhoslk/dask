import type { Documento } from "@/lib/conteudo/documento"
import { tipoDaSecao, type IdSecao, type Valor } from "@/lib/conteudo/esquema"

// O que o painel pode fazer com o documento da home, como funções puras:
// recebem o documento e devolvem o próximo (ou o mesmo, quando a operação
// não vale). O editor (arrastar, botões, campos) e a barra da prévia usam
// estas mesmas regras. A principal: seções fixas (a abertura) ficam no topo,
// na ordem delas, e não podem ser movidas, ocultadas nem passadas.

const fixa = (id: IdSecao) => Boolean(tipoDaSecao[id].fixa)

/** Quantas seções fixas abrem o documento (normalizar já as põe no começo). */
const fixasNoTopo = (doc: Documento) => {
  let n = 0
  while (n < doc.secoes.length && fixa(doc.secoes[n].id)) n++
  return n
}

/** A seção pode subir (-1) ou descer (1) uma posição? */
export function podeMover(doc: Documento, id: IdSecao, direcao: -1 | 1): boolean {
  if (fixa(id)) return false
  const i = doc.secoes.findIndex((s) => s.id === id)
  const j = i + direcao
  return i >= 0 && j >= fixasNoTopo(doc) && j < doc.secoes.length
}

/** Sobe ou desce a seção uma posição (se puder). */
export function moverSecao(doc: Documento, id: IdSecao, direcao: -1 | 1): Documento {
  if (!podeMover(doc, id, direcao)) return doc
  const i = doc.secoes.findIndex((s) => s.id === id)
  const secoes = [...doc.secoes]
  ;[secoes[i], secoes[i + direcao]] = [secoes[i + direcao], secoes[i]]
  return { secoes }
}

/** Arrastar: põe a seção `de` no lugar da seção `para`. Seções fixas não entram. */
export function reordenarSecao(doc: Documento, de: IdSecao, para: IdSecao): Documento {
  if (de === para || fixa(de) || fixa(para)) return doc
  const i = doc.secoes.findIndex((s) => s.id === de)
  const j = doc.secoes.findIndex((s) => s.id === para)
  if (i < 0 || j < 0) return doc
  const secoes = [...doc.secoes]
  const [movida] = secoes.splice(i, 1)
  secoes.splice(j, 0, movida)
  return { secoes }
}

/** Mostra ou oculta a seção no site. A abertura não pode ser ocultada. */
export function alternarSecao(doc: Documento, id: IdSecao): Documento {
  if (fixa(id)) return doc
  return { secoes: doc.secoes.map((s) => (s.id === id ? { ...s, visivel: !s.visivel } : s)) }
}

/** Muda um campo da seção; `undefined` volta o campo ao texto/foto padrão. */
export function mudarCampo(doc: Documento, id: IdSecao, chave: string, valor: Valor | undefined): Documento {
  return {
    secoes: doc.secoes.map((s) => {
      if (s.id !== id) return s
      const campos = { ...s.campos }
      if (valor === undefined) delete campos[chave]
      else campos[chave] = valor
      return { ...s, campos }
    }),
  }
}
