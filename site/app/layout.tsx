import type { Metadata, Viewport } from "next"
import { Schibsted_Grotesk } from "next/font/google"

import "./globals.css"
import { BotoesFlutuantes } from "@/components/botoes-flutuantes"
import { CabecalhoFixo } from "@/components/cabecalho-fixo"
import { ConfigSite } from "@/components/config-site"
import { Motion } from "@/components/motion"
import { RolagemSuave } from "@/components/rolagem-suave"
import { temaCss } from "@/lib/conteudo/dados"
import { txt } from "@/lib/conteudo/documento"
import { configPublicada } from "@/lib/conteudo/obter"

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-sans",
  display: "swap",
})

// Título, descrição e cores vêm de Informações do site (painel).
export async function generateMetadata(): Promise<Metadata> {
  const cfg = await configPublicada()
  return {
    title: txt(cfg.paginas, "seoTitulo"),
    description: txt(cfg.paginas, "seoDescricao"),
    icons: { icon: "/favicon.png" },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const cfg = await configPublicada()
  return { themeColor: txt(cfg.tema, "background") || "#f4f8f8" }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cfg = await configPublicada()
  return (
    <html lang="pt-BR" className={schibsted.variable}>
      <head>
        <style id="tema">{temaCss(cfg)}</style>
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Pular para o conteúdo
        </a>
        <ConfigSite config={cfg}>
          <CabecalhoFixo />
          {children}
          <BotoesFlutuantes />
        </ConfigSite>
        <Motion />
        <RolagemSuave />
      </body>
    </html>
  )
}
