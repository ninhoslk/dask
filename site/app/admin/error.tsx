"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

// Erro inesperado no painel ou na prévia. O caso mais comum é o banco não
// responder ao abrir o editor: em vez de abrir com o conteúdo padrão (que
// seria publicado por cima do site), o repositório falha e cai aqui.
export default function ErroPainel({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="frame flex min-h-svh flex-col items-start justify-center gap-6 py-16">
      <h1 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-tight tracking-[-0.04em]">
        Não foi possível abrir o painel
      </h1>
      <p className="max-w-[52ch] text-muted-foreground">
        O banco de dados não respondeu. Nada foi alterado no site. Tente de novo em instantes; se continuar, avise quem
        cuida do site.
      </p>
      <Button type="button" onClick={() => retry()} className="h-11 px-5 text-base">
        Tentar de novo
      </Button>
    </main>
  )
}
