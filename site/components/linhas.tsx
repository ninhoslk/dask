import { Fragment } from "react"

// Texto editado no painel: cada Enter vira uma quebra de linha.
export function Linhas({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("\n").map((linha, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {linha}
        </Fragment>
      ))}
    </>
  )
}
