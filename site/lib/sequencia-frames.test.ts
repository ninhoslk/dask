import { describe, expect, it } from "vitest"

import { criarSequencia, type ImagemCarregavel } from "@/lib/sequencia-frames"

// Imagem falsa: só "carrega" quando o teste manda.
class ImagemFalsa implements ImagemCarregavel {
  src = ""
  decoding?: string
  onload: ((ev: never) => unknown) | null = null
  onerror: ((ev: never) => unknown) | null = null
  removeAttribute() {
    this.src = ""
  }
}

function montar(o: { quantidade?: number; raio?: number; folga?: number; paralelo?: number } = {}) {
  const criadas: ImagemFalsa[] = []
  const carregados: number[] = []
  const seq = criarSequencia({
    quantidade: o.quantidade ?? 100,
    url: (i) => `/q/${i}.webp`,
    raio: o.raio ?? 3,
    folga: o.folga ?? 1,
    paralelo: o.paralelo ?? 2,
    criarImagem: () => {
      const img = new ImagemFalsa()
      criadas.push(img)
      return img
    },
    aoCarregar: (i) => carregados.push(i),
  })
  const indice = (img: ImagemFalsa) => Number(/\/q\/(\d+)\.webp/.exec(img.src)?.[1])
  // carrega tudo o que está baixando, em rodadas, até não haver mais nada
  const carregarTudo = () => {
    let pendentes
    while ((pendentes = criadas.filter((c) => c.src && c.onload && !(c as { feito?: boolean }).feito)).length) {
      for (const c of pendentes) {
        ;(c as { feito?: boolean }).feito = true
        c.onload?.(undefined as never)
      }
    }
  }
  return { seq, criadas, carregados, indice, carregarTudo }
}

describe("criarSequencia", () => {
  it("baixa primeiro o alvo e depois os vizinhos, alternando os lados", () => {
    const { seq, criadas, indice, carregarTudo } = montar({ paralelo: 1 })
    seq.irPara(50)
    seq.carregar()
    carregarTudo()
    expect(criadas.map(indice)).toEqual([50, 51, 49, 52, 48, 53, 47])
  })

  it("nunca baixa mais que o limite ao mesmo tempo", () => {
    const { seq, criadas } = montar({ paralelo: 2 })
    seq.irPara(50)
    seq.carregar()
    expect(criadas).toHaveLength(2)
    expect(seq.contagem().baixando).toBe(2)
  })

  it("só guarda a janela em volta do alvo e solta o resto ao rolar", () => {
    const { seq, carregarTudo } = montar({ raio: 3, folga: 1 })
    seq.irPara(10)
    seq.carregar()
    carregarTudo()
    expect(seq.contagem().naMemoria).toBe(7) // 7..13
    seq.irPara(60)
    seq.carregar()
    carregarTudo()
    expect(seq.contagem().naMemoria).toBe(7) // os de 7..13 saíram, entraram 57..63
  })

  it("o quadro desenhado nunca é solto, mesmo longe do alvo", () => {
    const { seq, carregarTudo } = montar({ raio: 2, folga: 0 })
    seq.irPara(10)
    seq.carregar()
    carregarTudo()
    seq.desenhou(10)
    seq.irPara(80)
    seq.carregar()
    expect(seq.melhor()?.indice).toBe(10) // nada perto de 80 carregou ainda: o 10 segue de reserva
  })

  it("melhor() devolve o quadro carregado mais perto do alvo", () => {
    const { seq, carregarTudo } = montar({ raio: 1 })
    expect(seq.melhor()).toBeNull()
    seq.irPara(20)
    seq.carregar()
    carregarTudo()
    expect(seq.melhor()?.indice).toBe(20)
    seq.irPara(22) // 21 está carregado, 22 ainda não
    expect(seq.melhor()?.indice).toBe(21)
  })

  it("um quadro com erro não trava os outros", () => {
    const { seq, criadas, indice } = montar({ paralelo: 1, raio: 1 })
    seq.irPara(5)
    seq.carregar()
    criadas[0].onerror?.(undefined as never) // o 5 falha
    expect(criadas.map(indice)).toEqual([5, 6])
  })

  it("depois de encerrar, o que chegar é ignorado e nada novo é baixado", () => {
    const { seq, criadas, carregados } = montar({ paralelo: 1 })
    seq.irPara(5)
    seq.carregar()
    seq.encerrar()
    criadas[0].onload?.(undefined as never)
    expect(carregados).toEqual([])
    expect(criadas).toHaveLength(1)
  })

  it("avisa quando um quadro recém-chegado fica melhor que o desenhado", () => {
    const { seq } = montar()
    seq.irPara(30)
    expect(seq.melhorQueODesenhado(40)).toBe(true) // nada desenhado ainda
    seq.desenhou(35)
    expect(seq.melhorQueODesenhado(31)).toBe(true)
    expect(seq.melhorQueODesenhado(40)).toBe(false)
  })
})
