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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  HistoryIcon,
  LockIcon,
  MonitorIcon,
  PlusIcon,
  Redo2Icon,
  SmartphoneIcon,
  TabletIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react"
import { toast } from "sonner"

import {
  lerRascunho,
  lerVersao,
  listarVersoes,
  publicar,
  salvarRascunho,
  type DocDaPagina,
  type EstadoDoc as EstadoBanco,
  type Pagina,
  type Versao,
} from "@/app/admin/acoes"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FieldGroup } from "@/components/ui/field"
import { grupoPorId, grupos, type IdGrupo } from "@/lib/conteudo/config"
import {
  normalizar,
  normalizarConfig,
  resolver,
  resolverConfig,
  type ConfigDoc,
  type Documento,
  type SecaoDoc,
} from "@/lib/conteudo/documento"
import { tipoDaSecao, type Campo, type IdSecao, type Valor } from "@/lib/conteudo/esquema"
import {
  acrescentarSecao,
  alternarSecao,
  duplicarSecao,
  moverSecao,
  mudarCampo as mudarCampoDaSecao,
  podeDuplicar,
  removerSecao,
  reordenarSecao,
  tiposDisponiveis,
} from "@/lib/conteudo/operacoes"
import { clienteNavegador, mesmaVersao, prepararTempoReal } from "@/lib/supabase/navegador"
import { cn } from "@/lib/utils"

const larguras = {
  desktop: { rotulo: "Computador", icone: MonitorIcon, px: null },
  tablet: { rotulo: "Tablet", icone: TabletIcon, px: 820 },
  celular: { rotulo: "Celular", icone: SmartphoneIcon, px: 390 },
} as const
type Tela = keyof typeof larguras

type Estado = "salvo" | "salvando" | "pendente" | "erro" | "conflito"

const igual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const normalizarDa = (p: Pagina, d: unknown): DocDaPagina => (p === "home" ? normalizar(d) : normalizarConfig(d))

// Editor visual: estrutura (seções da home ou grupos de informações), campos
// do item escolhido e a prévia ao vivo num iframe. O rascunho é salvo sozinho,
// só sobre a versão que este editor conhece; se outra pessoa salvar antes, o
// editor avisa em vez de apagar o trabalho dela. Mudanças de outras pessoas
// chegam sozinhas (Realtime do Supabase) quando não há nada pendente aqui.
export function Editor({
  pagina,
  inicial,
  publicado,
}: {
  pagina: Pagina
  inicial: { doc: DocDaPagina; versao: string | null }
  publicado: DocDaPagina
}) {
  const [doc, setDoc] = useState<DocDaPagina>(inicial.doc)
  const [passado, setPassado] = useState<DocDaPagina[]>([])
  const [futuro, setFuturo] = useState<DocDaPagina[]>([])
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [tela, setTela] = useState<Tela>("desktop")
  const [estado, setEstado] = useState<Estado>("salvo")
  const [noAr, setNoAr] = useState(publicado)
  const [conflito, setConflito] = useState<EstadoBanco | null>(null)
  const [publicando, iniciarPublicacao] = useTransition()
  const [historico, setHistorico] = useState(false)
  // small screens: one thing at a time, editing or preview
  const [vista, setVista] = useState<"editar" | "previa">("editar")
  const iframe = useRef<HTMLIFrameElement>(null)
  const docRef = useRef(doc)
  const versao = useRef(inicial.versao)
  const sujo = useRef(false)
  const travado = useRef(false)
  const enviado = useRef<DocDaPagina | null>(null)
  const estadoRef = useRef(estado)
  useEffect(() => {
    estadoRef.current = estado
  }, [estado])

  const previa = pagina === "site" && selecionada && grupoPorId[selecionada as IdGrupo]?.previa === "central" ? "central" : "home"

  const paraPrevia = useCallback((m: ParaPrevia) => {
    iframe.current?.contentWindow?.postMessage(m, window.location.origin)
  }, [])

  // every change: keep history, update the preview, save the draft shortly after
  const mudar = useCallback((proximo: DocDaPagina | ((d: DocDaPagina) => DocDaPagina)) => {
    const atual = docRef.current
    const novo = typeof proximo === "function" ? proximo(atual) : proximo
    if (igual(novo, atual)) return
    docRef.current = novo
    sujo.current = true
    setEstado((e) => (e === "conflito" ? e : "pendente"))
    setPassado((p) => [...p.slice(-80), atual])
    setFuturo([])
    setDoc(novo)
  }, [])

  // takes what is in the database as the new starting point (no undo across it)
  const adotar = useCallback((e: EstadoBanco) => {
    docRef.current = e.doc
    versao.current = e.versao
    sujo.current = false
    travado.current = false
    setConflito(null)
    setEstado("salvo")
    setDoc(e.doc)
  }, [])

  const salvar = useCallback(async () => {
    if (travado.current) return
    sujo.current = false
    setEstado("salvando")
    enviado.current = normalizarDa(pagina, docRef.current)
    const r = await salvarRascunho(pagina, docRef.current, versao.current)
    if (r.ok) {
      versao.current = r.versao
      setEstado(sujo.current ? "pendente" : "salvo")
    } else if (r.conflito) {
      travado.current = true
      setConflito(r.conflito)
      setEstado("conflito")
    } else {
      sujo.current = true
      setEstado("erro")
      toast.error(r.erro)
    }
  }, [pagina])

  useEffect(() => {
    paraPrevia({ tipo: "documento", pagina, doc })
    if (!sujo.current || travado.current) return
    const t = setTimeout(salvar, 900)
    return () => clearTimeout(t)
  }, [doc, pagina, paraPrevia, salvar])

  useEffect(() => {
    paraPrevia({ tipo: "selecionar", id: pagina === "home" ? selecionada : null })
  }, [selecionada, pagina, paraPrevia])

  // somebody else saved or published: follow along, or warn if there is local work
  useEffect(() => {
    const sb = clienteNavegador()
    let ativo = true
    let canal: ReturnType<typeof sb.channel> | undefined
    prepararTempoReal(sb).then(() => {
      if (!ativo) return
      canal = sb
        .channel(`editor-${pagina}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rascunhos", filter: `id=eq.${pagina}` }, (m) => {
          const linha = m.new as { conteudo: unknown; atualizado_em: string }
          if (mesmaVersao(linha.atualizado_em, versao.current)) return
          const recebido = normalizarDa(pagina, linha.conteudo)
          // the echo of our own save (it can arrive before the save answers)
          if (igual(recebido, enviado.current)) return
          const outro = { doc: recebido, versao: linha.atualizado_em, autor: "Outra pessoa da equipe" }
          if (sujo.current || estadoRef.current === "salvando") {
            travado.current = true
            setConflito(outro)
            setEstado("conflito")
          } else {
            adotar(outro)
            toast.info("O rascunho foi atualizado com as mudanças de outra pessoa da equipe.")
          }
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "paginas", filter: `id=eq.${pagina}` }, (m) => {
          setNoAr(normalizarDa(pagina, (m.new as { conteudo: unknown }).conteudo))
        })
        .subscribe()
    })
    return () => {
      ativo = false
      if (canal) sb.removeChannel(canal)
    }
  }, [pagina, adotar])

  // safety net for when Realtime is down: check again when the tab comes back
  useEffect(() => {
    const aoVoltar = async () => {
      if (document.visibilityState !== "visible" || sujo.current || travado.current) return
      const r = await lerRascunho(pagina)
      if (r.ok && r.dados && !mesmaVersao(r.dados.versao, versao.current) && !sujo.current) adotar(r.dados)
    }
    document.addEventListener("visibilitychange", aoVoltar)
    return () => document.removeEventListener("visibilitychange", aoVoltar)
  }, [pagina, adotar])

  // home: every change goes through the pure operations in lib/conteudo/operacoes.ts
  const naHome = useCallback(
    (op: (d: Documento) => Documento) => mudar((d) => op(d as Documento)),
    [mudar]
  )
  const mover = useCallback((id: string, direcao: -1 | 1) => naHome((d) => moverSecao(d, id, direcao)), [naHome])
  const alternar = useCallback((id: string) => naHome((d) => alternarSecao(d, id)), [naHome])
  const duplicar = useCallback((id: string) => naHome((d) => duplicarSecao(d, id)), [naHome])
  const remover = useCallback(
    (id: string) => {
      const s = (docRef.current as Documento).secoes.find((x) => x.id === id)
      if (!s || tipoDaSecao[s.tipo].fixa) return
      if (!window.confirm(`Remover a seção "${tipoDaSecao[s.tipo].nome}" da página? Dá para desfazer com Ctrl+Z.`)) return
      setSelecionada((sel) => (sel === id ? null : sel))
      naHome((d) => removerSecao(d, id))
    },
    [naHome]
  )

  // messages from the preview
  useEffect(() => {
    const aoReceber = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframe.current?.contentWindow) return
      const m = e.data as DaPrevia
      if (m?.tipo === "pronto") paraPrevia({ tipo: "documento", pagina, doc: docRef.current })
      if (pagina !== "home") return
      const existe = typeof m?.id === "string" && (docRef.current as Documento).secoes.some((s) => s.id === m.id)
      if (!existe) return
      if (m.tipo === "selecionar") setSelecionada(m.id)
      if (m.tipo === "mover") mover(m.id, m.direcao === -1 ? -1 : 1)
      if (m.tipo === "alternar") alternar(m.id)
      if (m.tipo === "duplicar") duplicar(m.id)
      if (m.tipo === "remover") remover(m.id)
    }
    window.addEventListener("message", aoReceber)
    return () => window.removeEventListener("message", aoReceber)
  }, [pagina, paraPrevia, mover, alternar, duplicar, remover])

  const desfazer = useCallback(() => {
    if (!passado.length) return
    const anterior = passado[passado.length - 1]
    setFuturo((f) => [docRef.current, ...f])
    setPassado(passado.slice(0, -1))
    docRef.current = anterior
    sujo.current = true
    setEstado((e) => (e === "conflito" ? e : "pendente"))
    setDoc(anterior)
  }, [passado])
  const refazer = useCallback(() => {
    if (!futuro.length) return
    const proximo = futuro[0]
    setPassado((p) => [...p, docRef.current])
    setFuturo(futuro.slice(1))
    docRef.current = proximo
    sujo.current = true
    setEstado((e) => (e === "conflito" ? e : "pendente"))
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
      if (estado === "pendente" || estado === "salvando" || estado === "conflito") e.preventDefault()
    }
    window.addEventListener("beforeunload", aviso)
    return () => window.removeEventListener("beforeunload", aviso)
  }, [estado])

  const aoPublicar = () =>
    iniciarPublicacao(async () => {
      enviado.current = normalizarDa(pagina, docRef.current)
      const r = await publicar(pagina, docRef.current)
      if (r.ok) {
        versao.current = r.dados?.versao ?? versao.current
        sujo.current = false
        setNoAr(docRef.current)
        setEstado("salvo")
        if (r.aviso) toast.warning(r.aviso)
        else toast.success("Publicado. O site já mostra as mudanças.")
      } else toast.error(r.erro)
    })

  // --- what is selected and its fields ---
  let painel: { titulo: string; descricao: string; campos: Campo[]; valores: Record<string, Valor>; alterados: Record<string, Valor> } | null = null
  let mudarCampo: (chave: string, v: Valor | undefined) => void = () => {}
  if (pagina === "home" && selecionada) {
    const secao = (doc as Documento).secoes.find((s) => s.id === selecionada)
    if (secao) {
      const tipo = tipoDaSecao[secao.tipo]
      painel = { titulo: tipo.nome, descricao: tipo.descricao, campos: tipo.campos, valores: resolver({ v: 2, secoes: [secao] })[0].c, alterados: secao.campos }
      mudarCampo = (chave, v) => naHome((d) => mudarCampoDaSecao(d, selecionada, chave, v))
    }
  }
  if (pagina === "site" && selecionada && selecionada in grupoPorId) {
    const id = selecionada as IdGrupo
    const g = grupoPorId[id]
    const alterados = (doc as ConfigDoc).grupos[id] ?? {}
    painel = { titulo: g.nome, descricao: g.descricao, campos: g.campos, valores: resolverConfig(doc as ConfigDoc)[id], alterados }
    mudarCampo = (chave, v) =>
      mudar((d) => {
        const c = d as ConfigDoc
        const campos = { ...(c.grupos[id] ?? {}) }
        if (v === undefined) delete campos[chave]
        else campos[chave] = v
        return { grupos: { ...c.grupos, [id]: campos } }
      })
  }

  const sel = painel
  const pendenteDePublicar = !igual(normalizarDa(pagina, doc), normalizarDa(pagina, noAr))

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="flex shrink-0 gap-1 border-b bg-background p-1.5 lg:hidden" role="group" aria-label="Mostrar">
        {(["editar", "previa"] as const).map((v) => (
          <Button key={v} size="sm" className="flex-1" variant={vista === v ? "secondary" : "ghost"} aria-pressed={vista === v} onClick={() => setVista(v)}>
            {v === "editar" ? "Editar" : "Prévia"}
          </Button>
        ))}
      </div>
      {/* side panel */}
      <aside
        className={cn(
          "min-h-0 w-full flex-1 flex-col bg-background lg:w-[24rem] lg:flex-none lg:shrink-0 lg:border-r",
          vista === "editar" ? "flex" : "hidden lg:flex"
        )}
        data-lenis-prevent
      >
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
            {{ salvo: "Rascunho salvo", salvando: "Salvando…", pendente: "Alterações…", erro: "Erro ao salvar", conflito: "Conflito" }[estado]}
          </span>
        </div>

        {conflito && (
          <div role="alert" className="flex flex-col gap-2 border-b bg-tint p-3 text-sm">
            <p className="font-semibold">{conflito.autor} mudou este rascunho enquanto você editava.</p>
            <p className="text-muted-foreground">Suas mudanças ainda não foram salvas. Escolha o que fica:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  adotar(conflito)
                  setPassado([])
                  setFuturo([])
                }}
              >
                Carregar a versão dela
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  versao.current = conflito.versao
                  travado.current = false
                  setConflito(null)
                  sujo.current = true
                  salvar()
                }}
              >
                Manter a minha
              </Button>
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {sel ? (
            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                className="inline-flex items-center gap-1 self-start text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftIcon aria-hidden className="size-4" />
                {pagina === "home" ? "Todas as seções" : "Todas as informações"}
              </button>
              <div>
                <h2 className="text-lg font-extrabold tracking-[-0.02em]">{sel.titulo}</h2>
                <p className="text-sm text-muted-foreground">{sel.descricao}</p>
              </div>
              <FieldGroup>
                {sel.campos.map((campo) => (
                  <EditorCampo
                    key={`${selecionada}-${campo.chave}`}
                    campo={campo}
                    valor={sel.valores[campo.chave]}
                    alterado={campo.chave in sel.alterados}
                    aoMudar={(v) => mudarCampo(campo.chave, v)}
                    aoRestaurar={() => mudarCampo(campo.chave, undefined)}
                  />
                ))}
              </FieldGroup>
            </div>
          ) : pagina === "home" ? (
            <Estrutura
              doc={doc as Documento}
              aoMudar={naHome}
              aoAlternar={alternar}
              aoSelecionar={setSelecionada}
              aoDuplicar={duplicar}
              aoRemover={remover}
            />
          ) : (
            <ListaGrupos doc={doc as ConfigDoc} aoSelecionar={setSelecionada} />
          )}
        </div>

        <div className="flex flex-col gap-2 border-t p-3">
          <Button onClick={aoPublicar} disabled={publicando || !pendenteDePublicar || estado === "conflito"} size="lg">
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
      <section className={cn("min-h-0 min-w-0 flex-1 flex-col bg-muted", vista === "previa" ? "flex" : "hidden lg:flex")} aria-label="Prévia">
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
            key={previa}
            src={previa === "central" ? "/admin/previa?pagina=central" : "/admin/previa"}
            title="Prévia do site com o rascunho"
            className="mx-auto block h-full rounded-md border-0 bg-background"
            style={{ width: larguras[tela].px ?? "100%" }}
          />
        </div>
      </section>

      <Historico
        pagina={pagina}
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

// ---- site information: one card per group ------------------------------------

function ListaGrupos({ doc, aoSelecionar }: { doc: ConfigDoc; aoSelecionar: (id: IdGrupo) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-extrabold tracking-[-0.02em]">Informações do site</h2>
        <p className="text-sm text-muted-foreground">
          Valem para todas as páginas: mudou aqui, muda no cabeçalho, no rodapé, na home e na Central do aluno.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {grupos.map((g) => {
          const mudados = Object.keys(doc.grupos[g.id] ?? {}).length
          return (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => aoSelecionar(g.id)}
                className="flex w-full items-center gap-2 rounded-md p-3 text-left ring-1 ring-border hover:bg-tint"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{g.nome}</span>
                  <span className="block text-xs text-muted-foreground">{g.descricao}</span>
                </span>
                {mudados > 0 && (
                  <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-semibold" title="Campos alterados">
                    {mudados}
                  </span>
                )}
                <ChevronRightIcon aria-hidden className="size-4 text-muted-foreground" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---- home sections: drag, hide, duplicate, remove, add ----------------------

function Estrutura({
  doc,
  aoMudar,
  aoAlternar,
  aoSelecionar,
  aoDuplicar,
  aoRemover,
}: {
  doc: Documento
  aoMudar: (op: (d: Documento) => Documento) => void
  aoAlternar: (id: string) => void
  aoSelecionar: (id: string) => void
  aoDuplicar: (id: string) => void
  aoRemover: (id: string) => void
}) {
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const fixas = doc.secoes.filter((s) => tipoDaSecao[s.tipo].fixa)
  const moveis = doc.secoes.filter((s) => !tipoDaSecao[s.tipo].fixa)
  const disponiveis = tiposDisponiveis(doc).map((t) => tipoDaSecao[t])

  const aoSoltar = ({ active, over }: DragEndEvent) => {
    if (!over) return
    aoMudar((d) => reordenarSecao(d, String(active.id), String(over.id)))
  }

  const acrescentar = (tipo: IdSecao) => {
    const { id } = acrescentarSecao(doc, tipo)
    aoMudar((d) => acrescentarSecao(d, tipo).doc)
    if (id) aoSelecionar(id)
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
              {tipoDaSecao[s.tipo].nome}
            </button>
          </li>
        ))}
      </ul>
      <DndContext id="estrutura-secoes" sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
        <SortableContext items={moveis.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {moveis.map((s) => (
              <ItemSecao
                key={s.id}
                secao={s}
                aoAlternar={() => aoAlternar(s.id)}
                aoSelecionar={() => aoSelecionar(s.id)}
                aoDuplicar={podeDuplicar(doc, s.id) ? () => aoDuplicar(s.id) : undefined}
                aoRemover={() => aoRemover(s.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {disponiveis.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="self-start">
              <PlusIcon data-icon="inline-start" />
              Adicionar seção
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>Escolha o tipo</DropdownMenuLabel>
            {disponiveis.map((t) => (
              <DropdownMenuItem key={t.id} onSelect={() => acrescentar(t.id)} className="flex-col items-start gap-0">
                <span className="font-semibold">{t.nome}</span>
                <span className="text-xs text-muted-foreground">{t.descricao}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

function ItemSecao({
  secao,
  aoAlternar,
  aoSelecionar,
  aoDuplicar,
  aoRemover,
}: {
  secao: SecaoDoc
  aoAlternar: () => void
  aoSelecionar: () => void
  aoDuplicar?: () => void
  aoRemover: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: secao.id })
  const tipo = tipoDaSecao[secao.tipo]
  const nome = tipo.extra && typeof secao.campos.titulo === "string" && secao.campos.titulo.trim() ? secao.campos.titulo.split("\n")[0] : tipo.nome
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-1.5 rounded-md bg-background p-2 ring-1 ring-border",
        isDragging && "z-10 ring-2 ring-sky",
        !secao.visivel && "opacity-60"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={`Arrastar ${nome}`}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon aria-hidden className="size-4" />
      </button>
      <button type="button" className="min-w-0 flex-1 text-left" onClick={aoSelecionar}>
        <span className="block truncate font-semibold">{nome}</span>
        <span className="block truncate text-xs text-muted-foreground">{tipo.extra ? tipo.nome : tipo.descricao}</span>
      </button>
      {aoDuplicar && (
        <Button variant="ghost" size="icon" onClick={aoDuplicar} aria-label={`Duplicar ${nome}`} title="Duplicar">
          <CopyIcon />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={aoAlternar}
        aria-label={secao.visivel ? `Ocultar ${nome}` : `Mostrar ${nome}`}
        title={secao.visivel ? "Ocultar do site" : "Mostrar no site"}
      >
        {secao.visivel ? <EyeIcon /> : <EyeOffIcon />}
      </Button>
      <Button variant="ghost" size="icon" onClick={aoRemover} aria-label={`Remover ${nome}`} title="Remover da página">
        <Trash2Icon />
      </Button>
    </li>
  )
}

// ---- publication history -----------------------------------------------------

function Historico({
  pagina,
  aberto,
  aoFechar,
  aoRestaurar,
}: {
  pagina: Pagina
  aberto: boolean
  aoFechar: () => void
  aoRestaurar: (d: DocDaPagina) => void
}) {
  const [versoes, setVersoes] = useState<Versao[] | null>(null)

  useEffect(() => {
    if (!aberto) return
    let ativo = true
    listarVersoes(pagina).then((r) => {
      if (!ativo) return
      if (r.ok) setVersoes(r.dados ?? [])
      else toast.error(r.erro)
    })
    return () => {
      ativo = false
    }
  }, [aberto, pagina])

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
                    const r = await lerVersao(pagina, v.id)
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
