import type { Metadata } from "next"

import { CentralDoAluno } from "@/components/central-do-aluno"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { txt } from "@/lib/conteudo/documento"
import { configPublicada } from "@/lib/conteudo/obter"

// Textos, cartões, documentos e coordenação vêm de Informações do site.
export async function generateMetadata(): Promise<Metadata> {
  const cfg = await configPublicada()
  return {
    title: `${txt(cfg.central, "titulo")} · ${txt(cfg.identidade, "nome")}`,
    description: txt(cfg.central, "texto"),
  }
}

export default function PaginaCentralDoAluno() {
  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <CentralDoAluno />
      <SiteFooter />
    </>
  )
}
