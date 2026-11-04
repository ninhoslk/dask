// Conteúdo institucional do Colégio Dask, levantado de colegiodask.com.br (out/2026).

export const contato = {
  telefone: "(18) 3822-3018",
  telefoneHref: "tel:+551838223018",
  whatsapp: "(18) 99781-5960",
  whatsappNumero: "5518997815960",
  email: "secretaria@colegiodask.com.br",
  endereco: "R. Aristides Zanoni, s/n – Jardim América",
  cidade: "Dracena-SP",
  cep: "17911-262",
  mapa: "https://www.google.com/maps/search/?api=1&query=Col%C3%A9gio+Dask+Dracena+SP",
  mapaEmbed:
    "https://www.google.com/maps?q=Col%C3%A9gio+Dask,+R.+Aristides+Zanoni,+Dracena+-+SP&z=16&output=embed",
  instagram: "https://www.instagram.com/colegiodask/",
  facebook: "https://www.facebook.com/colegiodask",
  // eduxego é o app de alunos e famílias; eduxe (Eduxe Class) é o diário de classe do professor.
  diarioDoAluno: "https://colegiodask.eduxego.com.br/",
  profWeb: "https://colegiodask.eduxe.com.br",
  trabalheConosco:
    "https://docs.google.com/forms/d/e/1FAIpQLSfQ6YoWv4TvpOwl0vIMFd1TU18r5CuRGAYDBWLNZPlFWw2rHQ/viewform?usp=header",
  mantenedora: "Associação Dracenense de Ensino e Cultura",
  cnpj: "48.778.307/0001-44",
  razao: "Escola de Ensino Fundamental e Médio Profª Liliana Gonzaga – Colégio Dask",
}

export function whatsappLink(mensagem: string) {
  return `https://wa.me/${contato.whatsappNumero}?text=${encodeURIComponent(mensagem)}`
}

export const mensagemVisita =
  "Olá! Gostaria de agendar uma visita ao Colégio Dask."

// Parceiros pedagógicos: logo e "Ver mais" levam ao site oficial de cada um.
export const parceiros = {
  sas: "https://www.saseducacao.com.br/",
  arvore: "https://www.arvore.com.br/",
}

// Compartilhar uma notícia nas redes. O Instagram não tem link de
// compartilhamento pela web; ele aparece como "seguir" ao lado.
export function linksDeCompartilhamento(url: string, titulo: string, imagem?: string) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(titulo)
  const midia = imagem ? `&media=${encodeURIComponent(imagem)}` : ""
  return [
    { rede: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { rede: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { rede: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}${midia}` },
    { rede: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
  ] as const
}

export type Coordenacao = {
  cargo: string
  nome: string
  telefone: string
  numero: string
  horario: string
}

export type Segmento = {
  id: "fund1" | "fund2" | "medio"
  nome: string
  series: string[]
  resumo: string
  coordenacao: Coordenacao
}

export const segmentos: Segmento[] = [
  {
    id: "fund1",
    nome: "Ensino Fundamental I",
    series: ["1º ano", "2º ano", "3º ano", "4º ano", "5º ano"],
    resumo:
      "Aprender fazendo, com conhecimento e prática juntos desde a alfabetização.",
    coordenacao: {
      cargo: "Coordenação do Fundamental I",
      nome: "Simone Tolardo",
      telefone: "(18) 99821-7828",
      numero: "5518998217828",
      horario: "8h às 12h e 14h às 16h",
    },
  },
  {
    id: "fund2",
    nome: "Ensino Fundamental II",
    series: ["6º ano", "7º ano", "8º ano", "9º ano"],
    resumo:
      "Senso crítico, iniciativa e perseverança, com tecnologia como base do projeto.",
    coordenacao: {
      cargo: "Coordenação do Fundamental II",
      nome: "Marcia Fonte",
      telefone: "(18) 99759-9256",
      numero: "5518997599256",
      horario: "8h às 12h e 15h às 17h",
    },
  },
  {
    id: "medio",
    nome: "Ensino Médio",
    series: ["1ª série", "2ª série", "3ª série"],
    resumo:
      "Conteúdo estudado na 1ª e 2ª séries e aprofundado na 3ª, rumo ao Enem e aos vestibulares.",
    coordenacao: {
      cargo: "Coordenação do Ensino Médio",
      nome: "Fábio Neves",
      telefone: "(18) 99618-5122",
      numero: "5518996185122",
      horario: "9h às 11h e 14h às 16h",
    },
  },
]

export const psicologa = {
  nome: "Andréa Barbosa",
  horario: "Seg 13h30–17h30 · Ter 8h–12h · Qua 7h30–11h30",
}

export const linhaDoTempo = [
  { ano: "1995", texto: "Um grupo de professores propõe criar a escola, na Rodovia Byron de Azevedo Nogueira." },
  { ano: "1996", texto: "A escola “8 de Dezembro” abre com três turmas de ensino médio." },
  { ano: "1997", texto: "A pedido das famílias, chega o ensino fundamental." },
  { ano: "1998", texto: "Passa a se chamar Escola Profª Liliana Gonzaga." },
  { ano: "2001", texto: "Inaugura a sede própria na Rua Aristides Zanoni." },
  { ano: "2021", texto: "Passa de 700 alunos entre fundamental, médio e cursinho." },
  { ano: "2022", texto: "Ganha identidade própria e vira Colégio Dask." },
]

// Each entry keeps its own preposition so the sentence reads naturally.
export const conquistas = [
  "na Olimpíada Brasileira de Robótica",
  "no Torneio Brasil de Robótica",
  "na Olimpíada Canguru de Matemática",
  "na Feira de Ciência e Tecnologia do Oeste Paulista",
  "no CIC Dask Júnior",
  "no Simulado FUVEST",
  "na Escola de Inverno Mundo Quântico",
  "na Feira de Profissões da UNOESTE",
  "na UNESP",
  "no curso de programação em Python",
  "no Festival de Tênis de Mesa",
  "no Campeonato de Xadrez",
  "no palco do Nossos Talentos",
]

export const documentos = {
  normas:
    "https://drive.google.com/file/d/1ntCxVv5JcvstmRmvqnl7HCT6fn1Rv0OV/view?usp=sharing",
  listasFund1: [
    { serie: "1º ano", url: "https://drive.google.com/file/d/186RaJfhrrAM1MYdjk0k8t46eQ6ZOLDQ9/view?usp=sharing" },
    { serie: "2º ano", url: "https://drive.google.com/file/d/1g1bLFREBK3LW8RRsBPmgMkIBc3T1komU/view?usp=sharing" },
    { serie: "3º ano · alunos Dask", url: "https://drive.google.com/file/d/10l6mZzpW2HeeTAoUSqn53GJQ3Ol4Z-BT/view?usp=sharing" },
    { serie: "3º ano · alunos novos", url: "https://drive.google.com/file/d/15md4bfHaIzMW7djOZlA1PqNp28RHvNPY/view?usp=sharing" },
    { serie: "4º ano · alunos Dask", url: "https://drive.google.com/file/d/1W3GdFmkB6qrjlQUcfyN1JINhfC9rxslz/view?usp=sharing" },
    { serie: "4º ano · alunos novos", url: "https://drive.google.com/file/d/1CWg2CjCa6LnDcTbJ3iSCnOa-JDPWLN38/view?usp=sharing" },
    { serie: "5º ano · alunos Dask", url: "https://drive.google.com/file/d/14gUhuXrZNGW3_m-aGWleUuvtlf0bsEbW/view?usp=sharing" },
    { serie: "5º ano · alunos novos", url: "https://drive.google.com/file/d/1UflrX2Rt1o3uaJbKVU_7aTI3G9dWohJE/view?usp=sharing" },
  ],
}

export const navegacao = [
  { href: "/#escola", label: "A escola" },
  { href: "/#ensino", label: "Ensino" },
  { href: "/#vida", label: "Vida no Dask" },
  { href: "/noticias", label: "Notícias" },
  { href: "/tour-360", label: "Tour 360°" },
]
