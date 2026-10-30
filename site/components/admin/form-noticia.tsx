"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { toast } from "sonner"

import { apagarNoticia, salvarNoticia, type NoticiaForm } from "@/app/admin/acoes"
import { SeletorImagem } from "@/components/admin/seletor-imagem"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const paraDataLocal = (iso: string) => {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function FormNoticia({ inicial }: { inicial: NoticiaForm }) {
  const [f, setF] = useState(inicial)
  const [imagemAberta, setImagemAberta] = useState(false)
  const [salvando, iniciar] = useTransition()
  const router = useRouter()
  const mudar = <K extends keyof NoticiaForm>(k: K, v: NoticiaForm[K]) => setF((x) => ({ ...x, [k]: v }))

  const salvar = () =>
    iniciar(async () => {
      const r = await salvarNoticia(f)
      if (!r.ok) {
        toast.error(r.erro)
        return
      }
      toast.success("Notícia salva.")
      if (!f.id && r.dados) router.replace(`/admin/noticias/${r.dados.id}`)
      else router.refresh()
    })

  return (
    <div className="h-full overflow-y-auto">
      <form
        className="mx-auto flex max-w-3xl flex-col gap-6 p-6"
        onSubmit={(e) => {
          e.preventDefault()
          salvar()
        }}
      >
        <Link
          href="/admin/noticias"
          className="inline-flex items-center gap-1 self-start text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
          Notícias
        </Link>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em]">{f.id ? "Editar notícia" : "Nova notícia"}</h1>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="titulo">Título</FieldLabel>
            <Input id="titulo" required maxLength={300} value={f.titulo} onChange={(e) => mudar("titulo", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="data">Data</FieldLabel>
              <Input
                id="data"
                type="datetime-local"
                value={paraDataLocal(f.data)}
                onChange={(e) => e.target.value && mudar("data", new Date(e.target.value).toISOString())}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="categoria">Assunto</FieldLabel>
              <select
                id="categoria"
                value={f.categoria}
                onChange={(e) => mudar("categoria", e.target.value as NoticiaForm["categoria"])}
                className="h-9 rounded-md border border-input bg-background px-3"
              >
                <option>Geral</option>
                <option>Ensino</option>
                <option>Eventos</option>
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Endereço</FieldLabel>
              <Input id="slug" placeholder="gerado do título" maxLength={120} value={f.slug} onChange={(e) => mudar("slug", e.target.value)} />
            </Field>
          </div>
          <Field>
            <FieldLabel>Foto de capa</FieldLabel>
            <button
              type="button"
              onClick={() => setImagemAberta(true)}
              className="group relative grid aspect-[16/9] w-full max-w-md place-items-center overflow-hidden rounded-md bg-muted"
            >
              {f.imagem ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.imagem} alt="" className="size-full object-cover" />
              ) : (
                <span className="inline-flex items-center gap-2 font-semibold text-muted-foreground">
                  <ImageIcon aria-hidden className="size-4" />
                  Escolher foto
                </span>
              )}
            </button>
            {f.imagem && (
              <button type="button" className="self-start text-sm text-muted-foreground hover:text-destructive" onClick={() => mudar("imagem", "")}>
                Remover foto
              </button>
            )}
            <SeletorImagem
              aberto={imagemAberta}
              aoFechar={() => setImagemAberta(false)}
              aoEscolher={(src) => mudar("imagem", src.startsWith("/") ? `${window.location.origin}${src}` : src)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="resumo">Resumo</FieldLabel>
            <Textarea id="resumo" rows={2} maxLength={600} value={f.resumo} onChange={(e) => mudar("resumo", e.target.value)} />
            <FieldDescription>Aparece na lista e ao compartilhar. Se ficar vazio, usamos o começo do texto.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="conteudo">Texto</FieldLabel>
            <Textarea id="conteudo" rows={14} value={f.conteudo} onChange={(e) => mudar("conteudo", e.target.value)} />
            <FieldDescription>Deixe uma linha em branco entre parágrafos. Scripts e estilos são removidos ao salvar.</FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Switch id="publicado" checked={f.publicado} onCheckedChange={(v) => mudar("publicado", v)} />
            <FieldLabel htmlFor="publicado">Publicada no site</FieldLabel>
          </Field>
        </FieldGroup>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar"}
          </Button>
          {f.id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" className="text-destructive">
                  Apagar notícia
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apagar esta notícia?</AlertDialogTitle>
                  <AlertDialogDescription>Ela sai do site na hora e não dá para desfazer.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const r = await apagarNoticia(f.id!)
                      if (r.ok) {
                        toast.success("Notícia apagada.")
                        router.replace("/admin/noticias")
                      } else toast.error(r.erro)
                    }}
                  >
                    Apagar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </div>
  )
}
