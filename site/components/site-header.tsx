"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon, MenuIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { contato, mensagemVisita, navegacao, whatsappLink } from "@/lib/site"

const acessos = [
  { label: "Diário do Aluno", href: contato.diarioDoAluno, externo: true },
  { label: "Prof. Web", href: contato.profWeb, externo: true },
  { label: "Central do aluno", href: "/central-do-aluno", externo: false },
]

// tom "claro": texto branco e logo branco, para usar sobre foto ou vídeo
export function SiteHeader({ tom = "escuro" }: { tom?: "escuro" | "claro" }) {
  const claro = tom === "claro"
  return (
    <header className={cn("flex items-center justify-between gap-6", claro && "text-white")}>
      <Link href="/" aria-label="Colégio Dask, página inicial" className="shrink-0">
        <Image
          src={claro ? "/logo-dask-branco.png" : "/logo-dask.png"}
          alt="Colégio Dask"
          width={claro ? 360 : 466}
          height={claro ? 100 : 135}
          priority
          className="h-9 w-auto sm:h-11"
        />
      </Link>

      <nav aria-label="Principal" className="hidden items-center gap-6 font-semibold whitespace-nowrap xl:flex 2xl:gap-7">
        {navegacao.map((item) => (
          <Link key={item.href} href={item.href} className="decoration-2 underline-offset-[0.25em] hover:underline">
            {item.label}
          </Link>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-sm font-semibold">
            Área do aluno
            <ChevronDownIcon aria-hidden className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuGroup>
              {acessos.map((a) => (
                <DropdownMenuItem key={a.label} asChild>
                  <a
                    href={a.href}
                    {...(a.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {a.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <a
          href={whatsappLink(mensagemVisita)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-action"
        >
          Agendar visita
        </a>
      </nav>

      <Sheet>
        <SheetTrigger className="inline-flex items-center gap-2 rounded-full px-1 py-2 font-semibold xl:hidden">
          <MenuIcon aria-hidden className="size-5" />
          Menu
        </SheetTrigger>
        <SheetContent side="right" className="w-[86vw] max-w-sm gap-0 bg-background p-6">
          <SheetHeader className="p-0">
            <SheetTitle className="text-2xl font-extrabold tracking-tight">Colégio Dask</SheetTitle>
            <SheetDescription>Dracena-SP · desde 1996</SheetDescription>
          </SheetHeader>
          <nav aria-label="Menu" className="mt-8 flex flex-col gap-4 text-2xl font-extrabold tracking-tight">
            {navegacao.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-10 flex flex-col gap-3 font-semibold">
            {acessos.map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="link"
                {...(a.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {a.label}
              </a>
            ))}
          </div>
          <a
            href={whatsappLink(mensagemVisita)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action mt-auto self-start"
          >
            Agendar visita pelo WhatsApp
          </a>
        </SheetContent>
      </Sheet>
    </header>
  )
}
