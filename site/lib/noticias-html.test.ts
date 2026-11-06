import { describe, expect, it } from "vitest"

import { htmlParaGravar, htmlParaMostrar, textoPuro } from "@/lib/noticias-html"

describe("htmlParaGravar", () => {
  it("texto simples vira parágrafos, com quebra de linha dentro do parágrafo", () => {
    expect(htmlParaGravar("Primeiro\nainda primeiro\n\nSegundo")).toBe("<p>Primeiro<br />ainda primeiro</p>\n<p>Segundo</p>")
  })

  it("texto simples com < e & não vira HTML", () => {
    expect(htmlParaGravar("2 < 3 & 4")).toBe("<p>2 &lt; 3 &amp; 4</p>")
  })

  it("tira script, estilo e atributos de evento do HTML do WordPress", () => {
    const sujo = '<p onclick="x()">Oi</p><script>alert(1)</script><style>p{}</style><img src="https://a.com/f.jpg" onerror="y()">'
    expect(htmlParaGravar(sujo)).toBe('<p>Oi</p><img src="https://a.com/f.jpg" />')
  })

  it("recusa links e imagens que não sejam https", () => {
    expect(htmlParaGravar('<a href="javascript:alert(1)">a</a><img src="http://a.com/f.jpg">')).toBe("<a>a</a><img />")
  })
})

describe("htmlParaMostrar", () => {
  it("todo link abre em outra aba sem passar referência", () => {
    expect(htmlParaMostrar('<a href="https://dask.com" target="_self">x</a>')).toBe(
      '<a href="https://dask.com" target="_blank" rel="noopener noreferrer nofollow">x</a>'
    )
  })

  it("limpa de novo o que vier do banco, mesmo que tenha sido gravado sujo", () => {
    expect(htmlParaMostrar("<p>ok</p><iframe src=https://x.com></iframe>")).toBe("<p>ok</p>")
  })

  it("aceita as mesmas marcações que a gravação", () => {
    const html = "<h2>T</h2><ul><li>a</li></ul><blockquote>c</blockquote><figure><figcaption>f</figcaption></figure>"
    expect(htmlParaMostrar(htmlParaGravar(html))).toBe(html)
  })
})

describe("textoPuro", () => {
  it("tira todas as marcações e mantém o texto", () => {
    expect(textoPuro("<p>Olá <strong>mundo</strong></p>")).toBe("Olá mundo")
  })
})
