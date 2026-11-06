"use client"

import { useEffect, useRef, useState } from "react"

import { PaginaInicial } from "@/components/pagina-inicial"
import { SiteFooter } from "@/components/site-footer"
import { normalizar, resolver, type Documento } from "@/lib/conteudo/documento"
import { tipoDaSecao, type IdSecao } from "@/lib/conteudo/esquema"
import { podeMover } from "@/lib/conteudo/operacoes"
import type { NoticiaCartao } from "@/lib/noticias-tipos"

// Mensagens entre o editor (janela de cima) e a prévia (iframe). Só aceitas
// da mesma origem e da janela-mãe.
export type ParaPrevia =
  | { tipo: "documento"; doc: Documento }
  | { tipo: "selecionar"; id: IdSecao | null; rolar?: boolean }
export type DaPrevia =
  | { tipo: "pronto" }
  | { tipo: "selecionar"; id: IdSecao }
  | { tipo: "mover"; id: IdSecao; direcao: -1 | 1 }
  | { tipo: "alternar"; id: IdSecao }

type Caixa = { id: IdSecao; top: number; left: number; width: number; height: number }

function caixaDa(el: Element | null): Caixa | null {
  const invólucro = el?.closest<HTMLElement>("[data-secao]")
  const alvo = invólucro?.firstElementChild
  if (!invólucro || !alvo) return null
  const r = alvo.getBoundingClientRect()
  return { id: invólucro.dataset.secao as IdSecao, top: r.top, left: r.left, width: r.width, height: r.height }
}

export function PreviaAoVivo({ inicial, noticias }: { inicial: Documento; noticias: NoticiaCartao[] }) {
  const [doc, setDoc] = useState(inicial)
  const [selecionada, setSelecionada] = useState<IdSecao | null>(null)
  const [hover, setHover] = useState<Caixa | null>(null)
  const [fixa, setFixa] = useState<Caixa | null>(null)
  const ponteiro = useRef<{ x: number; y: number } | null>(null)

  const enviar = (m: DaPrevia) => window.parent.postMessage(m, window.location.origin)

  // receive the draft and selection from the editor
  useEffect(() => {
    const aoReceber = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      const m = e.data as ParaPrevia
      if (m?.tipo === "documento") setDoc(normalizar(m.doc))
      if (m?.tipo === "selecionar") {
        setSelecionada(m.id)
        if (m.id && m.rolar) {
          const el = document.querySelector(`[data-secao="${m.id}"]`)?.firstElementChild
          el?.scrollIntoView({ behavior: "instant", block: "start" })
        }
      }
    }
    window.addEventListener("message", aoReceber)
    enviar({ tipo: "pronto" })
    return () => window.removeEventListener("message", aoReceber)
  }, [])

  // outline under the pointer and around the selected section, kept in place while scrolling
  useEffect(() => {
    let frame = 0
    const medir = () => {
      frame = 0
      const p = ponteiro.current
      setHover(p ? caixaDa(document.elementFromPoint(p.x, p.y)) : null)
      setFixa(selecionada ? caixaDa(document.querySelector(`[data-secao="${selecionada}"] > *`)) : null)
    }
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(medir)
    }
    const mover = (e: PointerEvent) => {
      ponteiro.current = { x: e.clientX, y: e.clientY }
      agendar()
    }
    const sair = () => {
      ponteiro.current = null
      agendar()
    }
    // the preview never navigates: links and buttons only select the section
    const clicar = (e: MouseEvent) => {
      const alvo = e.target as HTMLElement
      if (alvo.closest("[data-barra-previa]")) return
      if (alvo.closest("a")) e.preventDefault()
      const c = caixaDa(alvo)
      if (c) {
        setSelecionada(c.id)
        enviar({ tipo: "selecionar", id: c.id })
      }
    }
    medir()
    window.addEventListener("pointermove", mover, { passive: true })
    document.addEventListener("pointerleave", sair)
    window.addEventListener("scroll", agendar, { passive: true })
    window.addEventListener("resize", agendar)
    document.addEventListener("click", clicar, true)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", mover)
      document.removeEventListener("pointerleave", sair)
      window.removeEventListener("scroll", agendar)
      window.removeEventListener("resize", agendar)
      document.removeEventListener("click", clicar, true)
    }
  }, [selecionada, doc])

  const secoes = resolver(doc)
  const caixa = hover ?? fixa
  const oculta = (id: IdSecao) => !doc.secoes.find((s) => s.id === id)?.visivel

  return (
    <>
      <main id="conteudo">
        <PaginaInicial secoes={secoes} noticias={noticias} editavel />
      </main>
      <SiteFooter />

      {fixa && fixa.id !== caixa?.id && <Contorno caixa={fixa} forte />}
      {caixa && (
        <>
          <Contorno caixa={caixa} forte={caixa.id === selecionada} />
          <div
            data-barra-previa
            className="fixed z-[100] flex items-center gap-1 rounded-b-lg bg-sky px-2 py-1 text-xs font-semibold text-white"
            style={{ top: Math.max(0, caixa.top), left: Math.max(0, caixa.left + 8) }}
          >
            <span className="px-1">
              {tipoDaSecao[caixa.id].nome}
              {oculta(caixa.id) ? " · oculta" : ""}
            </span>
            {!tipoDaSecao[caixa.id].fixa && (
              <>
                <BotaoBarra
                  rotulo="Subir seção"
                  desativado={!podeMover(doc, caixa.id, -1)}
                  onClick={() => enviar({ tipo: "mover", id: caixa.id, direcao: -1 })}
                >
                  ↑
                </BotaoBarra>
                <BotaoBarra
                  rotulo="Descer seção"
                  desativado={!podeMover(doc, caixa.id, 1)}
                  onClick={() => enviar({ tipo: "mover", id: caixa.id, direcao: 1 })}
                >
                  ↓
                </BotaoBarra>
                <BotaoBarra rotulo={oculta(caixa.id) ? "Mostrar seção" : "Ocultar seção"} onClick={() => enviar({ tipo: "alternar", id: caixa.id })}>
                  {oculta(caixa.id) ? "Mostrar" : "Ocultar"}
                </BotaoBarra>
              </>
            )}
            <BotaoBarra
              rotulo="Editar seção"
              onClick={() => {
                setSelecionada(caixa.id)
                enviar({ tipo: "selecionar", id: caixa.id })
              }}
            >
              Editar
            </BotaoBarra>
          </div>
        </>
      )}
    </>
  )
}

function Contorno({ caixa, forte = false }: { caixa: Caixa; forte?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[99] rounded-sm"
      style={{
        top: caixa.top,
        left: caixa.left,
        width: caixa.width,
        height: caixa.height,
        outline: `${forte ? 3 : 2}px solid var(--sky)`,
        outlineOffset: -3,
      }}
    />
  )
}

function BotaoBarra({
  rotulo,
  onClick,
  desativado,
  children,
}: {
  rotulo: string
  onClick: () => void
  desativado?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      disabled={desativado}
      onClick={onClick}
      className="rounded px-1.5 py-0.5 hover:bg-white/20 disabled:opacity-40"
    >
      {children}
    </button>
  )
}
