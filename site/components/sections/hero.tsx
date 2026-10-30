import { FaixaFotos } from "@/components/sections/faixa-fotos"
import { mensagemVisita, whatsappLink } from "@/lib/site"

const destaques = [
  { valor: "1996", texto: "fundado por professores" },
  { valor: "+700", texto: "alunos do 1º ano ao 3º médio" },
  { valor: "SAS", texto: "sistema de ensino em todas as séries" },
]

// Faixa logo depois da abertura cinematográfica: quem é o Dask em uma frase,
// os números reais e as fotos do dia a dia.
export function Apresentacao() {
  return (
    <section className="bg-tint" aria-labelledby="apresentacao-title">
      <div className="frame grid12 items-end gap-y-8" style={{ paddingTop: "clamp(56px, 7vw, 104px)" }}>
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
          <h2 id="apresentacao-title" className="head">
            Do 1º ano ao vestibular, em Dracena.
          </h2>
          <p className="lead max-w-[38ch]">
            Fundamental I, Fundamental II e Ensino Médio, com o sistema de
            ensino SAS e a plataforma de leitura Árvore.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={whatsappLink(mensagemVisita)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action text-lg"
            >
              Agende uma visita
            </a>
            <a href="#ensino" className="link font-semibold">
              Ver séries e turnos
            </a>
          </div>
        </div>
        <dl className="col-span-12 grid grid-cols-3 gap-3 lg:col-span-6 lg:gap-4">
          {destaques.map((d) => (
            <div key={d.valor} className="rounded-[var(--radius)] bg-background/70 p-4 md:p-5">
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
        <FaixaFotos />
      </div>
    </section>
  )
}
