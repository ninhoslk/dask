"use client"

import { useId } from "react"
import Image from "next/image"

import { useConfig } from "@/components/config-site"
import { Linhas } from "@/components/linhas"
import { contatoDe, externo } from "@/lib/conteudo/dados"
import { img, txt, type Conteudo } from "@/lib/conteudo/documento"
import { cn } from "@/lib/utils"

export const classeDoFundo = (fundo: string) =>
  fundo === "escuro" ? "bg-field text-field-foreground" : fundo === "tinta" ? "bg-tint" : "bg-background"

/** Botão das seções extras: abre o WhatsApp da secretaria ou um endereço. */
export function BotaoDaSecao({ c, className }: { c: Conteudo; className?: string }) {
  const { whatsappVisita } = contatoDe(useConfig())
  const texto = txt(c, "botaoTexto").trim()
  const href = txt(c, "botaoAcao") === "whatsapp" ? whatsappVisita : txt(c, "botaoLink")
  if (!texto || !href) return null
  const fora = externo(href)
  return (
    <a href={href} {...(fora ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cn("btn-action", className)}>
      {texto}
    </a>
  )
}

// Seção que a equipe acrescenta pelo painel: título, texto, foto e botão,
// com a foto do lado escolhido. Pode se repetir na página.
export function Bloco({ c }: { c: Conteudo }) {
  const id = useId()
  const foto = img(c, "imagem")
  const esquerda = txt(c, "lado") === "esquerda"
  return (
    <section
      aria-labelledby={id}
      className={cn("frame", classeDoFundo(txt(c, "fundo")))}
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="grid12 items-center gap-y-10">
        <div className={cn("col-span-12 flex flex-col gap-6 lg:col-span-5", esquerda ? "lg:col-start-8" : "lg:col-start-1")} data-reveal>
          <h2 id={id} className="head">
            <Linhas texto={txt(c, "titulo")} />
          </h2>
          {txt(c, "texto") && <p className="lead max-w-[42ch] whitespace-pre-line">{txt(c, "texto")}</p>}
          <BotaoDaSecao c={c} className="self-start" />
        </div>
        <figure
          className={cn("media col-span-12 aspect-[4/3] lg:col-span-6 lg:row-start-1", esquerda ? "lg:col-start-1" : "lg:col-start-7")}
          data-reveal
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <Image src={foto.src} alt={foto.alt} width={1920} height={1440} sizes="(max-width: 1024px) 100vw, 50vw" />
        </figure>
      </div>
    </section>
  )
}
