"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Linhas } from "@/components/linhas"
import { useConfig } from "@/components/config-site"
import { contatoDe, psicologiaDe, segmentosDe, type Segmento } from "@/lib/conteudo/dados"
import { preencher, txt } from "@/lib/conteudo/documento"
import type { ConteudoDe } from "@/lib/conteudo/esquema"
import { IconeWhatsApp } from "@/components/icones-redes"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// "o 1º ano", mas "a 2ª série"
const comArtigo = (serie: string, maiuscula = false) => {
  const artigo = serie.includes("série") ? "a" : "o"
  return `${maiuscula ? artigo.toUpperCase() : artigo} ${serie}`
}

// "Ensino Fundamental I": o numeral não fica sozinho na linha
const nomeInteiro = (nome: string) => nome.replace(/ (I+)$/, " $1")

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 py-1.5 sm:grid-cols-[minmax(0,11ch)_1fr] sm:gap-4">
      <dt className="text-muted-foreground max-sm:text-sm">{rotulo}</dt>
      <dd>{children}</dd>
    </div>
  )
}

// Os segmentos são cartões lado a lado numa faixa da largura da tela.
// Escolher a série (ou clicar num cartão apagado) desliza a faixa até o cartão
// daquele segmento ficar no centro; os outros ficam apagados nas laterais.
// Só transform e opacity animam; com movimento reduzido, a troca é instantânea.
// Segmentos, coordenação e psicologia vêm de Informações do site → Segmentos e
// coordenação; os textos desta seção, dos campos dela.
export function Ensino({ c }: { c: ConteudoDe<"ensino"> }) {
  const cfg = useConfig()
  const segmentos = segmentosDe(cfg)
  const psicologia = psicologiaDe(cfg)
  const contato = contatoDe(cfg)
  const normas = txt(cfg.central, "normas")
  const segmentoDa = (serie: string | undefined): Segmento | undefined =>
    segmentos.find((s) => serie && s.series.includes(serie))

  const [serie, setSerie] = useState<string>()
  const [foco, setFoco] = useState<string | undefined>(segmentos[Math.min(1, segmentos.length - 1)]?.id)
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

  // setas embaixo dos cartões: passam para o segmento vizinho
  const anterior = segmentos[indice - 1]
  const proximo = segmentos[indice + 1]

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
          <Linhas texto={c.titulo} />
        </h2>

        <div className="col-span-12 flex flex-col gap-4 lg:col-span-6" data-reveal>
          <label htmlFor="serie" className="lead font-semibold">
            {c.pergunta}
          </label>
          <Select value={serie} onValueChange={escolherSerie}>
            <SelectTrigger id="serie" className="w-full bg-background pl-4! text-base! data-[size=default]:h-12 sm:max-w-sm">
              <SelectValue placeholder={c.placeholder} />
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
            const mensagem = daSerie
              ? preencher(c.mensagemSerie, { serie: comArtigo(serie) })
              : preencher(c.mensagemSegmento, { segmento: s.nome })
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
                {s.resumo && <p className="mt-3 text-muted-foreground">{s.resumo}</p>}
                <dl className="mt-6">
                  <Linha rotulo={c.rotuloSeries}>
                    <span className="font-semibold">{s.series.join(", ")}</span>
                  </Linha>
                  {s.coordenador && (
                    <Linha rotulo={c.rotuloCoordenacao}>
                      <span className="font-semibold">{s.coordenador}</span>
                    </Linha>
                  )}
                  {s.whatsapp && (
                    <Linha rotulo={c.rotuloAtendimento}>
                      <a
                        href={s.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={ativo ? undefined : -1}
                        className="link inline-flex items-center gap-2 font-semibold"
                        aria-label={`WhatsApp da ${s.cargo.toLowerCase() || "coordenação"}: ${s.telefone}`}
                      >
                        <IconeWhatsApp className="size-5 shrink-0 text-whatsapp-ink" />
                        {s.telefone}
                      </a>
                    </Linha>
                  )}
                  {s.horario && <Linha rotulo={c.rotuloHorario}>{s.horario}</Linha>}
                </dl>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
                  {contato.whatsapp && (
                    <a
                      className="btn-action"
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={ativo ? undefined : -1}
                      href={contato.whatsappCom(mensagem)}
                    >
                      <IconeWhatsApp className="size-5" />
                      {daSerie ? preencher(c.botaoSerie, { serie: comArtigo(serie) }) : c.botao}
                    </a>
                  )}
                  {s.atalhoTexto && s.atalhoLink && (
                    <Link href={s.atalhoLink} tabIndex={ativo ? undefined : -1} className="link small font-semibold">
                      {s.atalhoTexto}
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* no celular as duas setas ficam juntas à esquerda e o nome depois delas,
          longe dos botões flutuantes do canto direito */}
      {segmentos.length > 1 && (
        <div className="frame mt-8 flex items-center justify-start gap-3 md:mt-10 md:justify-center md:gap-4">
          <Button
            type="button"
            variant="outline"
            className="size-12 rounded-full"
            disabled={!anterior}
            aria-label={anterior ? `Ver ${anterior.nome}` : `${segmentos[0].nome} é o primeiro`}
            onClick={() => anterior && focarCartao(anterior.id)}
          >
            <ChevronLeftIcon aria-hidden className="size-6" />
          </Button>
          <p aria-live="polite" className="font-semibold max-md:order-last max-md:ml-1 md:min-w-[13ch] md:text-center">
            {segmentos[indice]?.nome}
          </p>
          <Button
            type="button"
            variant="outline"
            className="size-12 rounded-full"
            disabled={!proximo}
            aria-label={proximo ? `Ver ${proximo.nome}` : `${segmentos[segmentos.length - 1].nome} é o último`}
            onClick={() => proximo && focarCartao(proximo.id)}
          >
            <ChevronRightIcon aria-hidden className="size-6" />
          </Button>
        </div>
      )}

      <div className="frame mt-10 flex flex-col gap-3 md:mt-14 md:flex-row md:items-baseline md:justify-between md:gap-10">
        {psicologia.nome && (
          <p>
            <strong className="font-semibold">{psicologia.titulo}:</strong> {psicologia.nome}
            {psicologia.horario && `, ${psicologia.horario}`}
            {psicologia.nota && `, ${psicologia.nota}`}.
          </p>
        )}
        <p className="small text-muted-foreground">
          {c.nota}{" "}
          <Link href="/central-do-aluno" className="link font-semibold text-foreground">
            {c.notaLink}
          </Link>
          .{" "}
          {normas && (
            <a href={normas} target="_blank" rel="noopener noreferrer" className="link">
              {c.normasTexto}
            </a>
          )}
        </p>
      </div>
    </section>
  )
}
