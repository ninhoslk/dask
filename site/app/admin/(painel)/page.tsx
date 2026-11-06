import { Editor } from "@/components/admin/editor"
import { dadosDoEditor } from "@/lib/admin/editor-dados"

export default async function EditorPaginaInicial() {
  const { inicial, publicado } = await dadosDoEditor("home")
  return <Editor pagina="home" inicial={inicial} publicado={publicado} />
}
