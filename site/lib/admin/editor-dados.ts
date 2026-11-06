import "server-only"

import { exigirAdmin } from "@/lib/admin/sessao"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioDa, type Pagina } from "@/lib/conteudo/repositorio"

/**
 * Rascunho (com a versão, para salvar sem sobrescrever ninguém) e publicado.
 * Se o banco falhar, lança erro (app/admin/error.tsx) em vez de abrir o padrão.
 */
export async function dadosDoEditor(pagina: Pagina) {
  const { sb } = await exigirAdmin()
  const { rascunho, publicado, versao } = await repositorioDa(pagina, lojaSupabase(sb)).paraEditar()
  return { inicial: { doc: rascunho, versao }, publicado }
}
