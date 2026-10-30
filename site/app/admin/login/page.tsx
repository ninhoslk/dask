import type { Metadata } from "next"
import Image from "next/image"

import { FormularioLogin } from "@/app/admin/login/formulario"

export const metadata: Metadata = {
  title: "Entrar · Painel do Colégio Dask",
  robots: { index: false, follow: false },
}

const avisos: Record<string, string> = {
  acesso: "Esta conta não tem acesso ao painel.",
  config: "O painel ainda não está ligado ao banco.",
}

export default async function Login({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams
  return (
    <main className="grid min-h-svh place-items-center bg-tint px-4 py-10">
      <div className="w-full max-w-sm rounded-[var(--radius)] bg-background p-8">
        <Image src="/logo-dask.png" alt="Colégio Dask" width={466} height={135} className="h-10 w-auto" priority />
        <h1 className="mt-8 text-2xl font-extrabold tracking-[-0.03em]">Painel do site</h1>
        <p className="mt-1 mb-8 text-muted-foreground">Entre com a conta da equipe.</p>
        <FormularioLogin aviso={erro ? avisos[erro] : undefined} />
      </div>
    </main>
  )
}
