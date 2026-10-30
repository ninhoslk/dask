import Image from "next/image"
import Link from "next/link"

import { contato } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer
      aria-label="Rodapé"
      className="frame flex min-h-[90svh] flex-col bg-field pt-10 pb-8 text-field-foreground"
    >
      <div className="grid12 gap-y-6">
        <div className="col-span-12 flex flex-col gap-5 text-[15px] sm:flex-row sm:gap-10 md:col-span-9">
          <Image
            src="/logo-dask-branco.png"
            alt="Colégio Dask"
            width={360}
            height={100}
            className="h-8 w-auto self-start"
          />
          <p className="max-w-[30ch]">
            {contato.endereco}
            <br />
            {contato.cidade} · CEP {contato.cep}
          </p>
          <p className="max-w-[34ch]">
            {contato.razao}. Mantenedora: {contato.mantenedora}, CNPJ{" "}
            {contato.cnpj}.
          </p>
        </div>
        <a href="#conteudo" className="link col-span-12 text-[15px] md:col-span-3 md:justify-self-end">
          Voltar ao topo
        </a>
      </div>

      <div className="mt-auto pt-24">
        <p className="small mb-2 opacity-80">Secretaria</p>
        <a
          href={contato.telefoneHref}
          className="display block text-[12vw] whitespace-nowrap text-brand hover:underline hover:decoration-4 hover:underline-offset-8 md:text-[9vw]"
        >
          {contato.telefone}
        </a>
      </div>

      <div className="mt-10 grid gap-3 text-[13px] md:grid-cols-3 md:text-sm">
        <nav aria-label="Redes e links" className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={contato.instagram} target="_blank" rel="noopener noreferrer" className="link">
            Instagram
          </a>
          <a href={contato.facebook} target="_blank" rel="noopener noreferrer" className="link">
            Facebook
          </a>
          <Link href="/noticias" className="link">
            Notícias
          </Link>
          <Link href="/central-do-aluno" className="link">
            Central do aluno
          </Link>
          <Link href="/tour-360" className="link">
            Tour 360°
          </Link>
          <a href={contato.trabalheConosco} target="_blank" rel="noopener noreferrer" className="link">
            Trabalhe conosco
          </a>
        </nav>
        <p className="md:text-center">Fotos: Colégio Dask e SAS Educação</p>
        <p className="md:text-right">Dracena-SP, {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
