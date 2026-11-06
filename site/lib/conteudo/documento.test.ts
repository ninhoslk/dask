import { describe, expect, it } from "vitest"

import { conteudoPadrao, documentoPadrao, linkSeguro, normalizar, resolver } from "@/lib/conteudo/documento"
import { secoes, secoesPadrao, tipoDaSecao, type Campo } from "@/lib/conteudo/esquema"

// O tipo que cada campo precisa ter depois de resolvido (é o que os
// componentes leem direto, sem conferir).
function confere(campo: Campo, v: unknown) {
  switch (campo.tipo) {
    case "texto":
    case "textarea":
    case "link":
    case "cor":
    case "escolha":
      return typeof v === "string"
    case "numero":
      return typeof v === "number"
    case "imagem":
      return typeof v === "object" && v !== null && typeof (v as { src: unknown }).src === "string"
    case "imagens":
    case "lista":
    case "itens":
    case "registros":
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
      for (const campo of tipoDaSecao[s.tipo].campos) {
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
    expect(doc.secoes.map((s) => s.id).sort()).toEqual(secoesPadrao.map((s) => s.id).sort())
  })

  it("descarta seções desconhecidas e repetidas", () => {
    const doc = normalizar({ secoes: [{ id: "contato" }, { id: "contato" }, { id: "inventada" }] })
    expect(doc.secoes.filter((s) => s.id === "contato")).toHaveLength(1)
    expect(doc.secoes.some((s) => (s.id as string) === "inventada")).toBe(false)
  })
})

describe("seções acrescentadas pelo painel", () => {
  it("as seções extras não entram na home padrão", () => {
    const tipos = documentoPadrao().secoes.map((s) => s.tipo)
    expect(tipos).not.toContain("bloco")
    expect(tipos).not.toContain("chamada")
  })

  it("uma seção extra pode se repetir, cada uma com seu id e seus campos", () => {
    const doc = normalizar({
      v: 2,
      secoes: [
        { id: "abertura", tipo: "abertura" },
        { id: "bloco", tipo: "bloco", campos: { titulo: "Um" } },
        { id: "bloco-2", tipo: "bloco", campos: { titulo: "Dois" } },
      ],
    })
    const blocos = resolver(doc).filter((s) => s.tipo === "bloco")
    expect(blocos.map((s) => s.id)).toEqual(["bloco", "bloco-2"])
    expect(blocos.map((s) => (s.c as { titulo: string }).titulo)).toEqual(["Um", "Dois"])
  })

  it("uma seção única não se repete, mesmo com outro id", () => {
    const doc = normalizar({ v: 2, secoes: [{ id: "metodo", tipo: "metodo" }, { id: "metodo-2", tipo: "metodo" }] })
    expect(doc.secoes.filter((s) => s.tipo === "metodo")).toHaveLength(1)
  })

  it("no documento novo (v: 2), uma seção removida continua fora; a abertura volta sempre", () => {
    const doc = normalizar({ v: 2, secoes: [{ id: "contato", tipo: "contato" }] })
    expect(doc.secoes.map((s) => s.tipo)).toEqual(["abertura", "contato"])
  })

  it("ids inválidos viram o id do tipo", () => {
    const doc = normalizar({ v: 2, secoes: [{ id: "<script>", tipo: "chamada" }] })
    expect(doc.secoes.find((s) => s.tipo === "chamada")?.id).toBe("chamada")
  })
})

describe("links e cores", () => {
  it("aceita páginas do site, âncoras e https/mailto/tel; recusa o resto", () => {
    for (const ok of ["/noticias", "/#ensino", "#ensino", "https://x.com/a", "mailto:a@b.c", "tel:+5518", ""]) expect(linkSeguro(ok)).toBe(ok)
    for (const ruim of ["javascript:alert(1)", "//outro.com", "http://x.com", "data:text/html,x", "/a b"]) expect(linkSeguro(ruim)).toBeUndefined()
  })

  it("um link inválido salvo cai no padrão do campo", () => {
    const doc = normalizar({ secoes: [{ id: "metodo", campos: { sasLink: "javascript:alert(1)" } }] })
    const metodo = resolver(doc).find((s) => s.tipo === "metodo")!
    expect((metodo.c as { sasLink: string }).sasLink).toBe(conteudoPadrao("metodo").sasLink)
  })
})
