"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Linha = { id: string; slug: string; titulo: string; data: string; categoria: string; publicado: boolean }

const data = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" })
const semAcento = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export function TabelaNoticias({ noticias }: { noticias: Linha[] }) {
  const [busca, setBusca] = useState("")
  const lista = useMemo(() => {
    const t = semAcento(busca.trim())
    return t ? noticias.filter((n) => semAcento(n.titulo).includes(t)) : noticias
  }, [noticias, busca])

  return (
    <div className="mt-6 flex flex-col gap-4">
      <Input
        type="search"
        placeholder="Buscar pelo título…"
        aria-label="Buscar notícia"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="max-w-sm"
      />
      <ul className="flex flex-col divide-y rounded-md ring-1 ring-border">
        {lista.slice(0, 300).map((n) => (
          <li key={n.id}>
            <Link href={`/admin/noticias/${n.id}`} className="flex items-center gap-4 p-3 hover:bg-tint">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{n.titulo}</span>
                <span className="text-sm text-muted-foreground">
                  {data.format(new Date(n.data))} · {n.categoria}
                </span>
              </span>
              {!n.publicado && <Badge variant="secondary">Rascunho</Badge>}
            </Link>
          </li>
        ))}
        {lista.length === 0 && <li className="p-6 text-center text-muted-foreground">Nenhuma notícia encontrada.</li>}
      </ul>
    </div>
  )
}
