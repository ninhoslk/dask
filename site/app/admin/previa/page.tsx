import type { Metadata } from "next"

import { PreviaAoVivo } from "@/components/admin/previa-ao-vivo"
import { exigirAdmin } from "@/lib/admin/sessao"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina, repositorioSite } from "@/lib/conteudo/repositorio"
import { listarCartoes } from "@/lib/noticias"

export const metadata: Metadata = { title: "Prévia", robots: { index: false, follow: false } }

// O site com os rascunhos (home e informações do site), dentro do iframe do
// editor. ?pagina=central mostra a Central do aluno. Só para a equipe.
export default async function Previa({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const { sb } = await exigirAdmin()
  const { pagina } = await searchParams
  const loja = lojaSupabase(sb)
  const [home, site, noticias] = await Promise.all([
    repositorioPagina(loja).paraEditar(),
    repositorioSite(loja).paraEditar(),
    listarCartoes(5),
  ])
  return (
    <PreviaAoVivo
      home={home.rascunho}
      site={site.rascunho}
      pagina={pagina === "central" ? "central" : "home"}
      noticias={noticias}
    />
  )
}
