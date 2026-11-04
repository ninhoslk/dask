import type { Metadata, Viewport } from "next"
import { Schibsted_Grotesk } from "next/font/google"

import "./globals.css"
import { BotoesFlutuantes } from "@/components/botoes-flutuantes"
import { Motion } from "@/components/motion"
import { RolagemSuave } from "@/components/rolagem-suave"
import { imagemCompartilhar, urlDoSite } from "@/lib/seo"

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-sans",
  display: "swap",
})

const descricao =
  "Escola feita de professores para alunos desde 1996. Ensino Fundamental I, Fundamental II e Ensino Médio em Dracena-SP, com o sistema de ensino SAS."

// metadataBase vem de NEXT_PUBLIC_SITE_URL (ver lib/seo.tsx): trocar o domínio
// é só trocar a variável.
export const metadata: Metadata = {
  metadataBase: urlDoSite,
  title: "Colégio Dask · Dracena-SP · Fundamental I ao Ensino Médio",
  description: descricao,
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Colégio Dask",
    title: "Colégio Dask · Dracena-SP",
    description: descricao,
    images: [imagemCompartilhar],
  },
  twitter: { card: "summary_large_image", images: [imagemCompartilhar.url] },
}

export const viewport: Viewport = {
  themeColor: "#f4f8f8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={schibsted.variable}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Pular para o conteúdo
        </a>
        {children}
        <BotoesFlutuantes />
        <Motion />
        <RolagemSuave />
      </body>
    </html>
  )
}
