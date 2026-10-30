"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  HistoryIcon,
  LockIcon,
  MonitorIcon,
  Redo2Icon,
  SmartphoneIcon,
  TabletIcon,
  Undo2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { lerVersao, listarVersoes, publicar, salvarRascunho, type Versao } from "@/app/admin/acoes"
import { EditorCampo } from "@/components/admin/campos"
import type { DaPrevia, ParaPrevia } from "@/components/admin/previa-ao-vivo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { normalizar, resolver, type Documento } from "@/lib/conteudo/documento"
import { tipoDaSecao, type IdSecao, type Valor } from "@/lib/conteudo/esquema"
import { cn } from "@/lib/utils"

const larguras = {
  desktop: { rotulo: "Computador", icone: MonitorIcon, px: null },
  tablet: { rotulo: "Tablet", icone: TabletIcon, px: 820 },
  celular: { rotulo: "Celular", icone: SmartphoneIcon, px: 390 },
} as const
type Tela = keyof typeof larguras

type Estado = "salvo" | "salvando" | "pendente" | "erro"

const igual = (a: Documento, b: Documento) => JSON.stringify(a) === JSON.stringify(b)

// Editor visual da home: estrutura (arrastar, mostrar/ocultar), campos da
// seção escolhida e a prévia ao vivo num iframe. O rascunho é salvo sozinho;
// o site só muda ao publicar.
export function Editor({ rascunho, publicado }: { rascunho: Documento; publicado: Documento }) {
  const [doc, setDoc] = useState(rascunho)
  const [passado, setPassado] = useState<Documento[]>([])
  const [futuro, setFuturo] = useState<Documento[]>([])
  const [selecionada, setSelecionada] = useState<IdSecao | null>(null)
  const [tela, setTela] = useState<Tela>("desktop")
  const [estado, setEstado] = useState<Estado>("salvo")
  const [noAr, setNoAr] = useState(publicado)
  const [publicando, iniciarPublicacao] = useTransition()
  const [historico, setHistorico] = useState(false)
  const iframe = useRef<HTMLIFrameElement>(null)
  const docRef = useRef(doc)
  const sujo = useRef(false)

  const paraPrevia = useCallback((m: ParaPrevia) => {
    iframe.current?.contentWindow?.postMessage(m, window.location.origin)
  }, [])

  // every change: keep history, update the preview, save the draft shortly after
  const mudar = useCallback((proximo: Documento | ((d: Documento) => Documento)) => {
    const atual = docRef.current
    const novo = typeof proximo === "function" ? proximo(atual) : proximo
    if (igual(novo, atual)) return
    docRef.current = novo
    sujo.current = true
    setEstado("pendente")
    setPassado((p) => [...p.slice(-80), atual])
    setFuturo([])
    setDoc(novo)
  }, [])

  useEffect(() => {
    paraPrevia({ tipo: "documento", doc })
    if (!sujo.current) return
    const t = setTimeout(async () => {
      sujo.current = false
      setEstado("salvando")
      const r = await salvarRascunho(doc)
      setEstado(r.ok ? "salvo" : "erro")
      if (!r.ok) toast.error(r.erro)
    }, 900)
    return () => clearTimeout(t)
  }, [doc, paraPrevia])

  useEffect(() => {
    paraPrevia({ tipo: "selecionar", id: selecionada })
  }, [selecionada, paraPrevia])

  const mover = useCallback(
    (id: IdSecao, direcao: -1 | 1) =>
      mudar((d) => {
        const i = d.secoes.findIndex((s) => s.id === id)
        const j = i + direcao
        if (i < 0 || j < 1 || j >= d.secoes.length || tipoDaSecao[id].fixa) return d
        return { secoes: arrayMove(d.secoes, i, j) }
      }),
    [mudar]
  )
  const alternar = useCallback(
    (id: IdSecao) =>
      mudar((d) => ({
        secoes: d.secoes.map((s) => (s.id === id && !tipoDaSecao[id].fixa ? { ...s, visivel: !s.visivel } : s)),
      })),
    [mudar]
  )

  // messages from the preview
  useEffect(() => {
    const aoReceber = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframe.current?.contentWindow) return
      const m = e.data as DaPrevia
      if (m?.tipo === "pronto") paraPrevia({ tipo: "documento", doc: docRef.current })
      if (m?.tipo === "selecionar" && m.id in tipoDaSecao) setSelecionada(m.id)
      if (m?.tipo === "mover" && m.id in tipoDaSecao) mover(m.id, m.direcao === -1 ? -1 : 1)
      if (m?.tipo === "alternar" && m.id in tipoDaSecao) alternar(m.id)
    }
    window.addEventListener("message", aoReceber)
    return () => window.removeEventListener("message", aoReceber)
  }, [paraPrevia, mover, alternar])

  const desfazer = useCallback(() => {
    if (!passado.length) return
    const anterior = passado[passado.length - 1]
    setFuturo((f) => [docRef.current, ...f])
    setPassado(passado.slice(0, -1))
    docRef.current = anterior
    sujo.current = true
    setEstado("pendente")
    setDoc(anterior)
  }, [passado])
  const refazer = useCallback(() => {
    if (!futuro.length) return
    const proximo = futuro[0]
    setPassado((p) => [...p, docRef.current])
    setFuturo(futuro.slice(1))
    docRef.current = proximo
    sujo.current = true
    setEstado("pendente")
    setDoc(proximo)
  }, [futuro])

  useEffect(() => {
    const atalho = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || (e.target as HTMLElement).closest("input,textarea")) return
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault()
        desfazer()
      } else if (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey)) {
        e.preventDefault()
        refazer()
      }
    }
    window.addEventListener("keydown", atalho)
    return () => window.removeEventListener("keydown", atalho)
  }, [desfazer, refazer])

  // leaving with an unsaved draft
  useEffect(() => {
    const aviso = (e: BeforeUnloadEvent) => {
      if (estado === "pendente" || estado === "salvando") e.preventDefault()
    }
    window.addEventListener("beforeunload", aviso)
    return () => window.removeEventListener("beforeunload", aviso)
  }, [estado])

  const aoPublicar = () =>
    iniciarPublicacao(async () => {
      const r = await publicar(doc)
      if (r.ok) {
        setNoAr(doc)
        setEstado("salvo")
        toast.success("Publicado. O site já mostra as mudanças.")
      } else toast.error(r.erro)
    })

  const secao = selecionada ? doc.secoes.find((s) => s.id === selecionada) : undefined
  const resolvida = secao ? resolver({ secoes: [secao] })[0] : undefined
  const mudarCampo = (chave: string, v: Valor | undefined) =>
    mudar((d) => ({
      secoes: d.secoes.map((s) => {
        if (s.id !== selecionada) return s
        const campos = { ...s.campos }
        if (v === undefined) delete campos[chave]
        else campos[chave] = v
        return { ...s, campos }
      }),
    }))

  const pendenteDePublicar = !igual(normalizar(doc), normalizar(noAr))

  return (
    <div className="flex h-full min-h-0">
      {/* side panel */}
      <aside className="flex w-[22rem] shrink-0 flex-col border-r bg-background" data-lenis-prevent>
        <div className="flex items-center gap-1 border-b p-2">
          <Button variant="ghost" size="icon" onClick={desfazer} disabled={!passado.length} aria-label="Desfazer (Ctrl+Z)" title="Desfazer (Ctrl+Z)">
            <Undo2Icon />
          </Button>
          <Button variant="ghost" size="icon" onClick={refazer} disabled={!futuro.length} aria-label="Refazer (Ctrl+Y)" title="Refazer (Ctrl+Y)">
            <Redo2Icon />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setHistorico(true)} aria-label="Histórico de publicações" title="Histórico de publicações">
            <HistoryIcon />
          </Button>
          <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">
            {{ salvo: "Rascunho salvo", salvando: "Salvando…", pendente: "Alterações…", erro: "Erro ao salvar" }[estado]}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {secao && resolvida ? (
            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                className="inline-flex items-center gap-1 self-start text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftIcon aria-hidden className="size-4" />
                Todas as seções
              </button>
              <div>
                <h2 className="text-lg font-extrabold tracking-[-0.02em]">{tipoDaSecao[secao.id].nome}</h2>
                <p className="text-sm text-muted-foreground">{tipoDaSecao[secao.id].descricao}</p>
              </div>
              <FieldGroup>
                {tipoDaSecao[secao.id].campos.map((campo) => (
                  <EditorCampo
                    key={`${secao.id}-${campo.chave}`}
                    campo={campo}
                    valor={resolvida.c[campo.chave]}
                    alterado={campo.chave in secao.campos}
                    aoMudar={(v) => mudarCampo(campo.chave, v)}
                    aoRestaurar={() => mudarCampo(campo.chave, undefined)}
                  />
                ))}
              </FieldGroup>
            </div>
          ) : (
            <Estrutura doc={doc} aoMudar={mudar} aoAlternar={alternar} aoSelecionar={setSelecionada} />
          )}
        </div>

        <div className="flex flex-col gap-2 border-t p-3">
          <Button onClick={aoPublicar} disabled={publicando || !pendenteDePublicar} size="lg">
            {publicando ? "Publicando…" : pendenteDePublicar ? "Publicar no site" : "Tudo publicado"}
          </Button>
          {pendenteDePublicar && (
            <Button variant="ghost" size="sm" onClick={() => mudar(noAr)}>
              Descartar e voltar ao que está no ar
            </Button>
          )}
        </div>
      </aside>

      {/* preview */}
      <section className="flex min-w-0 flex-1 flex-col bg-muted" aria-label="Prévia">
        <div className="flex items-center justify-center gap-1 border-b bg-background p-1.5">
          {(Object.keys(larguras) as Tela[]).map((t) => {
            const { rotulo, icone: Icone } = larguras[t]
            return (
              <Button
                key={t}
                variant={tela === t ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={tela === t}
                onClick={() => setTela(t)}
              >
                <Icone data-icon="inline-start" />
                {rotulo}
              </Button>
            )
          })}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          <iframe
            ref={iframe}
            src="/admin/previa"
            title="Prévia do site com o rascunho"
            className="mx-auto block h-full rounded-md border-0 bg-background"
            style={{ width: larguras[tela].px ?? "100%" }}
          />
        </div>
      </section>

      <Historico
        aberto={historico}
        aoFechar={() => setHistorico(false)}
        aoRestaurar={(d) => {
          mudar(d)
          toast.success("Versão carregada no rascunho. Publique para colocá-la no ar.")
        }}
      />
    </div>
  )
}

// ---- section list: drag to reorder, eye to hide ------------------------------

function Estrutura({
  doc,
  aoMudar,
  aoAlternar,
  aoSelecionar,
}: {
  doc: Documento
  aoMudar: (d: Documento) => void
  aoAlternar: (id: IdSecao) => void
  aoSelecionar: (id: IdSecao) => void
}) {
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const fixas = doc.secoes.filter((s) => tipoDaSecao[s.id].fixa)
  const moveis = doc.secoes.filter((s) => !tipoDaSecao[s.id].fixa)

  const aoSoltar = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const de = moveis.findIndex((s) => s.id === active.id)
    const para = moveis.findIndex((s) => s.id === over.id)
    aoMudar({ secoes: [...fixas, ...arrayMove(moveis, de, para)] })
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-extrabold tracking-[-0.02em]">Seções da página</h2>
        <p className="text-sm text-muted-foreground">
          Arraste para mudar a ordem, clique para editar textos e fotos, ou clique direto na prévia.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {fixas.map((s) => (
          <li key={s.id} className="flex items-center gap-2 rounded-md p-2 ring-1 ring-border">
            <LockIcon aria-hidden className="size-4 text-muted-foreground" />
            <button type="button" className="flex-1 text-left font-semibold" onClick={() => aoSelecionar(s.id)}>
              {tipoDaSecao[s.id].nome}
            </button>
          </li>
        ))}
      </ul>
      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
        <SortableContext items={moveis.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {moveis.map((s) => (
              <ItemSecao key={s.id} id={s.id} visivel={s.visivel} aoAlternar={() => aoAlternar(s.id)} aoSelecionar={() => aoSelecionar(s.id)} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function ItemSecao({
  id,
  visivel,
  aoAlternar,
  aoSelecionar,
}: {
  id: IdSecao
  visivel: boolean
  aoAlternar: () => void
  aoSelecionar: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-md bg-background p-2 ring-1 ring-border",
        isDragging && "z-10 ring-2 ring-sky",
        !visivel && "opacity-60"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={`Arrastar ${tipoDaSecao[id].nome}`}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon aria-hidden className="size-4" />
      </button>
      <button type="button" className="min-w-0 flex-1 text-left" onClick={aoSelecionar}>
        <span className="block font-semibold">{tipoDaSecao[id].nome}</span>
        <span className="block truncate text-xs text-muted-foreground">{tipoDaSecao[id].descricao}</span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={aoAlternar}
        aria-label={visivel ? `Ocultar ${tipoDaSecao[id].nome}` : `Mostrar ${tipoDaSecao[id].nome}`}
        title={visivel ? "Ocultar do site" : "Mostrar no site"}
      >
        {visivel ? <EyeIcon /> : <EyeOffIcon />}
      </Button>
    </li>
  )
}

// ---- publication history -----------------------------------------------------

function Historico({
  aberto,
  aoFechar,
  aoRestaurar,
}: {
  aberto: boolean
  aoFechar: () => void
  aoRestaurar: (d: Documento) => void
}) {
  const [versoes, setVersoes] = useState<Versao[] | null>(null)

  useEffect(() => {
    if (!aberto) return
    let ativo = true
    listarVersoes().then((r) => {
      if (!ativo) return
      if (r.ok) setVersoes(r.dados ?? [])
      else toast.error(r.erro)
    })
    return () => {
      ativo = false
    }
  }, [aberto])

  const data = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" })

  return (
    <Dialog open={aberto} onOpenChange={(v) => !v && aoFechar()}>
      <DialogContent data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Histórico de publicações</DialogTitle>
          <DialogDescription>Carregue uma versão antiga no rascunho para revisar e publicar de novo.</DialogDescription>
        </DialogHeader>
        {versoes === null ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : versoes.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma publicação ainda.</p>
        ) : (
          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {versoes.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 rounded-md p-2 ring-1 ring-border">
                <span>
                  <span className="block font-semibold">{data.format(new Date(v.criado_em))}</span>
                  <span className="text-sm text-muted-foreground">{v.autor}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const r = await lerVersao(v.id)
                    if (r.ok && r.dados) {
                      aoRestaurar(r.dados)
                      aoFechar()
                    } else if (!r.ok) toast.error(r.erro)
                  }}
                >
                  Carregar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
