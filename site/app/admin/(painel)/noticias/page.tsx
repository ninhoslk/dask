import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { AtualizarAoMudar } from "@/components/admin/atualizar-ao-mudar"
import { TabelaNoticias } from "@/components/admin/tabela-noticias"
import { Button } from "@/components/ui/button"
import { exigirAdmin } from "@/lib/admin/sessao"

export default async function AdminNoticias() {
  const { sb } = await exigirAdmin()
  const { data } = await sb
    .from("noticias")
    .select("id,slug,titulo,data,categoria,publicado")
    .order("data", { ascending: false })
    .limit(2000)

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em]">Notícias</h1>
            <p className="text-muted-foreground">{data?.length ?? 0} notícias. As publicadas aparecem na home e em /noticias.</p>
          </div>
          <Button asChild>
            <Link href="/admin/noticias/nova">
              <PlusIcon data-icon="inline-start" />
              Nova notícia
            </Link>
          </Button>
        </div>
        <TabelaNoticias noticias={data ?? []} />
        <AtualizarAoMudar tabelas={["noticias"]} />
      </div>
    </div>
  )
}
