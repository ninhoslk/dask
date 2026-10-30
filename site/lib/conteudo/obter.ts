import "server-only"

import { documentoPadrao, normalizar, type Documento } from "@/lib/conteudo/documento"
import { clientePublico } from "@/lib/supabase/publico"

/** Documento publicado da página; cai no padrão se o banco não responder. */
export async function documentoPublicado(pagina = "home"): Promise<Documento> {
  const sb = clientePublico()
  if (!sb) return documentoPadrao()
  const { data, error } = await sb.from("paginas").select("conteudo").eq("id", pagina).maybeSingle()
  if (error || !data) return documentoPadrao()
  return normalizar(data.conteudo)
}
