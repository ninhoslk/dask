import Image from "next/image"

import { FaixaPausavel } from "@/components/sections/faixa-pausavel"
import { conteudoPadrao, imgs } from "@/lib/conteudo/documento"
import type { Imagem } from "@/lib/conteudo/esquema"

// A strip of real school photos that drifts sideways (CSS). It stops under
// reduced motion and pauses on hover, on keyboard focus or with a tap.
const padrao = imgs(conteudoPadrao("apresentacao"), "faixa")

export function FaixaFotos({ reverso = false, fotos = padrao }: { reverso?: boolean; fotos?: Imagem[] }) {
  const lista = reverso ? [...fotos].reverse() : fotos
  return (
    <FaixaPausavel>
      <ul className="faixa-trilho" data-reverso={reverso || undefined}>
        {[...lista, ...lista].map((f, i) => (
          <li key={`${f.src}-${i}`} aria-hidden={i >= lista.length || undefined}>
            <Image src={f.src} alt={i >= lista.length ? "" : f.alt} width={480} height={360} sizes="(max-width: 640px) 60vw, 26vw" />
          </li>
        ))}
      </ul>
    </FaixaPausavel>
  )
}
