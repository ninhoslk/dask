import { describe, expect, it } from "vitest"

import { escolherEncaixe, pontosDeEncaixe, zonaLivreNaTela } from "@/lib/encaixe"

const tela = 900
const limite = 14000

describe("pontosDeEncaixe", () => {
  it("seção que cabe na tela: só o começo", () => {
    expect(pontosDeEncaixe([{ topo: 200, altura: 800 }], 1000, tela)).toEqual([1200])
  })

  it("seção mais alta que a tela: começo e fim", () => {
    expect(pontosDeEncaixe([{ topo: 0, altura: 2000 }], 7000, tela)).toEqual([7000, 7000 + 2000 - tela])
  })

  it("só um pouco mais alta que a tela (até 40 px a mais): o fim não vira ponto", () => {
    expect(pontosDeEncaixe([{ topo: 0, altura: tela + 40 }], 0, tela)).toEqual([0])
  })
})

describe("zonaLivreNaTela", () => {
  it("zona livre ocupando 25% da tela ou mais trava o encaixe", () => {
    expect(zonaLivreNaTela([{ topo: tela - 225, altura: 400 }], tela)).toBe(true)
  })

  it("zona livre aparecendo pouco (menos de 25%) não trava", () => {
    expect(zonaLivreNaTela([{ topo: tela - 200, altura: 400 }], tela)).toBe(false)
  })

  it("zona livre fora da tela não conta", () => {
    expect(zonaLivreNaTela([{ topo: -3000, altura: 1000 }, { topo: 2000, altura: 500 }], tela)).toBe(false)
  })
})

describe("escolherEncaixe", () => {
  const pontos = [7130, 13097]

  it("descendo, parou até 30% de tela antes do começo: desliza até ele", () => {
    expect(escolherEncaixe({ atual: 7130 - 250, direcao: 1, tela, limite, pontos })).toBe(7130)
  })

  it("descendo, parou mais longe que 30% de tela: fica onde está", () => {
    expect(escolherEncaixe({ atual: 7130 - 300, direcao: 1, tela, limite, pontos })).toBeUndefined()
  })

  it("descendo, passou do ponto até 10% de tela: volta um pouco até ele", () => {
    expect(escolherEncaixe({ atual: 7130 + 80, direcao: 1, tela, limite, pontos })).toBe(7130)
  })

  it("descendo, passou mais que 10%: não é puxado de volta", () => {
    expect(escolherEncaixe({ atual: 7130 + 100, direcao: 1, tela, limite, pontos })).toBeUndefined()
  })

  it("subindo, vale o inverso: até 30% abaixo do ponto encaixa", () => {
    expect(escolherEncaixe({ atual: 7130 + 250, direcao: -1, tela, limite, pontos })).toBe(7130)
    expect(escolherEncaixe({ atual: 7130 - 100, direcao: -1, tela, limite, pontos })).toBeUndefined()
  })

  it("já no ponto (a menos de 2 px): não mexe", () => {
    expect(escolherEncaixe({ atual: 7131, direcao: 1, tela, limite, pontos })).toBeUndefined()
  })

  it("entre dois pontos perto, escolhe o mais próximo", () => {
    expect(escolherEncaixe({ atual: 1000, direcao: 1, tela, limite, pontos: [1200, 1050] })).toBe(1050)
  })

  it("ponto além do fim da página: usa o fim da página", () => {
    expect(escolherEncaixe({ atual: 13800, direcao: 1, tela, limite: 13900, pontos: [14100] })).toBe(13900)
  })
})
