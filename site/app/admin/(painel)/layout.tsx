import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { NavPainel } from "@/components/admin/nav-painel"
import { Toaster } from "@/components/ui/sonner"
import { sair } from "@/app/admin/login/acoes"
import { exigirAdmin } from "@/lib/admin/sessao"

export const metadata: Metadata = {
  title: "Painel · Colégio Dask",
  robots: { index: false, follow: false },
}

export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const { nome, user } = await exigirAdmin()

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-6 border-b px-4">
        <Link href="/admin" className="shrink-0" aria-label="Painel, editor visual">
          <Image src="/logo-dask.png" alt="Colégio Dask" width={466} height={135} className="h-7 w-auto" />
        </Link>
        <NavPainel />
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="link hidden sm:inline">
            Ver site
          </Link>
          <span className="hidden text-muted-foreground md:inline">{nome || user.email}</span>
          <form action={sair}>
            <button type="submit" className="link font-semibold">
              Sair
            </button>
          </form>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      <Toaster position="bottom-center" />
    </div>
  )
}
