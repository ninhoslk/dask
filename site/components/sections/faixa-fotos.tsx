import Image from "next/image"

// A strip of real school photos that drifts sideways. CSS only; it stops
// under reduced motion and pauses on hover.
const fotos = [
  { src: "/fotos/natal-coral.jpg", alt: "Coral de Natal do Fundamental I" },
  { src: "/fotos/robotica-equipe.jpg", alt: "Equipe de robótica com o troféu" },
  { src: "/fotos/teatro-mae-natureza.jpg", alt: "Peça Mãe Natureza da Escolinha de Teatro" },
  { src: "/fotos/ciencia-colecao.jpg", alt: "Alunos observando uma coleção de insetos" },
  { src: "/fotos/volei-quadra.jpg", alt: "Jogo de vôlei feminino na quadra do Dask" },
  { src: "/fotos/alunas-camiseta.jpg", alt: "Alunas deitadas sobre a camiseta do Dask" },
  { src: "/fotos/visita-unesp.jpg", alt: "Turma do Ensino Médio em visita à UNESP" },
  { src: "/fotos/formatura-abraco.jpg", alt: "Aluno recebendo flores na Aula da Saudade" },
  { src: "/fotos/acantonamento.jpg", alt: "Turma reunida no acantonamento" },
  { src: "/fotos/certificado.jpg", alt: "Aluna recebendo certificado de olimpíada" },
]

export function FaixaFotos({ reverso = false }: { reverso?: boolean }) {
  const lista = reverso ? [...fotos].reverse() : fotos
  return (
    <div className="faixa" aria-label="Fotos do dia a dia no Colégio Dask" role="region">
      <ul className="faixa-trilho" data-reverso={reverso || undefined}>
        {[...lista, ...lista].map((f, i) => (
          <li key={`${f.src}-${i}`} aria-hidden={i >= lista.length || undefined}>
            <Image src={f.src} alt={i >= lista.length ? "" : f.alt} width={480} height={360} sizes="(max-width: 640px) 60vw, 26vw" />
          </li>
        ))}
      </ul>
    </div>
  )
}
