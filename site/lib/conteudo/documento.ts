// Documento da home como o banco guarda: ordem das seções, visibilidade e só
// os campos alterados. `normalizar` valida tudo o que chega (do banco ou do
// painel) e descarta o que não conhece; `resolver` mescla com os padrões.

import {
  secoes,
  tipoDaSecao,
  type Campo,
  type ConteudoDe,
  type IdSecao,
  type Imagem,
  type Item,
  type Valor,
} from "@/lib/conteudo/esquema"

export type SecaoDoc = { id: IdSecao; visivel: boolean; campos: Record<string, Valor> }
export type Documento = { secoes: SecaoDoc[] }
/** Uma seção pronta para mostrar: o id diz qual é, e `c` tem os campos dela com o tipo certo. */
export type SecaoResolvida = { [Id in IdSecao]: { id: Id; visivel: boolean; c: ConteudoDe<Id> } }[IdSecao]

const LIMITE_TEXTO = 2000
const LIMITE_LISTA = 40

// Imagens aceitas: as do próprio site e as enviadas ao bucket "midia".
const origemSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export function imagemPermitida(src: string) {
  if (/^\/(fotos|logos|noticias|hero)\/[\w./-]+\.(jpe?g|png|webp|avif|svg|gif)$/i.test(src) && !src.includes("..")) return true
  return Boolean(origemSupabase) && src.startsWith(`${origemSupabase}/storage/v1/object/public/midia/`) && !src.includes("..")
}

const texto = (v: unknown, max = LIMITE_TEXTO) => (typeof v === "string" ? v.slice(0, max) : undefined)

function imagem(v: unknown): Imagem | undefined {
  if (!v || typeof v !== "object") return undefined
  const { src, alt } = v as Record<string, unknown>
  if (typeof src !== "string" || !imagemPermitida(src)) return undefined
  return { src, alt: texto(alt, 300) ?? "" }
}

function valorDo(campo: Campo, v: unknown): Valor | undefined {
  switch (campo.tipo) {
    case "texto":
    case "textarea":
      return texto(v)
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
  }
}

export function documentoPadrao(): Documento {
  return { secoes: secoes.map((s) => ({ id: s.id, visivel: true, campos: {} })) }
}

/** Valida um documento qualquer; nunca lança. Seções fixas ficam no topo. */
export function normalizar(bruto: unknown): Documento {
  const vistas = new Set<IdSecao>()
  const lista: SecaoDoc[] = []
  const entrada = (bruto as { secoes?: unknown })?.secoes
  if (Array.isArray(entrada)) {
    for (const s of entrada.slice(0, 50)) {
      const id = (s as { id?: unknown })?.id
      if (typeof id !== "string" || !(id in tipoDaSecao) || vistas.has(id as IdSecao)) continue
      const tipo = tipoDaSecao[id as IdSecao]
      vistas.add(tipo.id)
      const camposBrutos = (s as { campos?: unknown }).campos
      const campos: Record<string, Valor> = {}
      if (camposBrutos && typeof camposBrutos === "object") {
        for (const campo of tipo.campos) {
          const v = valorDo(campo, (camposBrutos as Record<string, unknown>)[campo.chave])
          if (v !== undefined) campos[campo.chave] = v
        }
      }
      const visivel = tipo.fixa ? true : (s as { visivel?: unknown }).visivel !== false
      lista.push({ id: tipo.id, visivel, campos })
    }
  }
  // sections the document does not mention yet keep their default place at the end
  for (const s of secoes) if (!vistas.has(s.id)) lista.push({ id: s.id, visivel: true, campos: {} })
  const fixas = lista.filter((s) => tipoDaSecao[s.id].fixa)
  return { secoes: [...fixas, ...lista.filter((s) => !tipoDaSecao[s.id].fixa)] }
}

// Todo campo declarado no esquema sai preenchido (o salvo ou o padrão), e
// normalizar já garantiu o tipo de cada um: por isso o conteúdo pode ser lido
// como ConteudoDe<Id> sem conferir campo a campo nos componentes.
function conteudoDa(id: IdSecao, campos: Record<string, Valor>) {
  const c: Record<string, Valor> = {}
  for (const campo of tipoDaSecao[id].campos) c[campo.chave] = campos[campo.chave] ?? campo.padrao
  return c
}

export function resolver(doc: Documento): SecaoResolvida[] {
  return doc.secoes.map((s) => ({ id: s.id, visivel: s.visivel, c: conteudoDa(s.id, s.campos) }) as SecaoResolvida)
}

/** Conteúdo padrão de uma seção, para quando ela é usada fora da home. */
export function conteudoPadrao<Id extends IdSecao>(id: Id): ConteudoDe<Id> {
  return conteudoDa(id, {}) as ConteudoDe<Id>
}
