"use client"

import { useId, useState } from "react"
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
import { ChevronDownIcon, CopyIcon, GripVerticalIcon, ImageIcon, PlusIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"

import { SeletorImagem } from "@/components/admin/seletor-imagem"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { linkSeguro } from "@/lib/conteudo/documento"
import type { Campo, Imagem, Item, Opcao, Registro, Subcampo, Valor } from "@/lib/conteudo/esquema"
import { cn } from "@/lib/utils"

// Um editor por tipo de campo do esquema (lib/conteudo/esquema.ts).
export function EditorCampo({
  campo,
  valor,
  alterado,
  aoMudar,
  aoRestaurar,
}: {
  campo: Campo
  valor: Valor
  alterado: boolean
  aoMudar: (v: Valor) => void
  aoRestaurar: () => void
}) {
  const id = `campo-${campo.chave}`
  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{campo.rotulo}</FieldLabel>
        {alterado && (
          <button
            type="button"
            onClick={aoRestaurar}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            title="Voltar ao texto original"
          >
            <RotateCcwIcon aria-hidden className="size-3" />
            Original
          </button>
        )}
      </div>
      {campo.tipo === "texto" && (
        <Input id={id} value={valor as string} maxLength={2000} onChange={(e) => aoMudar(e.target.value)} />
      )}
      {campo.tipo === "textarea" && (
        <Textarea id={id} value={valor as string} maxLength={2000} rows={3} onChange={(e) => aoMudar(e.target.value)} />
      )}
      {campo.tipo === "link" && <CampoLink id={id} valor={valor as string} aoMudar={aoMudar} />}
      {campo.tipo === "cor" && <CampoCor id={id} valor={valor as string} aoMudar={aoMudar} />}
      {campo.tipo === "numero" && (
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="number"
            className="w-28"
            min={campo.min}
            max={campo.max}
            value={valor as number}
            onChange={(e) => e.target.value !== "" && aoMudar(Math.min(campo.max, Math.max(campo.min, Number(e.target.value))))}
          />
          {campo.unidade && <span className="text-sm text-muted-foreground">{campo.unidade}</span>}
        </div>
      )}
      {campo.tipo === "escolha" && <CampoEscolha id={id} opcoes={campo.opcoes} valor={valor as string} aoMudar={aoMudar} />}
      {campo.tipo === "registros" && (
        <CampoRegistros valor={valor as Registro[]} subcampos={campo.subcampos} titulo={campo.titulo} novo={campo.novo} aoMudar={aoMudar} />
      )}
      {campo.tipo === "imagem" && <CampoImagem id={id} valor={valor as Imagem} aoMudar={aoMudar} />}
      {campo.tipo === "imagens" && (
        <CampoImagens valor={valor as Imagem[]} fixo={Boolean(campo.fixo)} aoMudar={aoMudar} />
      )}
      {campo.tipo === "lista" && <CampoLista valor={valor as string[]} aoMudar={aoMudar} />}
      {campo.tipo === "itens" && (
        <CampoItens valor={valor as Item[]} rotulos={campo.rotulos ?? ["Título", "Texto"]} aoMudar={aoMudar} />
      )}
      {campo.ajuda && <FieldDescription>{campo.ajuda}</FieldDescription>}
    </Field>
  )
}

function CampoImagem({ id, valor, aoMudar }: { id?: string; valor: Imagem; aoMudar: (v: Imagem) => void }) {
  const [aberto, setAberto] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        id={id}
        onClick={() => setAberto(true)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-md bg-muted"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={valor.src} alt="" className="size-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-field/70 font-semibold text-field-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-2">
            <ImageIcon aria-hidden className="size-4" />
            Trocar imagem
          </span>
        </span>
      </button>
      <Input
        aria-label="Descrição da imagem (para leitores de tela)"
        placeholder="Descrição da imagem…"
        value={valor.alt}
        maxLength={300}
        onChange={(e) => aoMudar({ ...valor, alt: e.target.value })}
      />
      <SeletorImagem aberto={aberto} aoFechar={() => setAberto(false)} aoEscolher={(src) => aoMudar({ ...valor, src })} />
    </div>
  )
}

// ---- sortable lists ----------------------------------------------------------

function useArrastar() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
}

function Linha({ id, children, aoRemover }: { id: string; children: React.ReactNode; aoRemover?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded-md bg-background p-2 ring-1 ring-border ${isDragging ? "z-10 ring-2 ring-sky" : ""}`}
    >
      <button
        type="button"
        className="mt-1.5 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label="Arrastar para reordenar"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon aria-hidden className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
      {aoRemover && (
        <button type="button" onClick={aoRemover} aria-label="Remover" className="mt-1.5 text-muted-foreground hover:text-destructive">
          <Trash2Icon aria-hidden className="size-4" />
        </button>
      )}
    </li>
  )
}

function ListaOrdenavel<T>({
  itens,
  aoMudar,
  render,
  novo,
  fixo = false,
}: {
  itens: T[]
  aoMudar: (v: T[]) => void
  render: (item: T, mudar: (v: T) => void) => React.ReactNode
  novo?: () => T
  fixo?: boolean
}) {
  const sensores = useArrastar()
  // id estável: o servidor e o navegador geram os mesmos atributos de acessibilidade
  const idArrastar = useId()
  // stable ids for dnd-kit while the list is being edited
  const [ids, setIds] = useState(() => itens.map(() => crypto.randomUUID()))
  const lista = ids.length === itens.length ? ids : itens.map((_, i) => ids[i] ?? `n-${i}`)

  const aoSoltar = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const de = lista.indexOf(String(active.id))
    const para = lista.indexOf(String(over.id))
    setIds(arrayMove(lista, de, para))
    aoMudar(arrayMove(itens, de, para))
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext id={idArrastar} sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
        <SortableContext items={lista} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {itens.map((item, i) => (
              <Linha
                key={lista[i]}
                id={lista[i]}
                aoRemover={
                  fixo
                    ? undefined
                    : () => {
                        setIds(lista.filter((_, j) => j !== i))
                        aoMudar(itens.filter((_, j) => j !== i))
                      }
                }
              >
                {render(item, (v) => aoMudar(itens.map((x, j) => (j === i ? v : x))))}
              </Linha>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {novo && !fixo && itens.length < 40 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => {
            setIds([...lista, crypto.randomUUID()])
            aoMudar([...itens, novo()])
          }}
        >
          <PlusIcon data-icon="inline-start" />
          Adicionar
        </Button>
      )}
    </div>
  )
}

function CampoImagens({ valor, fixo, aoMudar }: { valor: Imagem[]; fixo: boolean; aoMudar: (v: Imagem[]) => void }) {
  return (
    <ListaOrdenavel
      itens={valor}
      fixo={fixo}
      aoMudar={aoMudar}
      novo={() => ({ src: valor[0]?.src ?? "/fotos/campus.jpg", alt: "" })}
      render={(img, mudar) => <CampoImagem valor={img} aoMudar={mudar} />}
    />
  )
}

function CampoLista({ valor, aoMudar }: { valor: string[]; aoMudar: (v: string[]) => void }) {
  return (
    <ListaOrdenavel
      itens={valor}
      aoMudar={aoMudar}
      novo={() => ""}
      render={(t, mudar) => <Input aria-label="Item" value={t} maxLength={300} onChange={(e) => mudar(e.target.value)} />}
    />
  )
}

function CampoItens({ valor, rotulos, aoMudar }: { valor: Item[]; rotulos: [string, string]; aoMudar: (v: Item[]) => void }) {
  return (
    <ListaOrdenavel
      itens={valor}
      aoMudar={aoMudar}
      novo={() => ({ titulo: "", texto: "" })}
      render={(it, mudar) => (
        <div className="flex flex-col gap-1.5">
          <Input aria-label={rotulos[0]} placeholder={rotulos[0]} value={it.titulo} maxLength={300} onChange={(e) => mudar({ ...it, titulo: e.target.value })} />
          <Textarea aria-label={rotulos[1]} placeholder={rotulos[1]} value={it.texto} maxLength={600} rows={2} onChange={(e) => mudar({ ...it, texto: e.target.value })} />
        </div>
      )}
    />
  )
}

// ---- links, colors and choices -----------------------------------------------

function CampoLink({ id, valor, aoMudar }: { id?: string; valor: string; aoMudar: (v: string) => void }) {
  // keeps what is being typed; only a valid address reaches the document
  const [rascunho, setRascunho] = useState(valor)
  // undo, "Original" or a change from someone else: follow the new value
  const [visto, setVisto] = useState(valor)
  if (valor !== visto) {
    setVisto(valor)
    setRascunho(valor)
  }
  const invalido = linkSeguro(rascunho) === undefined
  return (
    <div className="flex flex-col gap-1">
      <Input
        id={id}
        value={rascunho}
        maxLength={1000}
        aria-invalid={invalido || undefined}
        placeholder="/pagina, /#secao ou https://…"
        onChange={(e) => {
          setRascunho(e.target.value)
          const ok = linkSeguro(e.target.value)
          if (ok !== undefined) aoMudar(ok)
        }}
      />
      {invalido && (
        <p className="text-xs text-destructive">
          Use um endereço do site (/noticias, /#ensino) ou completo, começando com https://, mailto: ou tel:.
        </p>
      )}
    </div>
  )
}

function CampoCor({ id, valor, aoMudar }: { id?: string; valor: string; aoMudar: (v: string) => void }) {
  const [texto, setTexto] = useState(valor)
  const [visto, setVisto] = useState(valor)
  if (valor !== visto) {
    setVisto(valor)
    setTexto(valor)
  }
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label="Escolher a cor"
        value={/^#[0-9a-f]{6}$/i.test(valor) ? valor : "#000000"}
        onChange={(e) => {
          setTexto(e.target.value)
          aoMudar(e.target.value)
        }}
        className="size-10 shrink-0 cursor-pointer rounded-md border bg-background p-1"
      />
      <Input
        id={id}
        value={texto}
        maxLength={7}
        className="w-32 font-semibold uppercase"
        onChange={(e) => {
          setTexto(e.target.value)
          if (/^#[0-9a-f]{6}$/i.test(e.target.value)) aoMudar(e.target.value.toLowerCase())
        }}
      />
    </div>
  )
}

function CampoEscolha({ id, opcoes, valor, aoMudar }: { id?: string; opcoes: Opcao[]; valor: string; aoMudar: (v: string) => void }) {
  return (
    <Select value={valor} onValueChange={aoMudar}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {opcoes.map((o) => (
          <SelectItem key={o.valor} value={o.valor}>
            {o.rotulo}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ---- records: cards, menu items, coordinations, documents --------------------

const novoId = () => `r${crypto.randomUUID().slice(0, 8)}`

function registroVazio(subcampos: Subcampo[]): Registro {
  const r: Registro = { _id: novoId(), ativo: true }
  for (const s of subcampos) {
    if (s.tipo === "simnao") r[s.chave] = false
    else if (s.tipo === "escolha") r[s.chave] = s.opcoes[0].valor
    else if (s.tipo === "registros") r[s.chave] = []
    else if (s.tipo !== "imagem") r[s.chave] = ""
  }
  return r
}

/** Cópia com ids novos (também nos registros de dentro). */
function copiaDe(r: Registro): Registro {
  const c = structuredClone(r)
  c._id = novoId()
  for (const [k, v] of Object.entries(c)) {
    if (Array.isArray(v)) c[k] = (v as Registro[]).map(copiaDe)
  }
  return c
}

function CampoRegistros({
  valor,
  subcampos,
  titulo,
  novo,
  aoMudar,
}: {
  valor: Registro[]
  subcampos: Subcampo[]
  titulo: string
  novo: string
  aoMudar: (v: Registro[]) => void
}) {
  const sensores = useArrastar()
  // id estável: o servidor e o navegador geram os mesmos atributos de acessibilidade
  const idArrastar = useId()
  const [aberto, setAberto] = useState<string | null>(null)

  const aoSoltar = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const de = valor.findIndex((r) => r._id === active.id)
    const para = valor.findIndex((r) => r._id === over.id)
    aoMudar(arrayMove(valor, de, para))
  }
  const trocar = (id: string, r: Registro) => aoMudar(valor.map((x) => (x._id === id ? r : x)))

  return (
    <div className="flex flex-col gap-2">
      <DndContext id={idArrastar} sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
        <SortableContext items={valor.map((r) => r._id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {valor.map((r, i) => (
              <CartaoRegistro
                key={r._id}
                registro={r}
                nome={(typeof r[titulo] === "string" && (r[titulo] as string).trim()) || `Item ${i + 1}`}
                aberto={aberto === r._id}
                aoAbrir={() => setAberto(aberto === r._id ? null : r._id)}
                aoMudar={(x) => trocar(r._id, x)}
                aoDuplicar={() => {
                  const c = copiaDe(r)
                  aoMudar([...valor.slice(0, i + 1), c, ...valor.slice(i + 1)])
                  setAberto(c._id)
                }}
                aoRemover={() => {
                  if (window.confirm("Remover este item? Se quiser só esconder, desligue a chave.")) aoMudar(valor.filter((x) => x._id !== r._id))
                }}
              >
                {subcampos.map((s) => (
                  <EditorSubcampo key={s.chave} sub={s} registro={r} aoMudar={(x) => trocar(r._id, x)} />
                ))}
              </CartaoRegistro>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {valor.length < 60 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => {
            const r = registroVazio(subcampos)
            aoMudar([...valor, r])
            setAberto(r._id)
          }}
        >
          <PlusIcon data-icon="inline-start" />
          {novo}
        </Button>
      )}
    </div>
  )
}

function CartaoRegistro({
  registro,
  nome,
  aberto,
  aoAbrir,
  aoMudar,
  aoDuplicar,
  aoRemover,
  children,
}: {
  registro: Registro
  nome: string
  aberto: boolean
  aoAbrir: () => void
  aoMudar: (r: Registro) => void
  aoDuplicar: () => void
  aoRemover: () => void
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: registro._id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("rounded-md bg-background ring-1 ring-border", isDragging && "z-10 ring-2 ring-sky")}
    >
      <div className="flex items-center gap-1.5 p-2">
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          aria-label={`Arrastar ${nome}`}
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={aoAbrir}
          aria-expanded={aberto}
          className={cn("flex min-w-0 flex-1 items-center gap-1 text-left text-sm font-semibold", !registro.ativo && "text-muted-foreground line-through")}
        >
          <ChevronDownIcon aria-hidden className={cn("size-4 shrink-0 transition-transform", !aberto && "-rotate-90")} />
          <span className="truncate">{nome}</span>
        </button>
        <Switch
          checked={registro.ativo}
          onCheckedChange={(v) => aoMudar({ ...registro, ativo: v })}
          aria-label={registro.ativo ? `Desligar ${nome} (some do site)` : `Ligar ${nome}`}
          title={registro.ativo ? "Aparece no site" : "Escondido do site"}
        />
        <button type="button" onClick={aoDuplicar} aria-label={`Duplicar ${nome}`} title="Duplicar" className="p-1 text-muted-foreground hover:text-foreground">
          <CopyIcon aria-hidden className="size-4" />
        </button>
        <button type="button" onClick={aoRemover} aria-label={`Remover ${nome}`} title="Remover" className="p-1 text-muted-foreground hover:text-destructive">
          <Trash2Icon aria-hidden className="size-4" />
        </button>
      </div>
      {aberto && <div className="flex flex-col gap-3 border-t p-3">{children}</div>}
    </li>
  )
}

function EditorSubcampo({ sub, registro, aoMudar }: { sub: Subcampo; registro: Registro; aoMudar: (r: Registro) => void }) {
  const id = `sub-${registro._id}-${sub.chave}`
  const v = registro[sub.chave]
  const por = (x: Registro[string]) => aoMudar({ ...registro, [sub.chave]: x })
  return (
    <div className="flex flex-col gap-1.5">
      {sub.tipo === "simnao" ? (
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
          <Switch id={id} checked={v === true} onCheckedChange={(x) => por(x)} />
          {sub.rotulo}
        </label>
      ) : (
        <label htmlFor={id} className="text-sm font-medium">
          {sub.rotulo}
        </label>
      )}
      {(sub.tipo === "texto" || sub.tipo === "telefone") && (
        <Input id={id} value={(v as string) ?? ""} maxLength={300} inputMode={sub.tipo === "telefone" ? "tel" : undefined} onChange={(e) => por(e.target.value)} />
      )}
      {sub.tipo === "textarea" && <Textarea id={id} value={(v as string) ?? ""} maxLength={1000} rows={3} onChange={(e) => por(e.target.value)} />}
      {sub.tipo === "link" && <CampoLink id={id} valor={(v as string) ?? ""} aoMudar={por} />}
      {sub.tipo === "escolha" && <CampoEscolha id={id} opcoes={sub.opcoes} valor={(v as string) ?? sub.opcoes[0].valor} aoMudar={por} />}
      {sub.tipo === "imagem" && <CampoImagem id={id} valor={(v as Imagem) ?? { src: "/fotos/campus.jpg", alt: "" }} aoMudar={por} />}
      {sub.tipo === "registros" && (
        <CampoRegistros valor={(v as Registro[]) ?? []} subcampos={sub.subcampos} titulo={sub.titulo} novo={sub.novo} aoMudar={por} />
      )}
      {sub.ajuda && <p className="text-xs text-muted-foreground">{sub.ajuda}</p>}
    </div>
  )
}
