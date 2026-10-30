"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { entrar, type EstadoLogin } from "@/app/admin/login/acoes"

export function FormularioLogin({ aviso }: { aviso?: string }) {
  const [estado, acao, pendente] = useActionState<EstadoLogin, FormData>(entrar, {})
  const erro = estado.erro ?? aviso

  return (
    <form action={acao} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="username" required className="h-12 text-base" />
        </Field>
        <Field>
          <FieldLabel htmlFor="senha">Senha</FieldLabel>
          <Input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            className="h-12 text-base"
          />
        </Field>
      </FieldGroup>
      <p role="alert" className="min-h-6 text-sm font-semibold text-destructive">
        {erro}
      </p>
      <Button type="submit" size="lg" disabled={pendente} className="h-12 text-base">
        {pendente ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  )
}
