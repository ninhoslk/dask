import type { Metadata } from "next"

import { Editor } from "@/components/admin/editor"
import { dadosDoEditor } from "@/lib/admin/editor-dados"

export const metadata: Metadata = { title: "Informações do site · Painel" }

// Contatos, menus, segmentos, Central do aluno, rodapé e cores: o que vale para
// o site inteiro, com a mesma prévia, rascunho e publicação da página inicial.
export default async function EditorInformacoes() {
  const { inicial, publicado } = await dadosDoEditor("site")
  return <Editor pagina="site" inicial={inicial} publicado={publicado} />
}
