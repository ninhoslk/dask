"use client"

import { useId } from "react"

import { Linhas } from "@/components/linhas"
import { BotaoDaSecao, classeDoFundo } from "@/components/sections/bloco"
import { txt, type Conteudo } from "@/lib/conteudo/documento"
import { cn } from "@/lib/utils"

// Uma frase grande e um botão (aviso de matrícula, evento, convite). A equipe
// acrescenta pelo painel e pode repetir.
export function Chamada({ c }: { c: Conteudo }) {
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className={cn("frame", classeDoFundo(txt(c, "fundo")))}
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="grid12 items-end gap-y-8">
        <h2 id={id} className="display col-span-12 text-[clamp(44px,7vw,120px)] lg:col-span-8" data-reveal>
          <Linhas texto={txt(c, "titulo")} />
        </h2>
        <div className="col-span-12 flex flex-col gap-5 lg:col-span-4" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
          {txt(c, "texto") && <p className="lead whitespace-pre-line">{txt(c, "texto")}</p>}
          <BotaoDaSecao c={c} className="self-start" />
        </div>
      </div>
    </section>
  )
}
