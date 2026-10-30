import type { Metadata } from "next"

import { PreviaAoVivo } from "@/components/admin/previa-ao-vivo"
import { exigirAdmin } from "@/lib/admin/sessao"
import { normalizar } from "@/lib/conteudo/documento"
import { listarNoticias } from "@/lib/noticias"
import { paraCartao } from "@/lib/noticias-tipos"

export const metadata: Metadata = { title: "Prévia", robots: { index: false, follow: false } }

// A home com o rascunho, dentro do iframe do editor. Só para a equipe.
export default async function Previa() {
  const { sb } = await exigirAdmin()
  const [{ data }, noticias] = await Promise.all([
    sb.from("rascunhos").select("conteudo").eq("id", "home").maybeSingle(),
    listarNoticias(),
  ])
  return <PreviaAoVivo inicial={normalizar(data?.conteudo)} noticias={noticias.slice(0, 5).map(paraCartao)} />
}
