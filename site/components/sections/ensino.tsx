"use client"

import { useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Linhas } from "@/components/linhas"
import { txt, type Conteudo } from "@/lib/conteudo/documento"
import { IconeWhatsApp } from "@/components/icones-redes"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  documentos,
  psicologa,
  segmentos,
  whatsappLink,
  type Segmento,
} from "@/lib/site"

function segmentoDa(serie: string | undefined): Segmento | undefined {
  return segmentos.find((s) => serie && s.series.includes(serie))
}

// "o 1º ano", mas "a 2ª série"
const comArtigo = (serie: string, maiuscula = false) => {
  const artigo = serie.includes("série") ? "a" : "o"
  return `${maiuscula ? artigo.toUpperCase() : artigo} ${serie}`
}

// "Ensino Fundamental I": o numeral não fica sozinho na linha
const nomeInteiro = (nome: string) => nome.replace(/ (I+)$/, " $1")

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 py-1.5 sm:grid-cols-[minmax(0,11ch)_1fr] sm:gap-4">
      <dt className="text-muted-foreground max-sm:text-sm">{rotulo}</dt>
      <dd>{children}</dd>
    </div>
  )
}

// Os três segmentos são cartões lado a lado numa faixa da largura da tela.
// Escolher a série (ou clicar num cartão apagado) desliza a faixa até o cartão
// daquele segmento ficar no centro; os outros ficam apagados nas laterais.
// Só transform e opacity animam; com movimento reduzido, a troca é instantânea.
export function Ensino({ c }: { c: Conteudo }) {
  const [serie, setSerie] = useState<string>()
  const [foco, setFoco] = useState<string>(segmentos[1].id)
  const atual = segmentoDa(serie)
  const indice = Math.max(0, segmentos.findIndex((s) => s.id === foco))

  const escolherSerie = (x: string) => {
    if (!x) return
    setSerie(x)
    const seg = segmentoDa(x)
    if (seg) setFoco(seg.id)
  }

  const focarCartao = (id: string) => {
    setFoco(id)
    // a série escolhida só continua valendo se for do cartão em foco
    if (atual && atual.id !== id) setSerie(undefined)
  }

  return (
    <section
      data-sem-encaixe
      id="ensino"
      aria-labelledby="ensino-title"
      className="bg-tint"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="frame grid12 items-end gap-y-10">
        <h2 id="ensino-title" className="head col-span-12 lg:col-span-6" data-reveal>
          <Linhas texto={txt(c, "titulo")} />
        </h2>

        <div className="col-span-12 flex flex-col gap-4 lg:col-span-6" data-reveal>
          <label htmlFor="serie" className="lead font-semibold">
            {txt(c, "pergunta")}
          </label>
          <Select value={serie} onValueChange={escolherSerie}>
            <SelectTrigger id="serie" className="w-full bg-background pl-4! text-base! data-[size=default]:h-12 sm:max-w-sm">
              <SelectValue placeholder="Selecionar série" />
            </SelectTrigger>
            <SelectContent>
              {segmentos.map((s) => (
                <SelectGroup key={s.id}>
                  <SelectLabel>{s.nome}</SelectLabel>
                  {s.series.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <p aria-live="polite" className="sr-only">
            {atual && serie ? `${comArtigo(serie, true)} faz parte do ${atual.nome}.` : ""}
          </p>
        </div>
      </div>

      {/* faixa dos cartões: sangra até as bordas da tela */}
      <div className="cartoes-ensino mt-14 overflow-hidden md:mt-20" data-reveal>
        <ul className="cartoes-ensino-trilho flex" style={{ "--i": indice } as React.CSSProperties}>
          {segmentos.map((s) => {
            const ativo = s.id === foco
            const daSerie = ativo && atual?.id === s.id && serie
            return (
              <li
                key={s.id}
                aria-current={ativo ? "true" : undefined}
                data-apagado={!ativo || undefined}
                onClick={ativo ? undefined : () => focarCartao(s.id)}
                className={cn(
                  "cartao-ensino flex shrink-0 flex-col rounded-[var(--radius)] bg-background p-7 md:p-9",
                  !ativo && "cursor-pointer"
                )}
              >
                <h3 className="text-[clamp(26px,2.4vw,36px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                  {ativo ? (
                    nomeInteiro(s.nome)
                  ) : (
                    <button type="button" className="text-left" onClick={() => focarCartao(s.id)}>
                      {nomeInteiro(s.nome)}
                    </button>
                  )}
                </h3>
                <p className="mt-3 text-muted-foreground">{s.resumo}</p>
                <dl className="mt-6">
                  <Linha rotulo="Séries">
                    <span className="font-semibold">{s.series.join(", ")}</span>
                  </Linha>
                  <Linha rotulo="Coordenação">
                    <span className="font-semibold">{s.coordenacao.nome}</span>
                  </Linha>
                  <Linha rotulo="Atendimento">
                    <a
                      href={`https://wa.me/${s.coordenacao.numero}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={ativo ? undefined : -1}
                      className="link inline-flex items-center gap-2 font-semibold"
                      aria-label={`WhatsApp da ${s.coordenacao.cargo.toLowerCase()}: ${s.coordenacao.telefone}`}
                    >
                      <IconeWhatsApp className="size-5 shrink-0 text-whatsapp-ink" />
                      {s.coordenacao.telefone}
                    </a>
                  </Linha>
                  <Linha rotulo="Horário">{s.coordenacao.horario}</Linha>
                </dl>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
                  <a
                    className="btn-action"
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={ativo ? undefined : -1}
                    href={whatsappLink(
                      daSerie
                        ? `Olá! Gostaria de agendar uma visita ao Colégio Dask. Meu filho(a) vai cursar ${comArtigo(serie)}.`
                        : `Olá! Gostaria de agendar uma visita ao Colégio Dask para conhecer o ${s.nome}.`
                    )}
                  >
                    <IconeWhatsApp className="size-5" />
                    {daSerie ? `Agendar visita para ${comArtigo(serie)}` : "Agendar visita"}
                  </a>
                  {s.id === "fund1" && (
                    <Link
                      href="/central-do-aluno"
                      tabIndex={ativo ? undefined : -1}
                      className="link small font-semibold"
                    >
                      Lista de materiais
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="frame mt-12 flex flex-col gap-3 md:mt-16 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <p>
          <strong className="font-semibold">Psicologia escolar:</strong> {psicologa.nome},{" "}
          {psicologa.horario}, com agendamento pela secretaria.
        </p>
        <p className="small text-muted-foreground">
          Normas, listas de material e documentos de cada segmento ficam na{" "}
          <Link href="/central-do-aluno" className="link font-semibold text-foreground">
            Central do aluno
          </Link>
          .{" "}
          <a href={documentos.normas} target="_blank" rel="noopener noreferrer" className="link">
            Normas disciplinares
          </a>
        </p>
      </div>
    </section>
  )
}
