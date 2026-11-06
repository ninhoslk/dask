import type { Metadata } from "next"

import { PreviaAoVivo } from "@/components/admin/previa-ao-vivo"
import { exigirAdmin } from "@/lib/admin/sessao"
import { lojaSupabase } from "@/lib/conteudo/loja-supabase"
import { repositorioPagina } from "@/lib/conteudo/repositorio"
import { listarNoticias } from "@/lib/noticias"
import { paraCartao } from "@/lib/noticias-tipos"

export const metadata: Metadata = { title: "Prévia", robots: { index: false, follow: false } }

// A home com o rascunho, dentro do iframe do editor. Só para a equipe.
export default async function Previa() {
  const { sb } = await exigirAdmin()
  const [{ rascunho }, noticias] = await Promise.all([repositorioPagina(lojaSupabase(sb)).paraEditar(), listarNoticias()])
  return <PreviaAoVivo inicial={rascunho} noticias={noticias.slice(0, 5).map(paraCartao)} />
}
