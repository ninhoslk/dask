import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { contato, documentos, psicologa, segmentos } from "@/lib/site"

export const metadata: Metadata = {
  title: "Central do aluno · Colégio Dask",
  description:
    "Diário do Aluno, Prof. Web, listas de material, normas e contatos da coordenação do Colégio Dask.",
}

type Doc = { nome: string; url?: string }

const docsPorSegmento: Record<string, Doc[]> = {
  fund1: [
    ...documentos.listasFund1.map((l) => ({ nome: `Lista de material 2026 · ${l.serie}`, url: l.url })),
    { nome: "Normas disciplinares", url: documentos.normas },
    { nome: "Horários de aulas 2026 · manhã e tarde" },
    { nome: "Calendário 2026" },
  ],
  fund2: [
    { nome: "Normas disciplinares", url: documentos.normas },
    { nome: "Calendário 2026" },
    { nome: "Horários de aulas 2026 · manhã e tarde" },
    { nome: "Datas das provas por trimestre" },
    { nome: "Plantão de dúvidas" },
  ],
  medio: [
    { nome: "Normas disciplinares", url: documentos.normas },
    { nome: "Calendário 2026" },
    { nome: "Horários da 1ª, 2ª e 3ª série" },
    { nome: "Calendário de provas" },
  ],
}

function Acesso({ href, titulo, texto }: { href: string; titulo: string; texto: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-[var(--radius)] bg-card p-6 transition-colors hover:bg-accent"
    >
      <span className="flex items-center justify-between text-2xl font-extrabold tracking-[-0.04em]">
        {titulo}
        <ArrowUpRightIcon aria-hidden className="size-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
      <span className="text-muted-foreground">{texto}</span>
    </a>
  )
}

export default function CentralDoAluno() {
  return (
    <>
      <div className="frame pt-5">
        <SiteHeader />
      </div>
      <main id="conteudo" className="frame pb-32">
        <h1 className="head mt-20 md:mt-28">Central do aluno</h1>
        <p className="lead mt-6 max-w-[46ch] text-muted-foreground">
          Acessos do dia a dia, documentos de cada segmento e quem procurar na
          coordenação.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Acesso href={contato.diarioDoAluno} titulo="Diário do Aluno" texto="Notas, frequência e recados da escola." />
          <Acesso href={contato.profWeb} titulo="Prof. Web" texto="Acesso dos professores." />
          <Acesso href={contato.trabalheConosco} titulo="Trabalhe conosco" texto="Envie seu currículo para o Dask." />
        </div>

        <h2 className="mt-24 text-[clamp(28px,3vw,44px)] font-extrabold tracking-[-0.04em]">
          Documentos por segmento
        </h2>
        <Tabs defaultValue="fund1" className="mt-8">
          <TabsList className="h-auto flex-wrap">
            {segmentos.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="px-4 py-2 text-base">
                {s.nome}
              </TabsTrigger>
            ))}
          </TabsList>
          {segmentos.map((s) => (
            <TabsContent key={s.id} value={s.id} className="mt-8">
              <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,22rem)]">
                <ul className="flex flex-col [&>li:nth-child(odd)]:bg-card [&>li]:rounded-md [&>li]:px-4">
                  {docsPorSegmento[s.id].map((d) => (
                    <li key={d.nome} className="flex items-center justify-between gap-4 py-3">
                      {d.url ? (
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                          {d.nome}
                        </a>
                      ) : (
                        <span>{d.nome}</span>
                      )}
                      <span className="small shrink-0 text-muted-foreground">
                        {d.url ? "PDF" : "Em breve"}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 self-start rounded-[var(--radius)] bg-card p-6">
                  <p className="small text-muted-foreground">{s.coordenacao.cargo}</p>
                  <p className="text-xl font-extrabold tracking-[-0.03em]">{s.coordenacao.nome}</p>
                  <a
                    href={`https://wa.me/${s.coordenacao.numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link font-semibold"
                  >
                    {s.coordenacao.telefone}
                  </a>
                  <p className="small text-muted-foreground">
                    Ligação ou WhatsApp, {s.coordenacao.horario}
                  </p>
                  <p className="small mt-4 text-muted-foreground">
                    Psicóloga escolar: {psicologa.nome}. {psicologa.horario}. Agende pela secretaria,{" "}
                    <a href={contato.telefoneHref} className="link">
                      {contato.telefone}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-16">
          <Link href="/" className="link font-semibold">
            Voltar para a página inicial
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
