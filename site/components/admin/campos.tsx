"use client"

import { useState } from "react"
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
import { GripVerticalIcon, ImageIcon, PlusIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"

import { SeletorImagem } from "@/components/admin/seletor-imagem"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Campo, Imagem, Item, Valor } from "@/lib/conteudo/esquema"

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
      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
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
