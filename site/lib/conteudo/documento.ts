// Documentos como o banco guarda. Home ("home"): seções na ordem, cada uma com
// o tipo, a visibilidade e só os campos alterados. Site ("site"): os campos
// alterados de cada grupo de informações. `normalizar*` valida tudo o que chega
// (do banco ou do painel) e descarta o que não conhece; `resolver*` mescla com
// os padrões. As duas coisas rodam no servidor e no navegador.

import { grupos, type IdGrupo } from "@/lib/conteudo/config"
import {
  secoesPadrao,
  tipoDaSecao,
  type Campo,
  type ConteudoDe,
  type IdSecao,
  type Imagem,
  type Item,
  type Registro,
  type Subcampo,
  type Valor,
} from "@/lib/conteudo/esquema"

/** `id` é o da seção na página (duas seções do mesmo tipo têm ids diferentes). */
export type SecaoDoc = { id: string; tipo: IdSecao; visivel: boolean; campos: Record<string, Valor> }
export type Documento = { v?: 2; secoes: SecaoDoc[] }
/** Uma seção pronta para mostrar: o tipo diz qual é, e `c` tem os campos dela com o tipo certo. */
export type SecaoResolvida = { [T in IdSecao]: { id: string; tipo: T; visivel: boolean; c: ConteudoDe<T> } }[IdSecao]

export type Conteudo = Record<string, Valor>
export type ConfigDoc = { grupos: Partial<Record<IdGrupo, Record<string, Valor>>> }
export type Config = Record<IdGrupo, Conteudo>

const LIMITE_TEXTO = 2000
const LIMITE_LISTA = 40
const LIMITE_REGISTROS = 60
const idValido = /^[a-z0-9][a-z0-9-]{0,39}$/
const idRegistro = /^[\w-]{1,40}$/

// Imagens aceitas: as do próprio site e as enviadas ao bucket "midia".
const origemSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export function imagemPermitida(src: string) {
  if (src.includes("..")) return false
  if (/^\/(fotos|logos|noticias|hero)\/[\w./-]+\.(jpe?g|png|webp|avif|svg|gif)$/i.test(src)) return true
  if (/^\/[\w-]+\.(png|jpe?g|webp|svg)$/i.test(src)) return true
  return Boolean(origemSupabase) && src.startsWith(`${origemSupabase}/storage/v1/object/public/midia/`)
}

/** Página do site (/x, /#x), âncora (#x) ou endereço https, mailto e tel. "" vale (campo vazio). */
export function linkSeguro(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined
  const s = v.trim().slice(0, 1000)
  if (s === "") return ""
  if (/^(https:\/\/|mailto:|tel:)[^\s"'<>\\]+$/i.test(s)) return s
  if (/^\/(?!\/)[^\s"'<>\\]*$/.test(s)) return s
  if (/^#[\w-]+$/.test(s)) return s
  return undefined
}

const texto = (v: unknown, max = LIMITE_TEXTO) => (typeof v === "string" ? v.slice(0, max) : undefined)

function imagem(v: unknown): Imagem | undefined {
  if (!v || typeof v !== "object") return undefined
  const { src, alt } = v as Record<string, unknown>
  if (typeof src !== "string" || !imagemPermitida(src)) return undefined
  return { src, alt: texto(alt, 300) ?? "" }
}

function registrosDe(v: unknown, subcampos: Subcampo[], profundidade = 0): Registro[] | undefined {
  if (!Array.isArray(v)) return undefined
  const vistos = new Set<string>()
  const lista: Registro[] = []
  v.slice(0, LIMITE_REGISTROS).forEach((bruto, i) => {
    if (!bruto || typeof bruto !== "object") return
    const o = bruto as Record<string, unknown>
    let id = typeof o._id === "string" && idRegistro.test(o._id) ? o._id : `r-${i + 1}`
    if (vistos.has(id)) id = `${id}-${i + 1}`
    vistos.add(id)
    const r: Registro = { _id: id, ativo: o.ativo !== false }
    for (const s of subcampos) {
      const x = o[s.chave]
      switch (s.tipo) {
        case "texto":
        case "telefone":
          r[s.chave] = texto(x, 300) ?? ""
          break
        case "textarea":
          r[s.chave] = texto(x, 1000) ?? ""
          break
        case "link":
          r[s.chave] = linkSeguro(x) ?? ""
          break
        case "simnao":
          r[s.chave] = x === true
          break
        case "escolha":
          r[s.chave] = typeof x === "string" && s.opcoes.some((op) => op.valor === x) ? x : s.opcoes[0].valor
          break
        case "imagem": {
          const im = imagem(x)
          if (im) r[s.chave] = im
          break
        }
        case "registros":
          if (profundidade < 1) r[s.chave] = registrosDe(x, s.subcampos, profundidade + 1) ?? []
          break
      }
    }
    lista.push(r)
  })
  return lista
}

export function valorDo(campo: Campo, v: unknown): Valor | undefined {
  switch (campo.tipo) {
    case "texto":
    case "textarea":
      return texto(v)
    case "link":
      return linkSeguro(v)
    case "cor":
      return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : undefined
    case "numero":
      return typeof v === "number" && Number.isFinite(v) ? Math.min(campo.max, Math.max(campo.min, Math.round(v))) : undefined
    case "escolha":
      return typeof v === "string" && campo.opcoes.some((o) => o.valor === v) ? v : undefined
    case "imagem":
      return imagem(v)
    case "imagens": {
      if (!Array.isArray(v)) return undefined
      const lista = v.slice(0, LIMITE_LISTA).map(imagem)
      if (campo.fixo) {
        // fixed slots: a broken entry falls back to that slot's default
        return campo.padrao.map((p, i) => lista[i] ?? p)
      }
      return lista.filter((x): x is Imagem => Boolean(x))
    }
    case "lista":
      if (!Array.isArray(v)) return undefined
      return v.slice(0, LIMITE_LISTA).map((x) => texto(x, 300)).filter((x): x is string => Boolean(x?.trim()))
    case "itens":
      if (!Array.isArray(v)) return undefined
      return v
        .slice(0, LIMITE_LISTA)
        .map((x) => {
          if (!x || typeof x !== "object") return undefined
          const o = x as Record<string, unknown>
          const t = texto(o.titulo, 300)
          const d = texto(o.texto, 600)
          return t !== undefined && d !== undefined ? { titulo: t, texto: d } : undefined
        })
        .filter((x): x is Item => Boolean(x))
    case "registros":
      return registrosDe(v, campo.subcampos)
  }
}

function camposValidos(lista: Campo[], bruto: unknown) {
  const campos: Record<string, Valor> = {}
  if (bruto && typeof bruto === "object") {
    for (const campo of lista) {
      const v = valorDo(campo, (bruto as Record<string, unknown>)[campo.chave])
      if (v !== undefined) campos[campo.chave] = v
    }
  }
  return campos
}

// Todo campo declarado sai preenchido (o salvo ou o padrão), e a validação já
// garantiu o tipo de cada um: por isso o conteúdo pode ser lido como
// ConteudoDe<Tipo> sem conferir campo a campo nos componentes.
function mesclar(lista: Campo[], alterados: Record<string, Valor> | undefined): Conteudo {
  const c: Conteudo = {}
  for (const campo of lista) c[campo.chave] = alterados?.[campo.chave] ?? campo.padrao
  return c
}

// ---------------------------------------------------------------- home

export function documentoPadrao(): Documento {
  return { v: 2, secoes: secoesPadrao.map((s) => ({ id: s.id, tipo: s.id, visivel: true, campos: {} })) }
}

/** Uma seção nova, com id próprio, para acrescentar ou duplicar. */
export function novaSecao(tipo: IdSecao, existentes: string[], campos: Record<string, Valor> = {}): SecaoDoc {
  let id: string = tipo
  for (let n = 2; existentes.includes(id); n++) id = `${tipo}-${n}`
  return { id, tipo, visivel: true, campos }
}

/** Valida um documento qualquer; nunca lança. A abertura fica sempre no topo. */
export function normalizar(bruto: unknown): Documento {
  const ids = new Set<string>()
  const unicas = new Set<IdSecao>()
  const lista: SecaoDoc[] = []
  const entrada = (bruto as { secoes?: unknown })?.secoes
  if (Array.isArray(entrada)) {
    for (const s of entrada.slice(0, 50)) {
      const o = s as { id?: unknown; tipo?: unknown; visivel?: unknown; campos?: unknown }
      // documents written before section types existed only had the id
      const nomeTipo = typeof o?.tipo === "string" ? o.tipo : o?.id
      if (typeof nomeTipo !== "string" || !(nomeTipo in tipoDaSecao)) continue
      const tipo = tipoDaSecao[nomeTipo as IdSecao]
      const id = typeof o.id === "string" && idValido.test(o.id) ? o.id : tipo.id
      if (ids.has(id) || ((tipo.unica || tipo.fixa) && unicas.has(tipo.id))) continue
      ids.add(id)
      unicas.add(tipo.id)
      const visivel = tipo.fixa ? true : o.visivel !== false
      lista.push({ id, tipo: tipo.id, visivel, campos: camposValidos(tipo.campos, o.campos) })
    }
  }
  const versao2 = (bruto as { v?: unknown })?.v === 2
  for (const s of secoesPadrao) {
    if (unicas.has(s.id)) continue
    // old documents: sections they did not mention keep their default place at
    // the end. New ones (v: 2): a missing section was removed on purpose,
    // except the opening, which cannot be removed.
    if (!versao2 || s.fixa) lista.push({ id: s.id, tipo: s.id, visivel: true, campos: {} })
  }
  const fixas = lista.filter((s) => tipoDaSecao[s.tipo].fixa)
  return { v: 2, secoes: [...fixas, ...lista.filter((s) => !tipoDaSecao[s.tipo].fixa)] }
}

export function resolver(doc: Documento): SecaoResolvida[] {
  return doc.secoes.map(
    (s) => ({ id: s.id, tipo: s.tipo, visivel: s.visivel, c: mesclar(tipoDaSecao[s.tipo].campos, s.campos) }) as SecaoResolvida
  )
}

/** Conteúdo padrão de um tipo de seção, para quando ela é usada fora da home. */
export function conteudoPadrao<T extends IdSecao>(tipo: T): ConteudoDe<T> {
  return mesclar(tipoDaSecao[tipo].campos, undefined) as ConteudoDe<T>
}

// ---------------------------------------------------------------- site

export function configDocPadrao(): ConfigDoc {
  return { grupos: {} }
}

export function normalizarConfig(bruto: unknown): ConfigDoc {
  const entrada = (bruto as { grupos?: unknown })?.grupos
  const doc: ConfigDoc = { grupos: {} }
  for (const g of grupos) {
    const campos = camposValidos(g.campos, (entrada as Record<string, unknown> | undefined)?.[g.id])
    if (Object.keys(campos).length) doc.grupos[g.id] = campos
  }
  return doc
}

export function resolverConfig(doc: ConfigDoc): Config {
  return Object.fromEntries(grupos.map((g) => [g.id, mesclar(g.campos, doc.grupos[g.id])])) as Config
}

// ---------------------------------------------------------------- leitura das informações do site

export const txt = (c: Conteudo, k: string) => (typeof c[k] === "string" ? (c[k] as string) : "")
export const num = (c: Conteudo, k: string) => (typeof c[k] === "number" ? (c[k] as number) : 0)
export const img = (c: Conteudo, k: string) => c[k] as Imagem
/** Registros ligados (os desligados no painel ficam fora do site). */
export const regs = (c: Conteudo | Registro, k: string) =>
  Array.isArray(c[k]) ? (c[k] as Registro[]).filter((r) => r.ativo) : []
export const campo = (r: Registro, k: string) => (typeof r[k] === "string" ? (r[k] as string) : "")

/** Troca {chave} pelos valores; o que não existir fica como está. */
export const preencher = (modelo: string, valores: Record<string, string>) =>
  modelo.replace(/\{(\w+)\}/g, (m, k: string) => valores[k] ?? m)
