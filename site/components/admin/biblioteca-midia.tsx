"use client"

import { useState } from "react"
import { CopyIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { apagarMidia } from "@/app/admin/acoes"
import { enviarImagem, useBiblioteca } from "@/components/admin/seletor-imagem"

export function BibliotecaMidia() {
  const { enviadas, carregar } = useBiblioteca(true)
  const [enviando, setEnviando] = useState(false)

  return (
    <div className="mt-6 flex flex-col gap-6">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius)] border-2 border-dashed p-8 text-center hover:bg-tint">
        <UploadIcon aria-hidden className="size-6" />
        <span className="font-semibold">{enviando ? "Enviando…" : "Enviar fotos"}</span>
        <span className="text-sm text-muted-foreground">JPG, PNG, WebP, AVIF ou GIF, até 8 MB cada</span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          disabled={enviando}
          onChange={async (e) => {
            const arquivos = [...(e.target.files ?? [])]
            e.target.value = ""
            if (!arquivos.length) return
            setEnviando(true)
            let ok = 0
            for (const a of arquivos) if (await enviarImagem(a)) ok++
            setEnviando(false)
            if (ok) toast.success(ok === 1 ? "Foto enviada." : `${ok} fotos enviadas.`)
            await carregar()
          }}
        />
      </label>

      {enviadas.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma foto enviada ainda.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {enviadas.map((m) => (
            <li key={m.nome} className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" loading="lazy" className="aspect-square w-full rounded-md object-cover" />
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-semibold hover:underline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(m.url)
                      toast.success("Endereço copiado.")
                    } catch {
                      toast.error("Não foi possível copiar.")
                    }
                  }}
                >
                  <CopyIcon aria-hidden className="size-4" />
                  Copiar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    if (!window.confirm("Apagar esta foto? Se ela estiver em uso no site, vai sumir de lá.")) return
                    const r = await apagarMidia(m.nome)
                    if (r.ok) {
                      toast.success("Foto apagada.")
                      await carregar()
                    } else toast.error(r.erro)
                  }}
                >
                  <Trash2Icon aria-hidden className="size-4" />
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
