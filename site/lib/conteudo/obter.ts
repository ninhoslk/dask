import "server-only"

import { cache } from "react"

import { resolverConfig, type Config, type Documento } from "@/lib/conteudo/documento"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina, repositorioSite } from "@/lib/conteudo/repositorio"
import { clientePublico } from "@/lib/supabase/publico"

const loja = () => {
  const sb = clientePublico()
  return sb ? lojaSupabase(sb) : null
}

/** Home publicada; cai no padrão se o banco não responder. */
export async function documentoPublicado(): Promise<Documento> {
  return repositorioPagina(loja()).publicado()
}

/** Informações do site publicadas, já mescladas com os padrões (uma leitura por pedido). */
export const configPublicada = cache(async (): Promise<Config> => resolverConfig(await repositorioSite(loja()).publicado()))
