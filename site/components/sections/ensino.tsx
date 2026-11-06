"use client"

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Linhas } from "@/components/linhas"
import { useConfig } from "@/components/config-site"
import { img, preencher, txt, type Conteudo } from "@/lib/conteudo/documento"
import { contatoDe, psicologiaDe, segmentosDe, type Segmento } from "@/lib/conteudo/dados"
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

// Segmentos, coordenação e psicologia vêm de Informações do site → Segmentos
// e coordenação; os textos desta seção, dos campos dela.
export function Ensino({ c }: { c: Conteudo }) {
  const cfg = useConfig()
  const segmentos = segmentosDe(cfg)
  const psicologia = psicologiaDe(cfg)
  const contato = contatoDe(cfg)
  const normas = txt(cfg.central, "normas")
  const foto = img(c, "foto")
  const [serie, setSerie] = useState<string>()
  const atual: Segmento | undefined = segmentos.find((s) => serie && s.series.includes(serie))

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
                <SelectValue placeholder={txt(c, "placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {segmentos.map((s) => (
                  <SelectGroup key={s.id}>
                    <SelectLabel>{s.nome}</SelectLabel>
                    {s.series.map((x) => (
                      <SelectItem key={`${s.id}-${x}`} value={x}>
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
                    {preencher(txt(c, "resposta"), {
                      serie,
                      segmento: atual.nome,
                      coordenador: atual.coordenador,
                      horario: atual.horario,
                    })}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    {contato.whatsapp && (
                      <a
                        className="btn-action"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={contato.whatsappCom(preencher(txt(c, "mensagemSerie"), { serie }))}
                      >
                        <IconeWhatsApp className="size-5" />
                        {preencher(txt(c, "botaoSerie"), { serie })}
                      </a>
                    )}
                    {atual.atalhoTexto && atual.atalhoLink && (
                      <a href={atual.atalhoLink} className="link small font-semibold">
                        {atual.atalhoTexto}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{txt(c, "vazio")}</p>
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
              Segmentos, séries e coordenação do {contato.nome}
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
                {s.resumo && (
                  <tr>
                    <td colSpan={2} className="pb-5 text-muted-foreground">
                      {s.resumo}
                    </td>
                  </tr>
                )}
                <tr>
                  <th scope="row" className="w-[34%] py-2 align-top font-normal text-muted-foreground">
                    {txt(c, "rotuloSeries")}
                  </th>
                  <td className="py-2 font-semibold">{s.series.join(", ")}</td>
                </tr>
                {s.coordenador && (
                  <tr>
                    <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                      {txt(c, "rotuloCoordenacao")}
                    </th>
                    <td className="py-2 font-semibold">{s.coordenador}</td>
                  </tr>
                )}
                {s.whatsapp && (
                  <tr>
                    <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                      {txt(c, "rotuloAtendimento")}
                    </th>
                    <td className="py-2">
                      <a
                        href={s.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link inline-flex items-center gap-2 font-semibold"
                        aria-label={`WhatsApp da ${s.cargo.toLowerCase() || "coordenação"}: ${s.telefone}`}
                      >
                        <IconeWhatsApp className="size-5 shrink-0 text-whatsapp-ink" />
                        {s.telefone}
                      </a>
                    </td>
                  </tr>
                )}
                {s.horario && (
                  <tr>
                    <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                      {txt(c, "rotuloHorario")}
                    </th>
                    <td className="py-2">{s.horario}</td>
                  </tr>
                )}
              </tbody>
            ))}
            {psicologia.nome && (
              <tbody data-reveal>
                <tr>
                  <th
                    scope="rowgroup"
                    colSpan={2}
                    className="pt-14 pb-2 text-[clamp(26px,2.4vw,36px)] font-extrabold tracking-[-0.04em]"
                  >
                    {psicologia.titulo}
                  </th>
                </tr>
                <tr>
                  <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                    {psicologia.rotulo}
                  </th>
                  <td className="py-2 font-semibold">{psicologia.nome}</td>
                </tr>
                {psicologia.horario && (
                  <tr>
                    <th scope="row" className="py-2 align-top font-normal text-muted-foreground">
                      {txt(c, "rotuloHorario")}
                    </th>
                    <td className="py-2">
                      {[psicologia.horario, psicologia.nota].filter(Boolean).join(", ")}
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          <p className="small mt-10 text-muted-foreground">
            {txt(c, "nota")}{" "}
            <a href="/central-do-aluno" className="link font-semibold text-foreground">
              {txt(c, "notaLink")}
            </a>
            .{" "}
            {normas && (
              <a href={normas} target="_blank" rel="noopener noreferrer" className="link">
                {txt(c, "normasTexto")}
              </a>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
