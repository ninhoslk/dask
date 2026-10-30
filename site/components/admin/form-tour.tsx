"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { salvarTour, type TourForm } from "@/app/admin/acoes"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const httpsValido = /^https:\/\/[^\s"'<>]+$/
// mesmo critério do servidor: endereço puro ou o src de um código <iframe>
const endereco = (t: string) =>
  (/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(t)?.[1] ?? t).replaceAll("&amp;", "&").trim()

export function FormTour({ inicial }: { inicial: TourForm }) {
  const [f, setF] = useState(inicial)
  const [salvando, iniciar] = useTransition()
  const previa = endereco(f.url_embed)

  return (
    <form
      className="mt-8 flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        iniciar(async () => {
          const r = await salvarTour(f)
          if (r.ok) toast.success("Tour salvo.")
          else toast.error(r.erro)
        })
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="titulo">Título</FieldLabel>
          <Input id="titulo" maxLength={200} value={f.titulo} onChange={(e) => setF({ ...f, titulo: e.target.value })} />
        </Field>
        <Field>
          <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
          <Textarea id="descricao" rows={3} maxLength={1000} value={f.descricao} onChange={(e) => setF({ ...f, descricao: e.target.value })} />
        </Field>
        <Field>
          <FieldLabel htmlFor="url">Código de incorporação (embed)</FieldLabel>
          <Textarea
            id="url"
            rows={3}
            placeholder={'<iframe src="https://…"></iframe>  ou só o endereço https://…'}
            value={f.url_embed}
            onChange={(e) => setF({ ...f, url_embed: e.target.value })}
          />
          <FieldDescription>
            No site do tour, use Compartilhar → Incorporar (embed) e cole o código do iframe ou o endereço dele. O link
            comum de compartilhar geralmente não pode aparecer dentro de outro site.
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Switch id="ativo" checked={f.ativo} onCheckedChange={(v) => setF({ ...f, ativo: v })} />
          <FieldLabel htmlFor="ativo">Tour visível no site</FieldLabel>
        </Field>
      </FieldGroup>

      {httpsValido.test(previa) && (
        <div className="aspect-video overflow-hidden rounded-md bg-muted">
          <iframe
            src={previa}
            title="Prévia do tour 360"
            className="size-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          />
        </div>
      )}

      <Button type="submit" size="lg" disabled={salvando} className="self-start">
        {salvando ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  )
}
