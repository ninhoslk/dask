"use client"

import Image from "next/image"

import { useConfig } from "@/components/config-site"
import { LinkDoSite } from "@/components/link-do-site"
import { contatoDe, linksRodapeDe, redesDe } from "@/lib/conteudo/dados"
import { img, txt } from "@/lib/conteudo/documento"

// Endereço, dados legais e telefone vêm de Identidade e Contatos; as redes,
// de Redes sociais; os links e créditos, de Rodapé (Informações do site).
export function SiteFooter() {
  const cfg = useConfig()
  const c = contatoDe(cfg)
  const logo = img(cfg.identidade, "logoBranco")
  const r = cfg.rodape
  return (
    <footer
      aria-label="Rodapé"
      className="frame flex flex-col bg-field pt-10 pb-8 text-field-foreground"
    >
      <div className="grid12 gap-y-6">
        <div className="col-span-12 flex flex-col gap-5 text-[15px] sm:flex-row sm:gap-10 md:col-span-9">
          <Image
            src={logo.src}
            alt={logo.alt || c.nome}
            width={360}
            height={100}
            className="h-8 w-auto self-start"
          />
          <p className="max-w-[30ch]">
            {c.endereco}
            <br />
            {c.cidade}
            {c.cep && ` · CEP ${c.cep}`}
          </p>
          {(c.razao || c.mantenedora || c.cnpj) && (
            <p className="max-w-[34ch]">
              {[c.razao, c.mantenedora && `Mantenedora: ${c.mantenedora}`, c.cnpj && `CNPJ ${c.cnpj}`]
                .filter(Boolean)
                .join(". ")}
              .
            </p>
          )}
        </div>
        <a href="#conteudo" className="link col-span-12 text-[15px] md:col-span-3 md:justify-self-end">
          {txt(r, "topo")}
        </a>
      </div>

      {c.telefone && (
        <div className="mt-auto pt-24">
          <p className="small mb-2 opacity-80">{txt(r, "rotuloTelefone")}</p>
          <a
            href={c.telefoneHref}
            className="display block text-[12vw] whitespace-nowrap text-brand hover:underline hover:decoration-4 hover:underline-offset-8 md:text-[9vw]"
          >
            {c.telefone}
          </a>
        </div>
      )}

      <div className="mt-10 grid gap-3 text-[13px] md:grid-cols-3 md:text-sm">
        <nav aria-label="Redes e links" className="flex flex-wrap gap-x-5 gap-y-2">
          {redesDe(cfg).map((rede) => (
            <a key={rede.id} href={rede.link} target="_blank" rel="noopener noreferrer" className="link">
              {rede.nome}
            </a>
          ))}
          {linksRodapeDe(cfg).map((l) => (
            <LinkDoSite key={l.id} item={l} className="link" />
          ))}
        </nav>
        <p className="md:text-center">{txt(r, "creditos")}</p>
        <p className="md:text-right">
          {c.cidade}, {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
