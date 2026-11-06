"use client"

import { useEffect, useRef, useState } from "react"

import { CentralDoAluno } from "@/components/central-do-aluno"
import { ConfigSite } from "@/components/config-site"
import { PaginaInicial } from "@/components/pagina-inicial"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { temaCss } from "@/lib/conteudo/dados"
import {
  normalizar,
  normalizarConfig,
  resolver,
  resolverConfig,
  type ConfigDoc,
  type Documento,
} from "@/lib/conteudo/documento"
import { tipoDaSecao } from "@/lib/conteudo/esquema"
import { podeDuplicar, podeMover } from "@/lib/conteudo/operacoes"
import type { NoticiaCartao } from "@/lib/noticias-tipos"

// Mensagens entre o editor (janela de cima) e a prévia (iframe). Só aceitas
// da mesma origem e da janela-mãe. A prévia guarda os dois rascunhos (home e
// informações do site), e cada editor manda o seu.
export type ParaPrevia =
  | { tipo: "documento"; pagina: "home" | "site"; doc: unknown }
  | { tipo: "selecionar"; id: string | null; rolar?: boolean }
export type DaPrevia =
  | { tipo: "pronto"; id?: undefined }
  | { tipo: "selecionar"; id: string }
  | { tipo: "mover"; id: string; direcao: -1 | 1 }
  | { tipo: "alternar"; id: string }
  | { tipo: "duplicar"; id: string }
  | { tipo: "remover"; id: string }

type Caixa = { id: string; top: number; left: number; width: number; height: number }

function caixaDa(el: Element | null): Caixa | null {
  const invólucro = el?.closest<HTMLElement>("[data-secao]")
  const alvo = invólucro?.firstElementChild
  if (!invólucro || !alvo) return null
  const r = alvo.getBoundingClientRect()
  return { id: invólucro.dataset.secao!, top: r.top, left: r.left, width: r.width, height: r.height }
}

export function PreviaAoVivo({
  home: homeInicial,
  site: siteInicial,
  pagina,
  noticias,
}: {
  home: Documento
  site: ConfigDoc
  pagina: "home" | "central"
  noticias: NoticiaCartao[]
}) {
  const [home, setHome] = useState(homeInicial)
  const [site, setSite] = useState(siteInicial)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [hover, setHover] = useState<Caixa | null>(null)
  const [fixa, setFixa] = useState<Caixa | null>(null)
  const ponteiro = useRef<{ x: number; y: number } | null>(null)

  const enviar = (m: DaPrevia) => window.parent.postMessage(m, window.location.origin)

  // receive the drafts and selection from the editor
  useEffect(() => {
    const aoReceber = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      const m = e.data as ParaPrevia
      if (m?.tipo === "documento") {
        if (m.pagina === "home") setHome(normalizar(m.doc))
        if (m.pagina === "site") setSite(normalizarConfig(m.doc))
      }
      if (m?.tipo === "selecionar") {
        setSelecionada(m.id)
        if (m.id && m.rolar) {
          const el = document.querySelector(`[data-secao="${CSS.escape(m.id)}"]`)?.firstElementChild
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
      setFixa(selecionada ? caixaDa(document.querySelector(`[data-secao="${CSS.escape(selecionada)}"] > *`)) : null)
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
  }, [selecionada, home])

  const config = resolverConfig(site)
  const caixa = hover ?? fixa
  const secaoDa = (id: string) => home.secoes.find((s) => s.id === id)
  const tipoDa = (id: string) => {
    const s = secaoDa(id)
    return s ? tipoDaSecao[s.tipo] : undefined
  }

  return (
    <ConfigSite config={config}>
      {/* draft colors over the published ones */}
      <style>{temaCss(config)}</style>
      {pagina === "central" ? (
        <>
          <div className="frame pt-5">
            <SiteHeader />
          </div>
          <CentralDoAluno />
        </>
      ) : (
        <main id="conteudo">
          <PaginaInicial secoes={resolver(home)} noticias={noticias} editavel />
        </main>
      )}
      <SiteFooter />

      {pagina === "home" && fixa && fixa.id !== caixa?.id && <Contorno caixa={fixa} forte />}
      {pagina === "home" && caixa && tipoDa(caixa.id) && (
        <>
          <Contorno caixa={caixa} forte={caixa.id === selecionada} />
          <div
            data-barra-previa
            className="fixed z-[100] flex items-center gap-1 rounded-b-lg bg-sky px-2 py-1 text-xs font-semibold text-white"
            style={{ top: Math.max(0, caixa.top), left: Math.max(0, caixa.left + 8) }}
          >
            <span className="px-1">
              {tipoDa(caixa.id)!.nome}
              {secaoDa(caixa.id)?.visivel === false ? " · oculta" : ""}
            </span>
            {!tipoDa(caixa.id)!.fixa && (
              <>
                <BotaoBarra
                  rotulo="Subir seção"
                  desativado={!podeMover(home, caixa.id, -1)}
                  onClick={() => enviar({ tipo: "mover", id: caixa.id, direcao: -1 })}
                >
                  ↑
                </BotaoBarra>
                <BotaoBarra
                  rotulo="Descer seção"
                  desativado={!podeMover(home, caixa.id, 1)}
                  onClick={() => enviar({ tipo: "mover", id: caixa.id, direcao: 1 })}
                >
                  ↓
                </BotaoBarra>
                <BotaoBarra
                  rotulo={secaoDa(caixa.id)?.visivel === false ? "Mostrar seção" : "Ocultar seção"}
                  onClick={() => enviar({ tipo: "alternar", id: caixa.id })}
                >
                  {secaoDa(caixa.id)?.visivel === false ? "Mostrar" : "Ocultar"}
                </BotaoBarra>
                {podeDuplicar(home, caixa.id) && (
                  <BotaoBarra rotulo="Duplicar seção" onClick={() => enviar({ tipo: "duplicar", id: caixa.id })}>
                    Duplicar
                  </BotaoBarra>
                )}
                <BotaoBarra rotulo="Remover seção" onClick={() => enviar({ tipo: "remover", id: caixa.id })}>
                  Remover
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
    </ConfigSite>
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
