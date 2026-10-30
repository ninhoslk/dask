"use client"

import { useCallback, useEffect, useState } from "react"
import { UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { secoes, type Imagem } from "@/lib/conteudo/esquema"
import { clienteNavegador } from "@/lib/supabase/navegador"
import { supabaseUrl } from "@/lib/supabase/config"

const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]
const MAXIMO = 8 * 1024 * 1024

// Fotos que já fazem parte do site (todas as usadas como padrão).
const doSite: Imagem[] = (() => {
  const vistas = new Map<string, Imagem>()
  for (const s of secoes)
    for (const c of s.campos) {
      if (c.tipo === "imagem") vistas.set(c.padrao.src, c.padrao)
      if (c.tipo === "imagens") for (const i of c.padrao) vistas.set(i.src, i)
    }
  return [...vistas.values()]
})()

export const urlPublica = (nome: string) => `${supabaseUrl}/storage/v1/object/public/midia/${nome}`

/** Envia um arquivo ao bucket "midia" com nome aleatório; devolve a URL pública. */
export async function enviarImagem(arquivo: File): Promise<string | null> {
  if (!TIPOS.includes(arquivo.type)) {
    toast.error("Use JPG, PNG, WebP, AVIF ou GIF.")
    return null
  }
  if (arquivo.size > MAXIMO) {
    toast.error("A imagem passa de 8 MB. Reduza antes de enviar.")
    return null
  }
  const ext = arquivo.type.split("/")[1].replace("jpeg", "jpg")
  const nome = `${crypto.randomUUID()}.${ext}`
  const { error } = await clienteNavegador().storage.from("midia").upload(nome, arquivo, {
    contentType: arquivo.type,
    cacheControl: "31536000",
    upsert: false,
  })
  if (error) {
    toast.error("Não foi possível enviar a imagem.")
    return null
  }
  return urlPublica(nome)
}

export function useBiblioteca(aberta: boolean) {
  const [enviadas, setEnviadas] = useState<{ nome: string; url: string; criado: string }[]>([])
  const carregar = useCallback(async () => {
    const { data } = await clienteNavegador()
      .storage.from("midia")
      .list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } })
    setEnviadas(
      (data ?? [])
        .filter((f) => f.id && !f.name.startsWith("."))
        .map((f) => ({ nome: f.name, url: urlPublica(f.name), criado: f.created_at ?? "" }))
    )
  }, [])
  useEffect(() => {
    if (!aberta) return
    let ativo = true
    clienteNavegador()
      .storage.from("midia")
      .list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (!ativo) return
        setEnviadas(
          (data ?? [])
            .filter((f) => f.id && !f.name.startsWith("."))
            .map((f) => ({ nome: f.name, url: urlPublica(f.name), criado: f.created_at ?? "" }))
        )
      })
    return () => {
      ativo = false
    }
  }, [aberta])
  return { enviadas, carregar }
}

export function SeletorImagem({
  aberto,
  aoFechar,
  aoEscolher,
}: {
  aberto: boolean
  aoFechar: () => void
  aoEscolher: (src: string) => void
}) {
  const { enviadas, carregar } = useBiblioteca(aberto)
  const [enviando, setEnviando] = useState(false)

  const escolher = (src: string) => {
    aoEscolher(src)
    aoFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={(v) => !v && aoFechar()}>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-3xl" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Escolher imagem</DialogTitle>
          <DialogDescription>Envie uma foto nova ou use uma que já está no site.</DialogDescription>
        </DialogHeader>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius)] border-2 border-dashed p-6 text-center hover:bg-tint">
          <UploadIcon aria-hidden className="size-6" />
          <span className="font-semibold">{enviando ? "Enviando…" : "Enviar foto do computador"}</span>
          <span className="text-sm text-muted-foreground">JPG, PNG, WebP, AVIF ou GIF, até 8 MB</span>
          <input
            type="file"
            accept={TIPOS.join(",")}
            className="sr-only"
            disabled={enviando}
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ""
              if (!f) return
              setEnviando(true)
              const url = await enviarImagem(f)
              setEnviando(false)
              if (url) {
                await carregar()
                escolher(url)
              }
            }}
          />
        </label>

        {enviadas.length > 0 && (
          <Grade titulo="Enviadas pela equipe" itens={enviadas.map((e) => ({ src: e.url, alt: e.nome }))} aoEscolher={escolher} />
        )}
        <Grade titulo="Fotos do site" itens={doSite} aoEscolher={escolher} />

        <div className="flex justify-end">
          <Button variant="outline" onClick={aoFechar}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Grade({ titulo, itens, aoEscolher }: { titulo: string; itens: Imagem[]; aoEscolher: (src: string) => void }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-semibold">{titulo}</h3>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {itens.map((i) => (
          <li key={i.src}>
            <button
              type="button"
              onClick={() => aoEscolher(i.src)}
              className="block aspect-square w-full overflow-hidden rounded-md outline-offset-2 hover:outline-3 hover:outline-sky"
              title={i.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.src} alt={i.alt} loading="lazy" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
