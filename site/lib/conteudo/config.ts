// Informações do site inteiro (não de uma seção): identidade, contatos, redes,
// menus, segmentos e coordenação, Central do aluno, rodapé, textos das páginas
// e cores. Mesmo modelo da home: cada grupo tem campos com o valor atual como
// padrão, e o banco guarda só o que mudou (documento "site").

import { contato, documentos, mensagemVisita, psicologa, segmentos } from "@/lib/site"
import { registros, type Opcao, type Registro, type Subcampo, type TipoSecao } from "@/lib/conteudo/esquema"

export type IdGrupo =
  | "identidade"
  | "contato"
  | "redes"
  | "menu"
  | "segmentos"
  | "central"
  | "rodape"
  | "paginas"
  | "tema"

export type Grupo = Omit<TipoSecao, "id"> & {
  id: IdGrupo
  /** página mostrada na prévia ao editar este grupo */
  previa: "home" | "central"
}

export const icones: Opcao[] = [
  { valor: "instagram", rotulo: "Instagram" },
  { valor: "facebook", rotulo: "Facebook" },
  { valor: "linkedin", rotulo: "LinkedIn" },
  { valor: "outro", rotulo: "Outro (ícone de globo)" },
]

const link: Subcampo[] = [
  { chave: "rotulo", rotulo: "Texto", tipo: "texto" },
  { chave: "link", rotulo: "Endereço", tipo: "link", ajuda: "Página do site (/noticias, /#ensino) ou endereço completo (https://…)." },
  { chave: "novaAba", rotulo: "Abrir em nova aba", tipo: "simnao" },
]

const docsPadrao: Record<string, { nome: string; link: string }[]> = {
  fund1: [
    ...documentos.listasFund1.map((l) => ({ nome: `Lista de material 2026 · ${l.serie}`, link: l.url })),
    { nome: "Normas disciplinares", link: documentos.normas },
    { nome: "Horários de aulas 2026 · manhã e tarde", link: "" },
    { nome: "Calendário 2026", link: "" },
  ],
  fund2: [
    { nome: "Normas disciplinares", link: documentos.normas },
    { nome: "Calendário 2026", link: "" },
    { nome: "Horários de aulas 2026 · manhã e tarde", link: "" },
    { nome: "Datas das provas por trimestre", link: "" },
    { nome: "Plantão de dúvidas", link: "" },
  ],
  medio: [
    { nome: "Normas disciplinares", link: documentos.normas },
    { nome: "Calendário 2026", link: "" },
    { nome: "Horários da 1ª, 2ª e 3ª série", link: "" },
    { nome: "Calendário de provas", link: "" },
  ],
}

export const grupos: Grupo[] = [
  {
    id: "identidade",
    nome: "Identidade e endereço",
    descricao: "Nome, logos, endereço e dados legais do rodapé.",
    previa: "home",
    campos: [
      { chave: "nome", rotulo: "Nome da escola", tipo: "texto", padrao: "Colégio Dask" },
      { chave: "subtitulo", rotulo: "Subtítulo do menu no celular", tipo: "texto", padrao: "Dracena-SP · desde 1996" },
      { chave: "logo", rotulo: "Logo (fundo claro)", tipo: "imagem", padrao: { src: "/logo-dask.png", alt: "Colégio Dask" } },
      { chave: "logoBranco", rotulo: "Logo branco (sobre foto e rodapé)", tipo: "imagem", padrao: { src: "/logo-dask-branco.png", alt: "Colégio Dask" } },
      { chave: "endereco", rotulo: "Endereço", tipo: "texto", padrao: contato.endereco },
      { chave: "bairro", rotulo: "Bairro", tipo: "texto", padrao: "Jardim América" },
      { chave: "cidade", rotulo: "Cidade", tipo: "texto", padrao: contato.cidade },
      { chave: "cep", rotulo: "CEP", tipo: "texto", padrao: contato.cep },
      { chave: "razao", rotulo: "Razão social", tipo: "texto", padrao: contato.razao },
      { chave: "mantenedora", rotulo: "Mantenedora", tipo: "texto", padrao: contato.mantenedora },
      { chave: "cnpj", rotulo: "CNPJ", tipo: "texto", padrao: contato.cnpj },
    ],
  },
  {
    id: "contato",
    nome: "Contatos e atendimento",
    descricao: "Telefone, WhatsApp, e-mail, horário e mapa. Valem para o site todo.",
    previa: "home",
    campos: [
      { chave: "telefone", rotulo: "Telefone da secretaria", tipo: "texto", padrao: contato.telefone, ajuda: "Do jeito que aparece no site; o link de ligação é montado sozinho." },
      { chave: "whatsapp", rotulo: "WhatsApp da secretaria", tipo: "texto", padrao: contato.whatsapp, ajuda: "Com DDD. Vale para o botão verde e todos os botões de visita." },
      { chave: "mensagem", rotulo: "Mensagem pronta do WhatsApp", tipo: "textarea", padrao: mensagemVisita },
      { chave: "email", rotulo: "E-mail", tipo: "texto", padrao: contato.email },
      {
        chave: "horario",
        rotulo: "Horário de atendimento da secretaria",
        tipo: "textarea",
        padrao: "",
        ajuda: "Ex.: Segunda a sexta, 7h às 17h. Vazio, não aparece no site.",
      },
      { chave: "mapa", rotulo: "Link “Como chegar”", tipo: "link", padrao: contato.mapa },
      {
        chave: "mapaEmbed",
        rotulo: "Mapa (endereço de incorporação)",
        tipo: "link",
        padrao: contato.mapaEmbed,
        ajuda: "No Google Maps: Compartilhar → Incorporar um mapa, e copie só o endereço do src.",
      },
    ],
  },
  {
    id: "redes",
    nome: "Redes sociais",
    descricao: "Perfis do colégio: rodapé, notícias e botão flutuante.",
    previa: "home",
    campos: [
      {
        chave: "perfis",
        rotulo: "Perfis",
        tipo: "registros",
        titulo: "nome",
        novo: "Adicionar perfil",
        subcampos: [
          { chave: "nome", rotulo: "Nome", tipo: "texto" },
          { chave: "link", rotulo: "Endereço", tipo: "link" },
          { chave: "icone", rotulo: "Ícone", tipo: "escolha", opcoes: icones },
        ],
        padrao: registros("rede", [
          { nome: "Instagram", link: contato.instagram, icone: "instagram" },
          { nome: "Facebook", link: contato.facebook, icone: "facebook" },
        ]),
        ajuda: "O botão flutuante usa o primeiro perfil do Instagram que estiver ligado.",
      },
    ],
  },
  {
    id: "menu",
    nome: "Menu do topo",
    descricao: "Abas do cabeçalho, Área do aluno e botão de visita.",
    previa: "home",
    campos: [
      {
        chave: "itens",
        rotulo: "Abas",
        tipo: "registros",
        titulo: "rotulo",
        novo: "Adicionar aba",
        subcampos: link,
        padrao: registros("menu", [
          { rotulo: "A escola", link: "/#escola", novaAba: false },
          { rotulo: "Ensino", link: "/#ensino", novaAba: false },
          { rotulo: "Vida no Dask", link: "/#vida", novaAba: false },
          { rotulo: "Notícias", link: "/noticias", novaAba: false },
          { rotulo: "Tour 360°", link: "/tour-360", novaAba: false },
          { rotulo: "Trabalhe conosco", link: contato.trabalheConosco, novaAba: true },
        ]),
        ajuda: "Com muitas abas, o menu completo só aparece em telas largas; nas menores fica no botão Menu.",
      },
      { chave: "areaTitulo", rotulo: "Título da lista de acessos", tipo: "texto", padrao: "Área do aluno" },
      {
        chave: "area",
        rotulo: "Acessos (lista “Área do aluno”)",
        tipo: "registros",
        titulo: "rotulo",
        novo: "Adicionar acesso",
        subcampos: link,
        padrao: registros("area", [
          { rotulo: "Diário do Aluno", link: contato.diarioDoAluno, novaAba: true },
          { rotulo: "Prof. Web", link: contato.profWeb, novaAba: true },
          { rotulo: "Central do aluno", link: "/central-do-aluno", novaAba: false },
        ]),
      },
      { chave: "botao", rotulo: "Botão de visita (abre o WhatsApp)", tipo: "texto", padrao: "Agendar visita" },
      { chave: "botaoCelular", rotulo: "Botão de visita no celular", tipo: "texto", padrao: "Agendar visita pelo WhatsApp" },
    ],
  },
  {
    id: "segmentos",
    nome: "Segmentos e coordenação",
    descricao: "Séries, coordenadores, telefones, horários e documentos de cada segmento.",
    previa: "home",
    campos: [
      {
        chave: "lista",
        rotulo: "Segmentos",
        tipo: "registros",
        titulo: "nome",
        novo: "Adicionar segmento",
        subcampos: [
          { chave: "nome", rotulo: "Nome", tipo: "texto" },
          { chave: "series", rotulo: "Séries (uma por linha)", tipo: "textarea" },
          { chave: "resumo", rotulo: "Resumo", tipo: "textarea" },
          { chave: "cargo", rotulo: "Cargo da coordenação", tipo: "texto" },
          { chave: "coordenador", rotulo: "Quem coordena", tipo: "texto" },
          { chave: "telefone", rotulo: "Telefone / WhatsApp", tipo: "telefone" },
          { chave: "horario", rotulo: "Horário de atendimento", tipo: "texto" },
          { chave: "atalhoTexto", rotulo: "Atalho extra · texto (vazio = sem atalho)", tipo: "texto" },
          { chave: "atalhoLink", rotulo: "Atalho extra · endereço", tipo: "link" },
          {
            chave: "documentos",
            rotulo: "Documentos (Central do aluno)",
            tipo: "registros",
            titulo: "nome",
            novo: "Adicionar documento",
            subcampos: [
              { chave: "nome", rotulo: "Nome", tipo: "texto" },
              { chave: "link", rotulo: "Endereço (vazio = “Em breve”)", tipo: "link" },
            ],
          },
        ],
        padrao: segmentos.map((s) => ({
          _id: s.id,
          ativo: true,
          nome: s.nome,
          series: s.series.join("\n"),
          resumo: s.resumo,
          cargo: s.coordenacao.cargo,
          coordenador: s.coordenacao.nome,
          telefone: s.coordenacao.telefone,
          horario: s.coordenacao.horario,
          atalhoTexto: s.id === "fund1" ? "Lista de materiais" : "",
          atalhoLink: s.id === "fund1" ? "/central-do-aluno" : "",
          documentos: registros(`doc-${s.id}`, docsPadrao[s.id]),
        })) as Registro[],
      },
      { chave: "psicoTitulo", rotulo: "Psicologia · título", tipo: "texto", padrao: "Psicologia escolar" },
      { chave: "psicoRotulo", rotulo: "Psicologia · rótulo", tipo: "texto", padrao: "Psicóloga" },
      { chave: "psicoNome", rotulo: "Psicologia · nome (vazio = esconde)", tipo: "texto", padrao: psicologa.nome },
      { chave: "psicoHorario", rotulo: "Psicologia · horários", tipo: "texto", padrao: psicologa.horario },
      { chave: "psicoNota", rotulo: "Psicologia · como agendar", tipo: "texto", padrao: "com agendamento pela secretaria" },
    ],
  },
  {
    id: "central",
    nome: "Central do aluno",
    descricao: "Página com os acessos, os documentos e a coordenação.",
    previa: "central",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Central do aluno" },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "Acessos do dia a dia, documentos de cada segmento e quem procurar na coordenação." },
      {
        chave: "acessos",
        rotulo: "Cartões de acesso",
        tipo: "registros",
        titulo: "titulo",
        novo: "Adicionar cartão",
        subcampos: [
          { chave: "titulo", rotulo: "Título", tipo: "texto" },
          { chave: "texto", rotulo: "Texto", tipo: "texto" },
          { chave: "link", rotulo: "Endereço", tipo: "link" },
        ],
        padrao: registros("acesso", [
          { titulo: "Diário do Aluno", texto: "Notas, frequência e recados da escola.", link: contato.diarioDoAluno },
          { titulo: "Prof. Web", texto: "Acesso dos professores.", link: contato.profWeb },
        ]),
      },
      { chave: "tituloDocumentos", rotulo: "Título dos documentos", tipo: "texto", padrao: "Documentos por segmento", ajuda: "Os documentos de cada segmento ficam em Segmentos e coordenação." },
      { chave: "rotuloArquivo", rotulo: "Rótulo de documento com link", tipo: "texto", padrao: "PDF" },
      { chave: "rotuloEmBreve", rotulo: "Rótulo de documento sem link", tipo: "texto", padrao: "Em breve" },
      { chave: "atendimento", rotulo: "Texto do atendimento", tipo: "texto", padrao: "Ligação ou WhatsApp," },
      { chave: "psicoTexto", rotulo: "Texto da psicologia", tipo: "texto", padrao: "Agende pela secretaria," },
      { chave: "normas", rotulo: "Endereço das normas disciplinares", tipo: "link", padrao: documentos.normas },
      { chave: "voltar", rotulo: "Link de volta", tipo: "texto", padrao: "Voltar para a página inicial" },
    ],
  },
  {
    id: "rodape",
    nome: "Rodapé",
    descricao: "Links, rótulo do telefone e créditos no fim de todas as páginas.",
    previa: "home",
    campos: [
      { chave: "rotuloTelefone", rotulo: "Rótulo do telefone grande", tipo: "texto", padrao: "Secretaria" },
      { chave: "topo", rotulo: "Link “voltar ao topo”", tipo: "texto", padrao: "Voltar ao topo" },
      {
        chave: "links",
        rotulo: "Links (depois das redes sociais)",
        tipo: "registros",
        titulo: "rotulo",
        novo: "Adicionar link",
        subcampos: link,
        padrao: registros("rodape", [
          { rotulo: "Notícias", link: "/noticias", novaAba: false },
          { rotulo: "Central do aluno", link: "/central-do-aluno", novaAba: false },
          { rotulo: "Tour 360°", link: "/tour-360", novaAba: false },
          { rotulo: "Trabalhe conosco", link: contato.trabalheConosco, novaAba: true },
        ]),
      },
      { chave: "creditos", rotulo: "Créditos das fotos", tipo: "texto", padrao: "Fotos: Colégio Dask e SAS Educação" },
    ],
  },
  {
    id: "paginas",
    nome: "Páginas e buscadores",
    descricao: "Títulos das páginas internas e o que aparece no Google.",
    previa: "home",
    campos: [
      { chave: "seoTitulo", rotulo: "Título do site (aba do navegador e Google)", tipo: "texto", padrao: "Colégio Dask · Dracena-SP · Fundamental I ao Ensino Médio" },
      {
        chave: "seoDescricao",
        rotulo: "Descrição para o Google",
        tipo: "textarea",
        padrao: "Escola feita de professores para alunos desde 1996. Ensino Fundamental I, Fundamental II e Ensino Médio em Dracena-SP, com o sistema de ensino SAS.",
      },
      { chave: "noticiasTitulo", rotulo: "Notícias · título", tipo: "texto", padrao: "Acontece no Dask" },
      {
        chave: "noticiasTexto",
        rotulo: "Notícias · texto",
        tipo: "textarea",
        padrao: "{total} notícias desde {ano}, do blog do colégio e das nossas redes.",
        ajuda: "{total} e {ano} são trocados pelo número de notícias e o ano da mais antiga.",
      },
      { chave: "redesTitulo", rotulo: "Notícia · chamada para as redes", tipo: "texto", padrao: "Siga o Dask" },
      {
        chave: "relacionadas",
        rotulo: "Notícia · título das relacionadas",
        tipo: "texto",
        padrao: "Mais de {categoria}",
        ajuda: "{categoria} vira Ensino, Eventos ou “o Dask” (notícias gerais).",
      },
    ],
  },
  {
    id: "tema",
    nome: "Cores e aparência",
    descricao: "Cores principais e cantos arredondados do site todo.",
    previa: "home",
    campos: [
      { chave: "brand", rotulo: "Cor de destaque (botões)", tipo: "cor", padrao: "#54d4bf" },
      { chave: "field", rotulo: "Azul-escuro (fundos escuros e rodapé)", tipo: "cor", padrao: "#183e6d", ajuda: "O texto sobre essa cor é claro: escolha um tom escuro." },
      { chave: "tint", rotulo: "Fundo verde-claro das seções", tipo: "cor", padrao: "#dcf3ee" },
      { chave: "background", rotulo: "Fundo da página", tipo: "cor", padrao: "#f4f8f8" },
      { chave: "foreground", rotulo: "Cor do texto", tipo: "cor", padrao: "#0e2944", ajuda: "Precisa de contraste alto com o fundo da página." },
      { chave: "sky", rotulo: "Azul dos realces e do foco", tipo: "cor", padrao: "#196ca0" },
      { chave: "raio", rotulo: "Cantos arredondados", tipo: "numero", padrao: 14, min: 0, max: 32, unidade: "px" },
    ],
  },
]

export const grupoPorId = Object.fromEntries(grupos.map((g) => [g.id, g])) as Record<IdGrupo, Grupo>
