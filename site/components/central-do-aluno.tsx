"use client"

import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { useConfig } from "@/components/config-site"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { contatoDe, externo, psicologiaDe, segmentosDe } from "@/lib/conteudo/dados"
import { campo, regs, txt } from "@/lib/conteudo/documento"

function Acesso({ href, titulo, texto }: { href: string; titulo: string; texto: string }) {
  const fora = externo(href)
  return (
    <a
      href={href}
      {...(fora ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col gap-2 rounded-[var(--radius)] bg-card p-6 transition-colors hover:bg-accent"
    >
      <span className="flex items-center justify-between text-2xl font-extrabold tracking-[-0.04em]">
        {titulo}
        <ArrowUpRightIcon aria-hidden className="size-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
      {texto && <span className="text-muted-foreground">{texto}</span>}
    </a>
  )
}

// Conteúdo da Central do aluno. Tudo vem de Informações do site: os cartões e
// textos de "Central do aluno", os documentos e a coordenação de "Segmentos e
// coordenação". Também é o que a prévia do painel mostra ao editar esses grupos.
export function CentralDoAluno() {
  const cfg = useConfig()
  const c = cfg.central
  const segmentos = segmentosDe(cfg)
  const psicologia = psicologiaDe(cfg)
  const contato = contatoDe(cfg)
  const acessos = regs(c, "acessos").filter((r) => campo(r, "titulo") && campo(r, "link"))

  return (
    <main id="conteudo" className="frame pb-32">
      <h1 className="head mt-20 md:mt-28">{txt(c, "titulo")}</h1>
      <p className="lead mt-6 max-w-[46ch] text-muted-foreground">{txt(c, "texto")}</p>

      {acessos.length > 0 && (
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {acessos.map((a) => (
            <Acesso key={a._id} href={campo(a, "link")} titulo={campo(a, "titulo")} texto={campo(a, "texto")} />
          ))}
        </div>
      )}

      {segmentos.length > 0 && (
        <>
          <h2 className="mt-24 text-[clamp(28px,3vw,44px)] font-extrabold tracking-[-0.04em]">
            {txt(c, "tituloDocumentos")}
          </h2>
          <Tabs defaultValue={segmentos[0].id} className="mt-8">
            <TabsList className="h-auto flex-wrap group-data-horizontal/tabs:h-auto">
              {segmentos.map((s) => (
                <TabsTrigger key={s.id} value={s.id} className="min-h-11 px-4 py-2 text-base">
                  {s.nome}
                </TabsTrigger>
              ))}
            </TabsList>
            {segmentos.map((s) => (
              <TabsContent key={s.id} value={s.id} className="mt-8">
                <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,22rem)]">
                  <ul className="flex flex-col [&>li:nth-child(odd)]:bg-card [&>li]:rounded-md [&>li]:px-4">
                    {s.documentos.map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                        {d.link ? (
                          <a href={d.link} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                            {d.nome}
                          </a>
                        ) : (
                          <span>{d.nome}</span>
                        )}
                        <span className="small shrink-0 text-muted-foreground">
                          {d.link ? txt(c, "rotuloArquivo") : txt(c, "rotuloEmBreve")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2 self-start rounded-[var(--radius)] bg-card p-6">
                    {s.cargo && <p className="small text-muted-foreground">{s.cargo}</p>}
                    {s.coordenador && <p className="text-xl font-extrabold tracking-[-0.03em]">{s.coordenador}</p>}
                    {s.whatsapp && (
                      <a href={s.whatsapp} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                        {s.telefone}
                      </a>
                    )}
                    {s.horario && (
                      <p className="small text-muted-foreground">
                        {txt(c, "atendimento")} {s.horario}
                      </p>
                    )}
                    {psicologia.nome && (
                      <p className="small mt-4 text-muted-foreground">
                        {psicologia.titulo}: {psicologia.nome}. {psicologia.horario}. {txt(c, "psicoTexto")}{" "}
                        {contato.telefone && (
                          <a href={contato.telefoneHref} className="link">
                            {contato.telefone}
                          </a>
                        )}
                        .
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      <p className="mt-16">
        <Link href="/" className="link font-semibold">
          {txt(c, "voltar")}
        </Link>
      </p>
    </main>
  )
}
