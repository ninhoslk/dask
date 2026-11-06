import { Editor } from "@/components/admin/editor"
import { exigirAdmin } from "@/lib/admin/sessao"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina } from "@/lib/conteudo/repositorio"

export default async function EditorVisual() {
  const { sb } = await exigirAdmin()
  // se o banco falhar, lança erro (app/admin/error.tsx) em vez de abrir o padrão
  const { rascunho, publicado } = await repositorioPagina(lojaSupabase(sb)).paraEditar()
  return <Editor rascunho={rascunho} publicado={publicado} />
}
