import Link from "next/link"

import type { LinkMenu } from "@/lib/conteudo/dados"

// Um link vindo do painel: página do site vai pelo Link do Next; endereço de
// fora (ou marcado "nova aba") abre em outra aba. Repassa props e ref para
// funcionar dentro de `asChild` (menus do Radix).
export function LinkDoSite({
  item,
  children,
  ...resto
}: { item: Pick<LinkMenu, "link" | "rotulo" | "novaAba">; children?: React.ReactNode } & Omit<
  React.ComponentProps<"a">,
  "href" | "children"
>) {
  const fora = /^(https?:|mailto:|tel:)/i.test(item.link)
  const aba = item.novaAba ? { target: "_blank", rel: "noopener noreferrer" } : {}
  if (fora) {
    return (
      <a href={item.link} {...aba} {...resto}>
        {children ?? item.rotulo}
      </a>
    )
  }
  return (
    <Link href={item.link} {...aba} {...resto}>
      {children ?? item.rotulo}
    </Link>
  )
}
