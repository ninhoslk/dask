import type { Metadata } from "next"

import { PreviaAoVivo } from "@/components/admin/previa-ao-vivo"
import { exigirAdmin } from "@/lib/admin/sessao"
import { normalizar, normalizarConfig } from "@/lib/conteudo/documento"
import { listarNoticias } from "@/lib/noticias"
import { paraCartao } from "@/lib/noticias-tipos"

export const metadata: Metadata = { title: "Prévia", robots: { index: false, follow: false } }

// O site com os rascunhos (home e informações do site), dentro do iframe do
// editor. ?pagina=central mostra a Central do aluno. Só para a equipe.
export default async function Previa({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const { sb } = await exigirAdmin()
  const { pagina } = await searchParams
  const [{ data }, noticias] = await Promise.all([
    sb.from("rascunhos").select("id,conteudo").in("id", ["home", "site"]),
    listarNoticias(),
  ])
  const rascunho = (id: string) => data?.find((r) => r.id === id)?.conteudo
  return (
    <PreviaAoVivo
      home={normalizar(rascunho("home"))}
      site={normalizarConfig(rascunho("site"))}
      pagina={pagina === "central" ? "central" : "home"}
      noticias={noticias.slice(0, 5).map(paraCartao)}
    />
  )
}
