import "server-only"

import { exigirAdmin } from "@/lib/admin/sessao"
import { normalizar, normalizarConfig } from "@/lib/conteudo/documento"
import type { DocDaPagina, Pagina } from "@/app/admin/acoes"

/** Rascunho (com a versão, para salvar sem sobrescrever ninguém) e publicado. */
export async function dadosDoEditor(pagina: Pagina) {
  const { sb } = await exigirAdmin()
  const norm = (d: unknown): DocDaPagina => (pagina === "home" ? normalizar(d) : normalizarConfig(d))
  const [rascunho, publicado] = await Promise.all([
    sb.from("rascunhos").select("conteudo,atualizado_em").eq("id", pagina).maybeSingle(),
    sb.from("paginas").select("conteudo").eq("id", pagina).maybeSingle(),
  ])
  return {
    inicial: { doc: norm(rascunho.data?.conteudo), versao: (rascunho.data?.atualizado_em as string | undefined) ?? null },
    publicado: norm(publicado.data?.conteudo),
  }
}
