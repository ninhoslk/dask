// O que o painel pode editar na home: cada seção, seus campos e o texto atual
// como valor padrão. O banco guarda só a ordem, a visibilidade e os campos
// alterados; o que faltar cai no padrão daqui. Assim o site funciona igual
// sem banco (build local, Supabase fora do ar).

import { conquistas, linhaDoTempo, parceiros } from "@/lib/site"

export type Imagem = { src: string; alt: string }
export type Item = { titulo: string; texto: string }
export type Opcao = { valor: string; rotulo: string }

// Campos de um registro (um cartão, um item de menu, uma coordenação...).
// Um registro pode ter uma lista de registros dentro (um nível só).
export type Subcampo =
  | { chave: string; rotulo: string; tipo: "texto" | "textarea" | "link" | "telefone"; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "simnao"; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "escolha"; opcoes: Opcao[]; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagem"; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "registros"; subcampos: Subcampo[]; titulo: string; novo: string; ajuda?: string }

/** `_id` estável (para arrastar e duplicar) e `ativo` (desligar sem apagar). */
export type Registro = { _id: string; ativo: boolean } & { [chave: string]: string | boolean | Imagem | Registro[] }

export type Campo =
  | { chave: string; rotulo: string; tipo: "texto"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "textarea"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "link"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "cor"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "numero"; padrao: number; min: number; max: number; unidade?: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "escolha"; padrao: string; opcoes: Opcao[]; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagem"; padrao: Imagem; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagens"; padrao: Imagem[]; fixo?: boolean; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "lista"; padrao: string[]; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "itens"; padrao: Item[]; rotulos?: [string, string]; ajuda?: string }
  | {
      chave: string
      rotulo: string
      tipo: "registros"
      padrao: Registro[]
      subcampos: Subcampo[]
      /** subcampo usado como nome do registro na lista */
      titulo: string
      /** texto do botão de adicionar */
      novo: string
      ajuda?: string
    }

export type Valor = string | number | Imagem | Imagem[] | string[] | Item[] | Registro[]

// Declaração de um campo como escrita aqui embaixo: igual a Campo, mas aceita
// as listas como somente leitura (é assim que o TypeScript guarda os literais).
type CampoDecl =
  | { chave: string; rotulo: string; tipo: "texto" | "textarea" | "link"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "escolha"; padrao: string; opcoes: readonly Opcao[]; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagem"; padrao: Imagem; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagens"; padrao: readonly Imagem[]; fixo?: boolean; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "lista"; padrao: readonly string[]; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "itens"; padrao: readonly Item[]; rotulos?: readonly [string, string]; ajuda?: string }

type SecaoDecl = {
  id: IdSecao
  nome: string
  descricao: string
  fixa?: boolean
  unica?: boolean
  extra?: boolean
  campos: readonly CampoDecl[]
}

/** Guarda o nome e o tipo de cada campo no tipo da seção (para `ConteudoDe`), sem mudar o objeto. */
function secao<const S extends SecaoDecl>(s: S): S {
  return s
}

export type TipoSecao = {
  id: IdSecao
  nome: string
  descricao: string
  /** a abertura fica sempre no topo: não arrasta, não some, não sai */
  fixa?: boolean
  /** só pode existir uma na página (tem âncora no menu ou efeito próprio) */
  unica?: boolean
  /** não entra sozinha na home: só pelo botão "Adicionar seção" */
  extra?: boolean
  campos: Campo[]
}

export type IdSecao =
  | "abertura"
  | "apresentacao"
  | "escola"
  | "ensino"
  | "metodo"
  | "robotica"
  | "conquistas"
  | "noticias"
  | "contato"
  | "bloco"
  | "chamada"

const quebra = "Use Enter para quebrar a linha do título."

export const fundos = [
  { valor: "claro", rotulo: "Claro" },
  { valor: "tinta", rotulo: "Verde-claro" },
  { valor: "escuro", rotulo: "Azul-escuro" },
] as const

const acoesDoBotao = [
  { valor: "link", rotulo: "Abrir um endereço" },
  { valor: "whatsapp", rotulo: "Abrir o WhatsApp da secretaria" },
] as const

/** Monta registros padrão com `_id` fixo, para o padrão nunca mudar de id. */
export function registros(prefixo: string, lista: Record<string, string | boolean | Imagem | Registro[]>[]): Registro[] {
  return lista.map((r, i) => ({ _id: `${prefixo}-${i + 1}`, ativo: true, ...r }) as Registro)
}

const definicoes = [
  secao({
    id: "abertura",
    nome: "Abertura em vídeo",
    descricao: "Voo de drone controlado pela rolagem, com três textos.",
    fixa: true,
    campos: [
      { chave: "titulo1", rotulo: "Título de abertura", tipo: "textarea", padrao: "Evoluir\npara transformar.", ajuda: quebra },
      { chave: "texto1", rotulo: "Texto de abertura", tipo: "textarea", padrao: "Colégio Dask, em Dracena-SP: do Fundamental I ao Ensino Médio." },
      { chave: "titulo2", rotulo: "Título do meio", tipo: "textarea", padrao: "Uma escola feita de\nprofessores para alunos.", ajuda: quebra },
      { chave: "texto2", rotulo: "Texto do meio", tipo: "textarea", padrao: "Desde 1996, com mais de 700 alunos e o sistema de ensino SAS." },
      { chave: "titulo3", rotulo: "Título de chegada", tipo: "textarea", padrao: "A porta está\naberta.", ajuda: quebra },
      { chave: "texto3", rotulo: "Texto de chegada", tipo: "textarea", padrao: "Agende uma visita e conheça a escola por dentro." },
      { chave: "botao", rotulo: "Botão", tipo: "texto", padrao: "Agende uma visita" },
    ],
  }),
  secao({
    id: "apresentacao",
    nome: "Apresentação",
    descricao: "Frase, números e faixa de fotos logo após a abertura.",
    unica: true,
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Do 1º ano ao vestibular, em Dracena." },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "Fundamental I, Fundamental II e Ensino Médio, com o sistema de ensino SAS e a plataforma de leitura Árvore." },
      { chave: "botao", rotulo: "Botão (abre o WhatsApp)", tipo: "texto", padrao: "Agende uma visita" },
      { chave: "link2Texto", rotulo: "Segundo link · texto", tipo: "texto", padrao: "Ver séries e turnos" },
      { chave: "link2", rotulo: "Segundo link · destino", tipo: "link", padrao: "#ensino" },
      {
        chave: "destaques",
        rotulo: "Números",
        tipo: "itens",
        rotulos: ["Número", "Legenda"],
        padrao: [
          { titulo: "1996", texto: "fundado por professores" },
          { titulo: "+700", texto: "alunos do 1º ano ao 3º médio" },
          { titulo: "SAS", texto: "sistema de ensino em todas as séries" },
        ],
      },
      {
        chave: "faixa",
        rotulo: "Faixa de fotos",
        tipo: "imagens",
        padrao: [
          { src: "/fotos/natal-coral.jpg", alt: "Coral de Natal do Fundamental I" },
          { src: "/fotos/robotica-equipe.jpg", alt: "Equipe de robótica com o troféu" },
          { src: "/fotos/teatro-mae-natureza.jpg", alt: "Peça Mãe Natureza da Escolinha de Teatro" },
          { src: "/fotos/ciencia-colecao.jpg", alt: "Alunos observando uma coleção de insetos" },
          { src: "/fotos/volei-quadra.jpg", alt: "Jogo de vôlei feminino na quadra do Dask" },
          { src: "/fotos/alunas-camiseta.jpg", alt: "Alunas deitadas sobre a camiseta do Dask" },
          { src: "/fotos/visita-unesp.jpg", alt: "Turma do Ensino Médio em visita à UNESP" },
          { src: "/fotos/formatura-abraco.jpg", alt: "Aluno recebendo flores na Aula da Saudade" },
          { src: "/fotos/acantonamento.jpg", alt: "Turma reunida no acantonamento" },
          { src: "/fotos/certificado.jpg", alt: "Aluna recebendo certificado de olimpíada" },
        ],
      },
    ],
  }),
  secao({
    id: "escola",
    nome: "A escola",
    descricao: "Quem somos, fotos e a linha do tempo.",
    unica: true,
    campos: [
      { chave: "destaque", rotulo: "Início em negrito", tipo: "texto", padrao: "O Colégio Dask" },
      { chave: "paragrafo1", rotulo: "Primeiro parágrafo", tipo: "textarea", padrao: "nasceu da ideia de um grupo de professores de Dracena. Ensinar, para nós, é revelar o talento de cada aluno." },
      { chave: "paragrafo2", rotulo: "Segundo parágrafo", tipo: "textarea", padrao: "Hoje são mais de 700 alunos, do Fundamental I ao Médio. O nome mudou em 2022; a ideia continua: evoluir para transformar." },
      { chave: "desde", rotulo: "Ano de fundação (“Desde”)", tipo: "texto", padrao: "1996" },
      { chave: "rotuloOnde", rotulo: "Rótulo “Onde”", tipo: "texto", padrao: "Onde", ajuda: "O bairro e a cidade vêm de Informações do site → Identidade." },
      { chave: "rotuloDesde", rotulo: "Rótulo “Desde”", tipo: "texto", padrao: "Desde" },
      { chave: "rotuloSecretaria", rotulo: "Rótulo do telefone", tipo: "texto", padrao: "Secretaria", ajuda: "O número vem de Informações do site → Contatos." },
      { chave: "botao", rotulo: "Botão de visita (abre o WhatsApp)", tipo: "texto", padrao: "Agendar visita" },
      { chave: "linkTour", rotulo: "Link do tour · texto (vazio = sem link)", tipo: "texto", padrao: "Conheça a escola no Tour 360°" },
      { chave: "retrato", rotulo: "Foto no início do texto", tipo: "imagem", padrao: { src: "/fotos/professoras.jpg", alt: "Duas professoras do Colégio Dask com a camiseta da escola" } },
      {
        chave: "fotos",
        rotulo: "Fotos (1 grande e 2 quadradas)",
        tipo: "imagens",
        fixo: true,
        padrao: [
          { src: "/fotos/formandos.jpg", alt: "Formandos do Colégio Dask reunidos no palco" },
          { src: "/fotos/makernificos.jpg", alt: "Equipe de robótica Makerníficos com professores" },
          { src: "/fotos/patio-turma.jpg", alt: "Alunos do Fundamental posando na quadra de areia" },
        ],
      },
      { chave: "tituloHistoria", rotulo: "Título da linha do tempo", tipo: "texto", padrao: "Nossa história" },
      {
        chave: "historia",
        rotulo: "Linha do tempo",
        tipo: "itens",
        rotulos: ["Ano", "Acontecimento"],
        padrao: linhaDoTempo.map((l) => ({ titulo: l.ano, texto: l.texto })),
      },
    ],
  }),
  secao({
    id: "ensino",
    nome: "Ensino e coordenação",
    descricao: "Seletor de série e cartões dos segmentos com as coordenações.",
    unica: true,
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "textarea", padrao: "Séries, horários\ne coordenação.", ajuda: quebra },
      { chave: "pergunta", rotulo: "Pergunta do seletor", tipo: "texto", padrao: "Em que série seu filho vai estudar?", ajuda: "Segmentos, séries, coordenadores e telefones ficam em Informações do site → Segmentos e coordenação." },
      { chave: "placeholder", rotulo: "Texto do seletor vazio", tipo: "texto", padrao: "Selecionar série" },
      { chave: "rotuloSeries", rotulo: "Cartão · “Séries”", tipo: "texto", padrao: "Séries" },
      { chave: "rotuloCoordenacao", rotulo: "Cartão · “Coordenação”", tipo: "texto", padrao: "Coordenação" },
      { chave: "rotuloAtendimento", rotulo: "Cartão · “Atendimento”", tipo: "texto", padrao: "Atendimento" },
      { chave: "rotuloHorario", rotulo: "Cartão · “Horário”", tipo: "texto", padrao: "Horário" },
      { chave: "botao", rotulo: "Botão de visita", tipo: "texto", padrao: "Agendar visita" },
      { chave: "botaoSerie", rotulo: "Botão de visita com a série", tipo: "texto", padrao: "Agendar visita para {serie}", ajuda: "{serie} vira “o 1º ano”, “a 2ª série”…" },
      {
        chave: "mensagemSegmento",
        rotulo: "Mensagem do WhatsApp (sem série escolhida)",
        tipo: "textarea",
        padrao: "Olá! Gostaria de agendar uma visita ao Colégio Dask para conhecer o {segmento}.",
      },
      {
        chave: "mensagemSerie",
        rotulo: "Mensagem do WhatsApp (com a série)",
        tipo: "textarea",
        padrao: "Olá! Gostaria de agendar uma visita ao Colégio Dask. Meu filho(a) vai cursar {serie}.",
      },
      { chave: "nota", rotulo: "Nota no fim", tipo: "textarea", padrao: "Normas, listas de material e documentos de cada segmento ficam na" },
      { chave: "notaLink", rotulo: "Nota · texto do link", tipo: "texto", padrao: "Central do aluno" },
      { chave: "normasTexto", rotulo: "Link das normas · texto", tipo: "texto", padrao: "Normas disciplinares", ajuda: "O endereço das normas fica em Informações do site → Central do aluno." },
    ],
  }),
  secao({
    id: "metodo",
    nome: "Método (SAS e Árvore)",
    descricao: "Os dois parceiros pedagógicos, com logo e link.",
    unica: true,
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Aprender fazendo, com método." },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "O professor orienta, o aluno põe a mão na massa. Por trás disso estão dois parceiros presentes no dia a dia do Dask." },
      { chave: "sasLink", rotulo: "SAS · site", tipo: "link", padrao: parceiros.sas },
      { chave: "sasBotao", rotulo: "SAS · botão", tipo: "texto", padrao: "Ver mais sobre o SAS" },
      { chave: "arvoreLink", rotulo: "Árvore · site", tipo: "link", padrao: parceiros.arvore },
      { chave: "arvoreBotao", rotulo: "Árvore · botão", tipo: "texto", padrao: "Ver mais sobre a Árvore" },
      { chave: "sasTitulo", rotulo: "SAS · título", tipo: "texto", padrao: "Sistema de ensino SAS em todas as séries" },
      {
        chave: "sasItens",
        rotulo: "SAS · tópicos",
        tipo: "itens",
        padrao: [
          { titulo: "Livros revistos todo ano", texto: "Material didático alinhado à BNCC e atualizado anualmente por especialistas." },
          { titulo: "Trilhas digitais", texto: "Exercícios e gamificação que continuam a aula do livro no ritmo de cada aluno." },
          { titulo: "Avaliações que mostram o caminho", texto: "Relatórios de desempenho apontam o que revisar, para o professor e para a família." },
          { titulo: "Simulados e olimpíadas", texto: "Provas no formato do Enem e dos vestibulares e preparação para olimpíadas científicas." },
        ],
      },
      {
        chave: "sasFotos",
        rotulo: "SAS · fotos (1 grande e 2 quadradas)",
        tipo: "imagens",
        fixo: true,
        padrao: [
          { src: "/fotos/sas-turma.jpg", alt: "Estudantes resolvendo exercícios juntos em sala de aula" },
          { src: "/fotos/realidade-virtual.jpg", alt: "Aluno do Dask usando óculos de realidade virtual em aula" },
          { src: "/fotos/sas-maker.jpg", alt: "Estudantes montando um projeto de cultura maker" },
        ],
      },
      { chave: "arvoreTitulo", rotulo: "Árvore · título", tipo: "texto", padrao: "Leitura todo dia, com a Árvore" },
      { chave: "arvoreTexto", rotulo: "Árvore · texto", tipo: "textarea", padrao: "Nas aulas de Língua Portuguesa, os alunos usam a Árvore, programa de formação leitora com o maior acervo do mercado." },
      {
        chave: "arvoreItens",
        rotulo: "Árvore · tópicos",
        tipo: "itens",
        padrao: [
          { titulo: "Um livro para cada leitor", texto: "A plataforma recomenda livros no nível e no interesse de cada aluno, no digital e no papel." },
          { titulo: "Leitura acompanhada", texto: "O professor vê o retrato de cada aluno e turma e sabe quando indicar e intervir." },
          { titulo: "Hábito que cresce", texto: "A cada leitura a Floresta cresce; missões e conquistas mantêm o ritmo ao longo do ano." },
        ],
      },
      {
        chave: "arvoreFotos",
        rotulo: "Árvore · fotos (1 grande e 2 quadradas)",
        tipo: "imagens",
        fixo: true,
        padrao: [
          { src: "/fotos/arvore-sala.jpg", alt: "Alunos do Dask lendo na plataforma Árvore durante a aula de Língua Portuguesa" },
          { src: "/fotos/arvore-notebook.jpg", alt: "Notebook aberto na biblioteca digital da Árvore" },
          { src: "/fotos/arvore-leitura.jpg", alt: "Estudante lendo um livro com metas de leitura da Árvore" },
        ],
      },
    ],
  }),
  secao({
    id: "robotica",
    nome: "Robótica",
    descricao: "A foto dos Makerníficos que se aproxima com a rolagem.",
    unica: true,
    campos: [
      { chave: "titulo1", rotulo: "Primeira linha", tipo: "texto", padrao: "Robótica é aula" },
      { chave: "titulo2", rotulo: "Segunda linha", tipo: "texto", padrao: "com pódio." },
      { chave: "foto", rotulo: "Foto", tipo: "imagem", padrao: { src: "/fotos/robotica-bandeira.jpg", alt: "Equipe Makerníficos do Colégio Dask com a bandeira e as medalhas" } },
    ],
  }),
  secao({
    id: "conquistas",
    nome: "Conquistas",
    descricao: "A frase lida palavra por palavra com a rolagem.",
    unica: true,
    campos: [
      { chave: "inicio", rotulo: "Início da frase", tipo: "texto", padrao: "Nossos alunos estiveram" },
      { chave: "lista", rotulo: "Onde estiveram", tipo: "lista", padrao: conquistas, ajuda: "Cada linha com a preposição: “na UNESP”, “no Simulado FUVEST”." },
    ],
  }),
  secao({
    id: "noticias",
    nome: "Notícias",
    descricao: "Destaque e últimas notícias. As notícias em si ficam na aba Notícias.",
    unica: true,
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Acontece no Dask" },
      { chave: "link", rotulo: "Link para todas", tipo: "texto", padrao: "Todas as notícias" },
    ],
  }),
  secao({
    id: "contato",
    nome: "Contato e localização",
    descricao: "Convite para visita, contatos, fachada e mapa.",
    unica: true,
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Venha nos visitar" },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "Conheça as salas, o laboratório, a quadra e as pessoas que vão acompanhar seu filho." },
      { chave: "pergunta", rotulo: "Pergunta acima dos contatos", tipo: "texto", padrao: "Como prefere falar com a gente?", ajuda: "WhatsApp, e-mail, endereço e horário vêm de Informações do site → Contatos." },
      { chave: "rotuloWhatsapp", rotulo: "Rótulo do WhatsApp", tipo: "texto", padrao: "WhatsApp" },
      { chave: "foto", rotulo: "Foto pequena", tipo: "imagem", padrao: { src: "/fotos/campus.jpg", alt: "Alunos no gramado do campus do Colégio Dask" } },
      { chave: "tituloLocal", rotulo: "Título da localização", tipo: "texto", padrao: "Onde estamos" },
      { chave: "botaoMapa", rotulo: "Botão do mapa", tipo: "texto", padrao: "Como chegar" },
      { chave: "fachada", rotulo: "Foto da fachada", tipo: "imagem", padrao: { src: "/fotos/fachada.jpg", alt: "Vista aérea da fachada do Colégio Dask, com a praça das palmeiras na entrada" } },
    ],
  }),
  // ---- seções que a equipe acrescenta (podem se repetir) ----
  secao({
    id: "bloco",
    nome: "Texto e imagem",
    descricao: "Título, texto, foto e um botão, lado a lado.",
    extra: true,
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "textarea", padrao: "Título da seção", ajuda: quebra },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "Escreva aqui o texto da seção." },
      { chave: "imagem", rotulo: "Foto", tipo: "imagem", padrao: { src: "/fotos/campus.jpg", alt: "Alunos no gramado do campus do Colégio Dask" } },
      { chave: "lado", rotulo: "Foto de que lado", tipo: "escolha", padrao: "direita", opcoes: [{ valor: "direita", rotulo: "Direita" }, { valor: "esquerda", rotulo: "Esquerda" }] },
      { chave: "botaoTexto", rotulo: "Botão · texto (vazio = sem botão)", tipo: "texto", padrao: "" },
      { chave: "botaoAcao", rotulo: "Botão · ação", tipo: "escolha", padrao: "link", opcoes: acoesDoBotao },
      { chave: "botaoLink", rotulo: "Botão · endereço", tipo: "link", padrao: "/central-do-aluno" },
      { chave: "fundo", rotulo: "Fundo", tipo: "escolha", padrao: "claro", opcoes: fundos },
    ],
  }),
  secao({
    id: "chamada",
    nome: "Chamada com botão",
    descricao: "Uma frase grande e um botão, para avisos e convites.",
    extra: true,
    campos: [
      { chave: "titulo", rotulo: "Frase", tipo: "textarea", padrao: "Matrículas abertas.", ajuda: quebra },
      { chave: "texto", rotulo: "Texto de apoio", tipo: "textarea", padrao: "" },
      { chave: "botaoTexto", rotulo: "Botão · texto (vazio = sem botão)", tipo: "texto", padrao: "Fale com a secretaria" },
      { chave: "botaoAcao", rotulo: "Botão · ação", tipo: "escolha", padrao: "whatsapp", opcoes: acoesDoBotao },
      { chave: "botaoLink", rotulo: "Botão · endereço", tipo: "link", padrao: "/" },
      { chave: "fundo", rotulo: "Fundo", tipo: "escolha", padrao: "escuro", opcoes: fundos },
    ],
  }),
] as const

// Em tempo de execução é a mesma lista; o tipo largo (Campo) é o que o painel usa.
export const secoes = definicoes as unknown as TipoSecao[]

type Definicao = (typeof definicoes)[number]
type ValorDoTipo<T> = T extends "texto" | "textarea" | "link" | "escolha"
  ? string
  : T extends "imagem"
    ? Imagem
    : T extends "imagens"
      ? Imagem[]
      : T extends "lista"
        ? string[]
        : T extends "itens"
          ? Item[]
          : never

/**
 * O conteúdo já resolvido de uma seção, com cada campo pelo nome e tipo
 * declarados aqui: `c.sasTitulo` é string, `c.sasFotos` é Imagem[]. Um nome
 * errado vira erro de compilação, e não texto vazio no site.
 */
export type ConteudoDe<Id extends IdSecao> = {
  [E in Extract<Definicao, { id: Id }>["campos"][number] as E["chave"]]: ValorDoTipo<E["tipo"]>
}

// confere, em tempo de compilação, que toda seção de IdSecao foi declarada
type Faltando = Exclude<IdSecao, Definicao["id"]>
const _todasDeclaradas: Faltando extends never ? true : Faltando = true
void _todasDeclaradas

export const tipoDaSecao = Object.fromEntries(secoes.map((s) => [s.id, s])) as Record<IdSecao, TipoSecao>

/** As seções que formam a home quando nada foi editado (as que não são extras). */
export const secoesPadrao = secoes.filter((s) => !s.extra)
