import { Editor } from "@/components/admin/editor"
import { dadosDoEditor } from "@/lib/admin/editor-dados"

export default async function EditorPaginaInicial() {
  // se o banco falhar, lança erro (app/admin/error.tsx) em vez de abrir o padrão
  const { inicial, publicado } = await dadosDoEditor("home")
  return <Editor pagina="home" inicial={inicial} publicado={publicado} />
}
