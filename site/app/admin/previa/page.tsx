import type { Metadata } from "next"

import { PreviaAoVivo } from "@/components/admin/previa-ao-vivo"
import { exigirAdmin } from "@/lib/admin/sessao"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina } from "@/lib/conteudo/repositorio"
import { listarCartoes } from "@/lib/noticias"

export const metadata: Metadata = { title: "Prévia", robots: { index: false, follow: false } }

// A home com o rascunho, dentro do iframe do editor. Só para a equipe.
export default async function Previa() {
  const { sb } = await exigirAdmin()
  const [{ rascunho }, noticias] = await Promise.all([repositorioPagina(lojaSupabase(sb)).paraEditar(), listarCartoes(5)])
  return <PreviaAoVivo inicial={rascunho} noticias={noticias} />
}
