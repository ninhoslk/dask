// Leituras prontas das informações do site (lib/conteudo/config.ts), para os
// componentes não repetirem regra: telefone vira link de ligação e de WhatsApp
// aqui, e só aqui.

import { campo, regs, txt, num, type Config } from "@/lib/conteudo/documento"
import type { Registro } from "@/lib/conteudo/esquema"

const digitos = (t: string) => t.replace(/\D/g, "")

/** Número com o código do Brasil, como o wa.me e o tel: esperam. */
export function numeroCompleto(telefone: string) {
  const d = digitos(telefone)
  if (d.length === 10 || d.length === 11) return `55${d}`
  return d
}

export const linkTelefone = (telefone: string) => (digitos(telefone) ? `tel:+${numeroCompleto(telefone)}` : "")

export function linkWhatsApp(telefone: string, mensagem?: string) {
  const n = numeroCompleto(telefone)
  if (!n) return ""
  return `https://wa.me/${n}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ""}`
}

/** Links externos abrem em outra aba; os do próprio site, não. */
export const externo = (link: string) => /^https?:\/\//i.test(link)

export type LinkMenu = { id: string; rotulo: string; link: string; novaAba: boolean }

const links = (lista: Registro[]): LinkMenu[] =>
  lista
    .map((r) => ({ id: r._id, rotulo: campo(r, "rotulo"), link: campo(r, "link"), novaAba: r.novaAba === true }))
    .filter((l) => l.rotulo && l.link)

export function contatoDe(cfg: Config) {
  const c = cfg.contato
  const i = cfg.identidade
  return {
    nome: txt(i, "nome"),
    telefone: txt(c, "telefone"),
    telefoneHref: linkTelefone(txt(c, "telefone")),
    whatsapp: txt(c, "whatsapp"),
    /** link do WhatsApp da secretaria com a mensagem pronta de visita */
    whatsappVisita: linkWhatsApp(txt(c, "whatsapp"), txt(c, "mensagem")),
    /** link do WhatsApp da secretaria com outra mensagem */
    whatsappCom: (mensagem: string) => linkWhatsApp(txt(c, "whatsapp"), mensagem),
    email: txt(c, "email"),
    horario: txt(c, "horario").trim(),
    mapa: txt(c, "mapa"),
    mapaEmbed: txt(c, "mapaEmbed"),
    endereco: txt(i, "endereco"),
    bairro: txt(i, "bairro"),
    cidade: txt(i, "cidade"),
    cep: txt(i, "cep"),
    razao: txt(i, "razao"),
    mantenedora: txt(i, "mantenedora"),
    cnpj: txt(i, "cnpj"),
  }
}

export type Rede = { id: string; nome: string; link: string; icone: string }

export const redesDe = (cfg: Config): Rede[] =>
  regs(cfg.redes, "perfis")
    .map((r) => ({ id: r._id, nome: campo(r, "nome"), link: campo(r, "link"), icone: campo(r, "icone") }))
    .filter((r) => r.nome && r.link)

export function menuDe(cfg: Config) {
  const m = cfg.menu
  return {
    itens: links(regs(m, "itens")),
    areaTitulo: txt(m, "areaTitulo"),
    area: links(regs(m, "area")),
    botao: txt(m, "botao"),
    botaoCelular: txt(m, "botaoCelular"),
  }
}

export const linksRodapeDe = (cfg: Config) => links(regs(cfg.rodape, "links"))

export type Segmento = {
  id: string
  nome: string
  series: string[]
  resumo: string
  cargo: string
  coordenador: string
  telefone: string
  whatsapp: string
  horario: string
  atalhoTexto: string
  atalhoLink: string
  documentos: { id: string; nome: string; link: string }[]
}

export const segmentosDe = (cfg: Config): Segmento[] =>
  regs(cfg.segmentos, "lista")
    .map((r) => ({
      id: r._id,
      nome: campo(r, "nome"),
      series: campo(r, "series")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      resumo: campo(r, "resumo"),
      cargo: campo(r, "cargo"),
      coordenador: campo(r, "coordenador"),
      telefone: campo(r, "telefone"),
      whatsapp: linkWhatsApp(campo(r, "telefone")),
      horario: campo(r, "horario"),
      atalhoTexto: campo(r, "atalhoTexto"),
      atalhoLink: campo(r, "atalhoLink"),
      documentos: regs(r, "documentos")
        .map((d) => ({ id: d._id, nome: campo(d, "nome"), link: campo(d, "link") }))
        .filter((d) => d.nome),
    }))
    .filter((s) => s.nome)

export function psicologiaDe(cfg: Config) {
  const s = cfg.segmentos
  return {
    titulo: txt(s, "psicoTitulo"),
    rotulo: txt(s, "psicoRotulo"),
    nome: txt(s, "psicoNome").trim(),
    horario: txt(s, "psicoHorario"),
    nota: txt(s, "psicoNota"),
  }
}

// Cores do tema: só hex de 6 dígitos chegam aqui (validados em normalizarConfig),
// então o CSS não tem como receber outra coisa.
export function temaCss(cfg: Config) {
  const t = cfg.tema
  const cor = (k: string) => {
    const v = txt(t, k)
    return /^#[0-9a-f]{6}$/i.test(v) ? v : null
  }
  const pares: [string, string | null][] = [
    ["--brand", cor("brand")],
    ["--primary", cor("brand")],
    ["--field", cor("field")],
    ["--tint", cor("tint")],
    ["--background", cor("background")],
    ["--foreground", cor("foreground")],
    ["--card-foreground", cor("foreground")],
    ["--popover-foreground", cor("foreground")],
    ["--primary-foreground", cor("foreground")],
    ["--secondary-foreground", cor("foreground")],
    ["--accent-foreground", cor("foreground")],
    ["--sky", cor("sky")],
    ["--ring", cor("sky")],
  ]
  const raio = num(t, "raio")
  const regras = pares.filter(([, v]) => v).map(([k, v]) => `${k}:${v}`)
  regras.push(`--radius:${Math.min(32, Math.max(0, raio)) / 16}rem`)
  return `:root{${regras.join(";")}}`
}
