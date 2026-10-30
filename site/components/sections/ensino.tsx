"use client"

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Linhas } from "@/components/linhas"
import { img, txt, type Conteudo } from "@/lib/conteudo/documento"
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

export function Ensino({ c }: { c: Conteudo }) {
  const foto = img(c, "foto")
  const [serie, setSerie] = useState<string>()
  const atual = segmentoDa(serie)

  return (
    <section
      id="ensino"
      aria-labelledby="ensino-title"
      className="frame bg-tint"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <h2 id="ensino-title" className="head md:indent-[3vw]" data-reveal>
        <Linhas texto={txt(c, "titulo")} />
      </h2>

      <div className="grid12 mt-16 gap-y-16 md:mt-24">
        {/* the live thing: pick a grade, get the segment and the right contact */}
        <div className="col-span-12 flex flex-col gap-10 md:col-span-5 lg:col-span-4">
          <div
            data-reveal
            className="flex flex-col gap-4 rounded-[var(--radius)] bg-background p-6 md:p-7"
          >
            <label htmlFor="serie" className="lead font-semibold">
              {txt(c, "pergunta")}
            </label>
            <Select value={serie} onValueChange={setSerie}>
              <SelectTrigger id="serie" className="h-12 w-full bg-background text-base">
                <SelectValue placeholder="Escolha a série…" />
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

            <div aria-live="polite" className="min-h-[9.5rem]">
              {atual && serie ? (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p>
                    O {serie} faz parte do <strong>{atual.nome}</strong>.
                    Quem acompanha a turma é {atual.coordenacao.nome}, que
                    atende por ligação ou WhatsApp das{" "}
                    {atual.coordenacao.horario}.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    <a
                      className="btn-action"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={whatsappLink(
                        `Olá! Gostaria de agendar uma visita ao Colégio Dask. Meu filho(a) vai cursar o ${serie}.`
                      )}
                    >
                      <IconeWhatsApp className="size-5" />
                      Agendar visita para o {serie}
                    </a>
                    {atual.id === "fund1" && (
                      <a href="/central-do-aluno" className="link small font-semibold">
                        Lista de materiais
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Mostramos o segmento, quem coordena a turma e um atalho para
                  agendar a visita já com a série preenchida.
                </p>
              )}
            </div>
          </div>

          <div
            data-reveal
            className="media hidden aspect-[4/5] w-[78%] md:block"
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              width={1920}
              height={1440}
              sizes="30vw"
            />
          </div>
        </div>

        {/* the table: segments, grades, coordination */}
        <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Segmentos, séries e coordenação do Colégio Dask
            </caption>
            {segmentos.map((s, i) => (
              <tbody
                key={s.id}
                data-reveal
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
                className={cn(
                  "transition-opacity duration-300",
                  atual && atual.id !== s.id && "opacity-35"
                )}
              >
                <tr>
                  <th
                    scope="rowgroup"
                    colSpan={2}
                    className={cn(
                      "pb-2 text-[clamp(26px,2.4vw,36px)] font-extrabold tracking-[-0.04em]",
                      i > 0 && "pt-14"
                    )}
                  >
                    {s.nome}
                  </th>
                </tr>
                <tr>
                  <td colSpan={2} className="pb-5 text-muted-foreground">
                    {s.resumo}
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="w-[34%] py-2 align-top font-normal text-muted-foreground">
                    Séries
                  </th>
                  <td className="py-2 font-semibold">{s.series.join(", ")}</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                    Coordenação
                  </th>
                  <td className="py-2 font-semibold">{s.coordenacao.nome}</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                    Atendimento
                  </th>
                  <td className="py-2">
                    <a
                      href={`https://wa.me/${s.coordenacao.numero}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link inline-flex items-center gap-2 font-semibold"
                      aria-label={`WhatsApp da ${s.coordenacao.cargo.toLowerCase()}: ${s.coordenacao.telefone}`}
                    >
                      <IconeWhatsApp className="size-5 shrink-0 text-whatsapp-ink" />
                      {s.coordenacao.telefone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                    Horário
                  </th>
                  <td className="py-2">{s.coordenacao.horario}</td>
                </tr>
              </tbody>
            ))}
            <tbody data-reveal>
              <tr>
                <th
                  scope="rowgroup"
                  colSpan={2}
                  className="pt-14 pb-2 text-[clamp(26px,2.4vw,36px)] font-extrabold tracking-[-0.04em]"
                >
                  Psicologia escolar
                </th>
              </tr>
              <tr>
                <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                  Psicóloga
                </th>
                <td className="py-2 font-semibold">{psicologa.nome}</td>
              </tr>
              <tr>
                <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                  Horários
                </th>
                <td className="py-2">{psicologa.horario}, com agendamento pela secretaria</td>
              </tr>
            </tbody>
          </table>
          <p className="small mt-10 text-muted-foreground">
            Normas, listas de material e documentos de cada segmento ficam na{" "}
            <a href="/central-do-aluno" className="link font-semibold text-foreground">
              Central do aluno
            </a>
            . <a href={documentos.normas} target="_blank" rel="noopener noreferrer" className="link">
              Normas disciplinares
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
