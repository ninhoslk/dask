"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon, MenuIcon } from "lucide-react"

import { useConfig } from "@/components/config-site"
import { LinkDoSite } from "@/components/link-do-site"
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
import { contatoDe, menuDe } from "@/lib/conteudo/dados"
import { img, txt } from "@/lib/conteudo/documento"
import { cn } from "@/lib/utils"

// a página em que a pessoa está, para o menu responder "onde estou?"
function atual(pathname: string | null, href: string) {
  if (!pathname || href.includes("#") || !href.startsWith("/")) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

// tom "claro": texto branco e logo branco, para usar sobre foto ou vídeo.
// Abas, acessos, botão e logos vêm de Informações do site → Menu e Identidade.
export function SiteHeader({ tom = "escuro" }: { tom?: "escuro" | "claro" }) {
  const claro = tom === "claro"
  const pathname = usePathname()
  const cfg = useConfig()
  const menu = menuDe(cfg)
  const { whatsappVisita, nome } = contatoDe(cfg)
  const logo = img(cfg.identidade, claro ? "logoBranco" : "logo")
  return (
    <header className={cn("flex items-center justify-between gap-6", claro && "text-white")}>
      <Link href="/" aria-label={`${nome}, página inicial`} className="alvo-toque shrink-0">
        <Image
          src={logo.src}
          alt={logo.alt || nome}
          width={claro ? 360 : 466}
          height={claro ? 100 : 135}
          priority
          className="h-9 w-auto sm:h-11"
        />
      </Link>

      <nav aria-label="Principal" className="hidden items-center gap-5 font-semibold whitespace-nowrap xl:flex min-[1440px]:gap-7">
        {menu.itens.map((item) => (
          <LinkDoSite
            key={item.id}
            item={item}
            aria-current={atual(pathname, item.link) ? "page" : undefined}
            className="nav-item alvo-toque decoration-2 underline-offset-[0.25em] hover:underline aria-[current=page]:underline"
          />
        ))}
        {menu.area.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-sm font-semibold">
              {menu.areaTitulo}
              <ChevronDownIcon aria-hidden className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <DropdownMenuGroup>
                {menu.area.map((a) => (
                  <DropdownMenuItem key={a.id} asChild>
                    <LinkDoSite item={a} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {menu.botao && whatsappVisita && (
          <a href={whatsappVisita} target="_blank" rel="noopener noreferrer" className="btn-action">
            {menu.botao}
          </a>
        )}
      </nav>

      <Sheet>
        <SheetTrigger className="inline-flex items-center gap-2 rounded-full px-1 py-2 font-semibold xl:hidden">
          <MenuIcon aria-hidden className="size-5" />
          Menu
        </SheetTrigger>
        <SheetContent side="right" className="w-[86vw] max-w-sm gap-0 bg-background p-6">
          <SheetHeader className="p-0">
            <SheetTitle className="text-2xl font-extrabold tracking-tight">{nome}</SheetTitle>
            <SheetDescription>{txt(cfg.identidade, "subtitulo")}</SheetDescription>
          </SheetHeader>
          <nav aria-label="Menu" className="mt-8 flex flex-col gap-4 text-2xl font-extrabold tracking-tight">
            {menu.itens.map((item) => (
              <SheetClose asChild key={item.id}>
                <LinkDoSite
                  item={item}
                  aria-current={atual(pathname, item.link) ? "page" : undefined}
                  className="nav-item decoration-2 underline-offset-[0.2em] aria-[current=page]:underline"
                />
              </SheetClose>
            ))}
          </nav>
          <div className="mt-10 flex flex-col gap-3 font-semibold">
            {menu.area.map((a) => (
              <LinkDoSite key={a.id} item={a} className="link" />
            ))}
          </div>
          {menu.botaoCelular && whatsappVisita && (
            <a href={whatsappVisita} target="_blank" rel="noopener noreferrer" className="btn-action mt-auto self-start">
              {menu.botaoCelular}
            </a>
          )}
        </SheetContent>
      </Sheet>
    </header>
  )
}
