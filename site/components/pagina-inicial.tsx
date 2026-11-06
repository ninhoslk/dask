"use client"

import { Bloco } from "@/components/sections/bloco"
import { Chamada } from "@/components/sections/chamada"
import { Conquistas } from "@/components/sections/conquistas"
import { Contato } from "@/components/sections/contato"
import { Ensino } from "@/components/sections/ensino"
import { Escola } from "@/components/sections/escola"
import { Apresentacao } from "@/components/sections/hero"
import { HeroCinematico } from "@/components/sections/hero-cinematico"
import { Metodo } from "@/components/sections/metodo"
import { Noticias } from "@/components/sections/noticias"
import { Showcase } from "@/components/sections/showcase"
import { Vida } from "@/components/sections/vida"
import type { SecaoResolvida } from "@/lib/conteudo/documento"
import type { IdSecao } from "@/lib/conteudo/esquema"
import type { NoticiaCartao } from "@/lib/noticias-tipos"

// Monta a home na ordem do documento publicado (ou do rascunho, na prévia do
// painel). Cada seção fica num invólucro `display: contents`, que não muda o
// layout e deixa o editor achar e destacar a seção pelo data-secao (o id da
// seção na página, que distingue duas seções do mesmo tipo).
export function PaginaInicial({
  secoes,
  noticias,
  editavel = false,
}: {
  secoes: SecaoResolvida[]
  noticias: NoticiaCartao[]
  editavel?: boolean
}) {
  const render: Record<IdSecao, (s: SecaoResolvida) => React.ReactNode> = {
    abertura: (s) => <HeroCinematico c={s.c} />,
    apresentacao: (s) => <Apresentacao c={s.c} />,
    escola: (s) => <Escola c={s.c} />,
    ensino: (s) => <Ensino c={s.c} />,
    metodo: (s) => <Metodo c={s.c} />,
    robotica: (s) => <Showcase c={s.c} />,
    vida: (s) => <Vida c={s.c} />,
    conquistas: (s) => <Conquistas c={s.c} />,
    noticias: (s) => <Noticias c={s.c} noticias={noticias} />,
    contato: (s) => <Contato c={s.c} />,
    bloco: (s) => <Bloco c={s.c} />,
    chamada: (s) => <Chamada c={s.c} />,
  }

  return (
    <>
      {secoes
        .filter((s) => s.visivel || editavel)
        .map((s) => (
          <div
            key={s.id}
            data-secao={editavel ? s.id : undefined}
            data-oculta={editavel && !s.visivel ? "" : undefined}
            style={{ display: "contents" }}
          >
            {render[s.tipo](s)}
          </div>
        ))}
    </>
  )
}
