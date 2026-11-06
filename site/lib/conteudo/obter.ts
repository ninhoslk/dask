import "server-only"

import { cache } from "react"

import {
  configDocPadrao,
  documentoPadrao,
  normalizar,
  normalizarConfig,
  resolverConfig,
  type Config,
  type ConfigDoc,
  type Documento,
} from "@/lib/conteudo/documento"
import { clientePublico } from "@/lib/supabase/publico"

async function lerPublicado(pagina: string) {
  const sb = clientePublico()
  if (!sb) return undefined
  const { data, error } = await sb.from("paginas").select("conteudo").eq("id", pagina).maybeSingle()
  return error || !data ? undefined : (data.conteudo as unknown)
}

/** Home publicada; cai no padrão se o banco não responder. */
export async function documentoPublicado(): Promise<Documento> {
  const bruto = await lerPublicado("home")
  return bruto === undefined ? documentoPadrao() : normalizar(bruto)
}

/** Informações do site publicadas, já mescladas com os padrões. */
export const configPublicada = cache(async (): Promise<Config> => {
  const bruto = await lerPublicado("site")
  const doc: ConfigDoc = bruto === undefined ? configDocPadrao() : normalizarConfig(bruto)
  return resolverConfig(doc)
})
