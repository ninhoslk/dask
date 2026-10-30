// Tipos e formatação de notícias que valem no servidor e no navegador.

export type Noticia = {
  slug: string
  titulo: string
  data: string
  categoria: "Geral" | "Ensino" | "Eventos"
  resumo: string
  conteudo: string
  imagem: string | null
  miniatura: string | null
  urlOriginal: string | null
}

/** O que um cartão de notícia precisa (sem o texto completo). */
export type NoticiaCartao = Omit<Noticia, "conteudo">

export function paraCartao(n: Noticia): NoticiaCartao {
  const cartao: Partial<Noticia> = { ...n }
  delete cartao.conteudo
  return cartao as NoticiaCartao
}

/** Resumo sem frase cortada no meio (os excerpts do WordPress vêm cortados). */
export function resumoInteiro(texto: string) {
  const fim = Math.max(texto.lastIndexOf("!"), texto.lastIndexOf("."))
  return fim > 60 ? texto.slice(0, fim + 1) : texto
}

export const formatoData = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
})
