"use client"

import { useDeferredValue, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { formatoData, type NoticiaCartao } from "@/lib/noticias-tipos"
import { cn } from "@/lib/utils"

const categorias = ["Todas", "Ensino", "Eventos", "Geral"] as const
const POR_VEZ = 12

const semAcento = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

// Todas as notícias, com filtro por assunto, ano e busca, 12 por vez.
export function ListaNoticias({ noticias }: { noticias: NoticiaCartao[] }) {
  const [categoria, setCategoria] = useState<(typeof categorias)[number]>("Todas")
  const [ano, setAno] = useState<string>("Todos")
  const [busca, setBusca] = useState("")
  const [mostrar, setMostrar] = useState(POR_VEZ)
  const termo = useDeferredValue(busca)

  const anos = useMemo(
    () => ["Todos", ...new Set(noticias.map((n) => String(new Date(n.data).getFullYear())))],
    [noticias]
  )

  const filtradas = useMemo(() => {
    const t = semAcento(termo.trim())
    return noticias.filter(
      (n) =>
        (categoria === "Todas" || n.categoria === categoria) &&
        (ano === "Todos" || String(new Date(n.data).getFullYear()) === ano) &&
        (!t || semAcento(`${n.titulo} ${n.resumo}`).includes(t))
    )
  }, [noticias, categoria, ano, termo])

  const filtrar = (f: () => void) => {
    f()
    setMostrar(POR_VEZ)
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Assunto">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={categoria === c}
              onClick={() => filtrar(() => setCategoria(c))}
              className={cn("filtro", categoria === c && "filtro-ativo")}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="ano">
            Ano
          </label>
          <select
            id="ano"
            value={ano}
            onChange={(e) => filtrar(() => setAno(e.target.value))}
            className="h-11 rounded-full border border-input bg-background px-4 font-semibold"
          >
            {anos.map((a) => (
              <option key={a} value={a}>
                {a === "Todos" ? "Todos os anos" : a}
              </option>
            ))}
          </select>
          <div className="relative">
            <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={busca}
              onChange={(e) => filtrar(() => setBusca(e.target.value))}
              placeholder="Buscar notícia…"
              aria-label="Buscar notícia"
              className="h-11 w-64 rounded-full pl-10 text-base"
            />
          </div>
        </div>
      </div>

      <p className="small mt-6 text-muted-foreground" aria-live="polite">
        {filtradas.length === 1 ? "1 notícia" : `${filtradas.length} notícias`}
      </p>

      <ul className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {filtradas.slice(0, mostrar).map((n) => (
          <li key={n.slug}>
            <Link href={`/noticias/${n.slug}`} className="group block">
              <div className="media aspect-[4/3]">
                {n.miniatura && (
                  <Image
                    src={n.miniatura}
                    alt=""
                    width={768}
                    height={576}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    unoptimized={n.miniatura.startsWith("http")}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <p className="small mt-4 font-semibold text-sky">{n.categoria}</p>
              <h2 className="mt-1 text-xl font-extrabold leading-[1.1] tracking-[-0.03em] text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {n.titulo}
              </h2>
              <p className="small mt-2 text-muted-foreground">
                <time dateTime={n.data}>{formatoData.format(new Date(n.data))}</time>
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {mostrar < filtradas.length && (
        <div className="mt-14 flex justify-center">
          <button type="button" className="btn-action" onClick={() => setMostrar((m) => m + POR_VEZ)}>
            Mostrar mais notícias
          </button>
        </div>
      )}
    </div>
  )
}
