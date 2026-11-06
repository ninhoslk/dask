import { describe, expect, it } from "vitest"

import { conteudoPadrao, documentoPadrao, normalizar, resolver } from "@/lib/conteudo/documento"
import { secoes, tipoDaSecao, type Campo } from "@/lib/conteudo/esquema"

// O tipo que cada campo precisa ter depois de resolvido (é o que os
// componentes leem direto, sem conferir).
function confere(campo: Campo, v: unknown) {
  switch (campo.tipo) {
    case "texto":
    case "textarea":
      return typeof v === "string"
    case "imagem":
      return typeof v === "object" && v !== null && typeof (v as { src: unknown }).src === "string"
    case "imagens":
    case "lista":
    case "itens":
      return Array.isArray(v)
  }
}

describe("esquema", () => {
  it("cada seção tem id único e campos com chave única", () => {
    expect(new Set(secoes.map((s) => s.id)).size).toBe(secoes.length)
    for (const s of secoes) expect(new Set(s.campos.map((c) => c.chave)).size).toBe(s.campos.length)
  })

  it("a abertura é a única seção fixa e vem primeiro", () => {
    expect(secoes.filter((s) => s.fixa).map((s) => s.id)).toEqual(["abertura"])
    expect(documentoPadrao().secoes[0].id).toBe("abertura")
  })
})

describe("resolver", () => {
  it("todo campo declarado sai preenchido e com o tipo certo, mesmo sem nada salvo", () => {
    for (const s of resolver(documentoPadrao())) {
      for (const campo of tipoDaSecao[s.id].campos) {
        const v = (s.c as Record<string, unknown>)[campo.chave]
        expect(confere(campo, v), `${s.id}.${campo.chave}`).toBe(true)
      }
    }
  })

  it("um valor salvo com tipo errado é descartado e o padrão volta", () => {
    const doc = normalizar({ secoes: [{ id: "metodo", visivel: true, campos: { sasTitulo: 42, sasFotos: "x" } }] })
    const metodo = resolver(doc).find((s) => s.id === "metodo")!
    expect(metodo.c).toMatchObject({ sasTitulo: conteudoPadrao("metodo").sasTitulo })
    expect(Array.isArray((metodo.c as Record<string, unknown>).sasFotos)).toBe(true)
  })

  it("listas de fotos fixas mantêm sempre o mesmo número de fotos", () => {
    for (const s of secoes) {
      for (const campo of s.campos) {
        if (campo.tipo !== "imagens" || !campo.fixo) continue
        const quebrado = normalizar({
          secoes: [{ id: s.id, visivel: true, campos: { [campo.chave]: [{ src: "https://fora.com/x.jpg", alt: "" }] } }],
        })
        const c = resolver(quebrado).find((x) => x.id === s.id)!.c as unknown as Record<string, unknown[]>
        expect(c[campo.chave], `${s.id}.${campo.chave}`).toHaveLength(campo.padrao.length)
      }
    }
  })
})

describe("normalizar", () => {
  it("mantém a abertura no topo e visível, qualquer que seja a ordem salva", () => {
    const doc = normalizar({ secoes: [{ id: "contato" }, { id: "abertura", visivel: false }] })
    expect(doc.secoes[0]).toMatchObject({ id: "abertura", visivel: true })
  })

  it("acrescenta no fim as seções que o documento salvo ainda não conhecia", () => {
    const doc = normalizar({ secoes: [{ id: "contato" }] })
    expect(doc.secoes.map((s) => s.id).sort()).toEqual(secoes.map((s) => s.id).sort())
  })

  it("descarta seções desconhecidas e repetidas", () => {
    const doc = normalizar({ secoes: [{ id: "contato" }, { id: "contato" }, { id: "inventada" }] })
    expect(doc.secoes.filter((s) => s.id === "contato")).toHaveLength(1)
    expect(doc.secoes.some((s) => (s.id as string) === "inventada")).toBe(false)
  })
})
