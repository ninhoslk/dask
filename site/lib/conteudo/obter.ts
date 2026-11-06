import "server-only"

import type { Documento } from "@/lib/conteudo/documento"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina } from "@/lib/conteudo/repositorio"
import { clientePublico } from "@/lib/supabase/publico"

/** Documento publicado da página; cai no padrão se o banco não responder. */
export async function documentoPublicado(pagina = "home"): Promise<Documento> {
  const sb = clientePublico()
  return repositorioPagina(sb ? lojaSupabase(sb) : null, pagina).publicado()
}
