import { Editor } from "@/components/admin/editor"
import { exigirAdmin } from "@/lib/admin/sessao"
import { normalizar } from "@/lib/conteudo/documento"

export default async function EditorVisual() {
  const { sb } = await exigirAdmin()
  const [rascunho, publicado] = await Promise.all([
    sb.from("rascunhos").select("conteudo").eq("id", "home").maybeSingle(),
    sb.from("paginas").select("conteudo").eq("id", "home").maybeSingle(),
  ])
  return <Editor rascunho={normalizar(rascunho.data?.conteudo)} publicado={normalizar(publicado.data?.conteudo)} />
}
