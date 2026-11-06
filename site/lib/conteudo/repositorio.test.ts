import { describe, expect, it } from "vitest"

import { documentoPadrao, normalizar, type Documento } from "@/lib/conteudo/documento"
import { lojaMemoria } from "@/lib/conteudo/loja-memoria"
import { ErroLeitura, repositorioPagina } from "@/lib/conteudo/repositorio"

// Um documento com uma mudança visível: o título da Apresentação.
function comTitulo(titulo: string): Documento {
  const doc = documentoPadrao()
  return normalizar({
    secoes: doc.secoes.map((s) => (s.id === "apresentacao" ? { ...s, campos: { ...s.campos, titulo } } : s)),
  })
}
const tituloDe = (doc: Documento) => doc.secoes.find((s) => s.id === "apresentacao")?.campos.titulo

describe("publicado (site)", () => {
  it("sem banco configurado mostra o conteúdo padrão", async () => {
    expect(await repositorioPagina(null).publicado()).toEqual(documentoPadrao())
  })

  it("com o banco fora do ar mostra o conteúdo padrão, sem quebrar o site", async () => {
    const m = lojaMemoria({ paginas: comTitulo("No ar") })
    m.falhar.add("lerConteudo")
    expect(await repositorioPagina(m.loja).publicado()).toEqual(documentoPadrao())
  })

  it("lê e valida o documento publicado", async () => {
    const m = lojaMemoria({ paginas: comTitulo("No ar") })
    expect(tituloDe(await repositorioPagina(m.loja).publicado())).toBe("No ar")
  })
})

describe("paraEditar (painel e prévia)", () => {
  it("sem rascunho salvo, o rascunho começa igual ao que está no ar", async () => {
    const m = lojaMemoria({ paginas: comTitulo("No ar") })
    const { rascunho, publicado } = await repositorioPagina(m.loja).paraEditar()
    expect(tituloDe(rascunho)).toBe("No ar")
    expect(tituloDe(publicado)).toBe("No ar")
  })

  it("com rascunho salvo, devolve os dois separados", async () => {
    const m = lojaMemoria({ paginas: comTitulo("No ar"), rascunhos: comTitulo("Em edição") })
    const { rascunho, publicado } = await repositorioPagina(m.loja).paraEditar()
    expect(tituloDe(rascunho)).toBe("Em edição")
    expect(tituloDe(publicado)).toBe("No ar")
  })

  it("se o banco falhar, lança erro em vez de abrir o editor com o conteúdo padrão", async () => {
    const m = lojaMemoria({ paginas: comTitulo("No ar") })
    m.falhar.add("ler:rascunhos")
    await expect(repositorioPagina(m.loja).paraEditar()).rejects.toBeInstanceOf(ErroLeitura)
  })

  it("sem banco configurado também lança erro", async () => {
    await expect(repositorioPagina(null).paraEditar()).rejects.toBeInstanceOf(ErroLeitura)
  })
})

describe("salvarRascunho", () => {
  it("grava só o rascunho, sem mexer no que está no ar", async () => {
    const m = lojaMemoria({ paginas: comTitulo("No ar") })
    expect(await repositorioPagina(m.loja).salvarRascunho(comTitulo("Novo"), "u1")).toEqual({ ok: true })
    expect(tituloDe(m.tabelas.rascunhos.get("home") as Documento)).toBe("Novo")
    expect(tituloDe(m.tabelas.paginas.get("home") as Documento)).toBe("No ar")
  })

  it("valida a entrada: o que não é documento vira o documento padrão", async () => {
    const m = lojaMemoria()
    await repositorioPagina(m.loja).salvarRascunho("lixo", "u1")
    expect(m.tabelas.rascunhos.get("home")).toEqual(documentoPadrao())
  })

  it("avisa quando não consegue gravar", async () => {
    const m = lojaMemoria()
    m.falhar.add("gravar:rascunhos")
    expect(await repositorioPagina(m.loja).salvarRascunho(comTitulo("Novo"), "u1")).toEqual({
      ok: false,
      erro: "Não foi possível salvar o rascunho.",
    })
  })
})

describe("publicar", () => {
  it("coloca no ar, iguala o rascunho, guarda a versão e registra quem publicou", async () => {
    const m = lojaMemoria()
    expect(await repositorioPagina(m.loja).publicar(comTitulo("Lançado"), "u1")).toEqual({ ok: true })
    expect(tituloDe(m.tabelas.paginas.get("home") as Documento)).toBe("Lançado")
    expect(tituloDe(m.tabelas.rascunhos.get("home") as Documento)).toBe("Lançado")
    expect(m.versoes).toHaveLength(1)
    expect(m.auditoria).toEqual([{ acao: "publicar", alvo: "home", autor: "u1" }])
  })

  it("se não conseguir colocar no ar, falha e não registra nada", async () => {
    const m = lojaMemoria()
    m.falhar.add("gravar:paginas")
    expect(await repositorioPagina(m.loja).publicar(comTitulo("Lançado"), "u1")).toEqual({
      ok: false,
      erro: "Não foi possível publicar.",
    })
    expect(m.versoes).toHaveLength(0)
    expect(m.auditoria).toHaveLength(0)
  })

  it("se o histórico falhar, a página fica no ar e o aviso diz o que faltou", async () => {
    const m = lojaMemoria()
    m.falhar.add("registrarVersao")
    m.falhar.add("registrarAuditoria")
    const r = await repositorioPagina(m.loja).publicar(comTitulo("Lançado"), "u1")
    expect(r.ok).toBe(true)
    expect(r.ok && r.aviso).toBe(
      "Publicado, mas não foi possível guardar a versão no histórico, registrar quem publicou. Publique de novo para completar."
    )
    expect(tituloDe(m.tabelas.paginas.get("home") as Documento)).toBe("Lançado")
  })
})

describe("versões", () => {
  it("lista da mais nova para a mais antiga, com o nome de quem publicou", async () => {
    const m = lojaMemoria({}, { u1: "Ana" })
    const repo = repositorioPagina(m.loja)
    await repo.publicar(comTitulo("Primeira"), "u1")
    await repo.publicar(comTitulo("Segunda"), "u1")
    m.versoes[1].criado_por = "u1"
    const r = await repo.versoes()
    expect(r.ok && r.dados?.map((v) => v.autor)).toEqual(["Ana", "Equipe"])
  })

  it("lê uma versão e recusa ids inválidos ou inexistentes", async () => {
    const m = lojaMemoria()
    const repo = repositorioPagina(m.loja)
    await repo.publicar(comTitulo("Antiga"), "u1")
    const lida = await repo.versao(m.versoes[0].id)
    expect(lida.ok && tituloDe(lida.dados!)).toBe("Antiga")
    expect(await repo.versao(1.5)).toEqual({ ok: false, erro: "Versão inválida." })
    expect(await repo.versao(999)).toEqual({ ok: false, erro: "Versão não encontrada." })
  })

  it("avisa quando não consegue ler o histórico", async () => {
    const m = lojaMemoria()
    m.falhar.add("listarVersoes")
    expect(await repositorioPagina(m.loja).versoes()).toEqual({ ok: false, erro: "Não foi possível ler o histórico." })
  })
})
