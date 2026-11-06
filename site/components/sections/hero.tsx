import { EncaixeApresentacao } from "@/components/encaixe-apresentacao"
import { FaixaFotos } from "@/components/sections/faixa-fotos"
import { itens, imgs, txt, type Conteudo } from "@/lib/conteudo/documento"
import { mensagemVisita, whatsappLink } from "@/lib/site"


// Faixa logo depois da abertura cinematográfica: quem é o Dask em uma frase,
// os números reais e as fotos do dia a dia.
export function Apresentacao({ c }: { c: Conteudo }) {
  const destaques = itens(c, "destaques").map((d) => ({ valor: d.titulo, texto: d.texto }))
  // no computador ocupa uma tela inteira: a frase no meio do espaço livre e a
  // faixa de fotos encostada embaixo, sem mostrar o começo da próxima seção
  return (
    <section id="apresentacao" className="bg-tint lg:flex lg:min-h-svh lg:flex-col" aria-labelledby="apresentacao-title">
      <EncaixeApresentacao alvo="apresentacao" />
      <div className="frame grid12 items-end gap-y-8 lg:flex-1 lg:content-center" style={{ paddingTop: "clamp(56px, 7vw, 104px)" }}>
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
          <h2 id="apresentacao-title" className="head titulo-apresentacao">
            {txt(c, "titulo")}
          </h2>
          <p className="lead max-w-[38ch]">{txt(c, "texto")}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={whatsappLink(mensagemVisita)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action text-lg"
            >
              {txt(c, "botao")}
            </a>
            <a href="#ensino" className="link font-semibold">
              Ver séries e turnos
            </a>
          </div>
        </div>
        <dl className="col-span-12 grid grid-cols-3 gap-3 lg:col-span-5 lg:gap-4">
          {destaques.map((d, i) => (
            <div key={i} className="rounded-[var(--radius)] bg-background/70 p-4 md:p-5">
              <dt className="sr-only">{d.texto}</dt>
              <dd className="flex flex-col gap-1">
                <span className="text-[clamp(28px,3.4vw,52px)] font-extrabold leading-none tracking-[-0.05em] text-sky">
                  {d.valor}
                </span>
                <span className="small leading-snug">{d.texto}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="pt-12 pb-10 md:pt-16 md:pb-14">
        <FaixaFotos fotos={imgs(c, "faixa")} />
      </div>
    </section>
  )
}
