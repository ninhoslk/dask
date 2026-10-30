import { notFound } from "next/navigation"

import { FormNoticia } from "@/components/admin/form-noticia"
import { exigirAdmin } from "@/lib/admin/sessao"

export default async function EditarNoticia({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { sb } = await exigirAdmin()

  if (id === "nova") {
    return (
      <FormNoticia
        inicial={{
          slug: "",
          titulo: "",
          data: new Date().toISOString(),
          categoria: "Geral",
          resumo: "",
          conteudo: "",
          imagem: "",
          publicado: true,
        }}
      />
    )
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const { data } = await sb
    .from("noticias")
    .select("id,slug,titulo,data,categoria,resumo,conteudo,imagem,publicado")
    .eq("id", id)
    .maybeSingle()
  if (!data) notFound()
  return <FormNoticia inicial={{ ...data, imagem: data.imagem ?? "" }} />
}
