import { describe, expect, it } from "vitest"

import { documentoPadrao } from "@/lib/conteudo/documento"
import {
  acrescentarSecao,
  alternarSecao,
  duplicarSecao,
  moverSecao,
  mudarCampo,
  podeDuplicar,
  podeMover,
  removerSecao,
  reordenarSecao,
  tiposDisponiveis,
} from "@/lib/conteudo/operacoes"

const doc = documentoPadrao()
const ids = (d = doc) => d.secoes.map((s) => s.id)
const segunda = ids()[1] // a primeira depois da abertura
const ultima = ids()[ids().length - 1]

describe("mover", () => {
  it("a abertura não sobe, não desce e nada passa por cima dela", () => {
    expect(podeMover(doc, "abertura", 1)).toBe(false)
    expect(podeMover(doc, segunda, -1)).toBe(false)
    expect(moverSecao(doc, segunda, -1)).toBe(doc)
  })

  it("a última seção não desce", () => {
    expect(podeMover(doc, ultima, 1)).toBe(false)
  })

  it("sobe e desce uma posição trocando com a vizinha", () => {
    const terceira = ids()[2]
    const movido = moverSecao(doc, terceira, -1)
    expect(ids(movido).slice(0, 3)).toEqual(["abertura", terceira, segunda])
    expect(ids(moverSecao(movido, terceira, 1))).toEqual(ids())
  })

  it("não muda o documento original", () => {
    const antes = ids()
    moverSecao(doc, ids()[2], -1)
    expect(ids()).toEqual(antes)
  })
})

describe("reordenar (arrastar)", () => {
  it("põe a seção arrastada no lugar da outra", () => {
    const r = reordenarSecao(doc, ultima, segunda)
    expect(ids(r)[1]).toBe(ultima)
    expect(ids(r)[0]).toBe("abertura")
  })

  it("ignora arrastar a abertura ou soltar em cima dela", () => {
    expect(reordenarSecao(doc, "abertura", ultima)).toBe(doc)
    expect(reordenarSecao(doc, ultima, "abertura")).toBe(doc)
  })
})

describe("mostrar e ocultar", () => {
  it("oculta e mostra de novo", () => {
    const oculta = alternarSecao(doc, "ensino")
    expect(oculta.secoes.find((s) => s.id === "ensino")?.visivel).toBe(false)
    expect(alternarSecao(oculta, "ensino").secoes.find((s) => s.id === "ensino")?.visivel).toBe(true)
  })

  it("a abertura não pode ser ocultada", () => {
    expect(alternarSecao(doc, "abertura")).toBe(doc)
  })
})

describe("campos", () => {
  it("muda um campo só da seção indicada", () => {
    const r = mudarCampo(doc, "metodo", "titulo", "Novo título")
    expect(r.secoes.find((s) => s.id === "metodo")?.campos.titulo).toBe("Novo título")
    expect(r.secoes.find((s) => s.id === "ensino")?.campos.titulo).toBeUndefined()
  })

  it("undefined volta o campo ao padrão (some do documento)", () => {
    const r = mudarCampo(mudarCampo(doc, "metodo", "titulo", "Novo"), "metodo", "titulo", undefined)
    expect("titulo" in r.secoes.find((s) => s.id === "metodo")!.campos).toBe(false)
  })
})

describe("acrescentar, duplicar e remover", () => {
  it("acrescenta uma seção extra no fim e devolve o id dela", () => {
    const r = acrescentarSecao(doc, "bloco")
    expect(r.id).toBe("bloco")
    expect(r.doc.secoes.at(-1)).toMatchObject({ id: "bloco", tipo: "bloco", visivel: true })
  })

  it("não acrescenta uma seção única que já está na página, nem a abertura", () => {
    expect(acrescentarSecao(doc, "metodo")).toEqual({ doc, id: null })
    expect(acrescentarSecao(doc, "abertura")).toEqual({ doc, id: null })
    expect(tiposDisponiveis(doc)).toEqual(["bloco", "chamada"])
  })

  it("depois de removida, a seção única volta a poder ser acrescentada", () => {
    const sem = removerSecao(doc, "metodo")
    expect(sem.secoes.some((s) => s.tipo === "metodo")).toBe(false)
    expect(tiposDisponiveis(sem)).toContain("metodo")
  })

  it("a abertura não sai", () => {
    expect(removerSecao(doc, "abertura")).toBe(doc)
  })

  it("duplica uma seção extra logo abaixo, com id novo e os mesmos campos", () => {
    const com = mudarCampo(acrescentarSecao(doc, "chamada").doc, "chamada", "titulo", "Matrículas")
    const dup = duplicarSecao(com, "chamada")
    const i = dup.secoes.findIndex((s) => s.id === "chamada")
    expect(dup.secoes[i + 1]).toMatchObject({ id: "chamada-2", tipo: "chamada", campos: { titulo: "Matrículas" } })
  })

  it("a cópia é independente da original", () => {
    const com = mudarCampo(acrescentarSecao(doc, "chamada").doc, "chamada", "titulo", "A")
    const dup = mudarCampo(duplicarSecao(com, "chamada"), "chamada-2", "titulo", "B")
    expect(dup.secoes.find((s) => s.id === "chamada")?.campos.titulo).toBe("A")
  })

  it("seções únicas não se duplicam", () => {
    expect(podeDuplicar(doc, "metodo")).toBe(false)
    expect(duplicarSecao(doc, "metodo")).toBe(doc)
  })
})
