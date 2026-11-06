"use client"

import { createContext, useContext } from "react"

import { configDocPadrao, resolverConfig, type Config } from "@/lib/conteudo/documento"

// As informações do site (contatos, menu, segmentos...) chegam do servidor uma
// vez, no layout, e cada componente lê daqui. Na prévia do painel, o mesmo
// provedor recebe o rascunho, e o site inteiro mostra o que está sendo editado.
const Contexto = createContext<Config | null>(null)
let padrao: Config | null = null

export function ConfigSite({ config, children }: { config: Config; children: React.ReactNode }) {
  return <Contexto.Provider value={config}>{children}</Contexto.Provider>
}

export function useConfig(): Config {
  const c = useContext(Contexto)
  if (c) return c
  padrao ??= resolverConfig(configDocPadrao())
  return padrao
}
