import type { Metadata, Viewport } from "next"
import { Schibsted_Grotesk } from "next/font/google"

import "./globals.css"
import { Motion } from "@/components/motion"

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Colégio Dask · Dracena-SP · Fundamental I ao Ensino Médio",
  description:
    "Escola feita de professores para alunos desde 1996. Ensino Fundamental I, Fundamental II e Ensino Médio em Dracena-SP, com o sistema de ensino SAS.",
  icons: { icon: "/favicon.png" },
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
        <Motion />
      </body>
    </html>
  )
}
