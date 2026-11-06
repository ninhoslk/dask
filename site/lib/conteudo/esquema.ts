// O que o painel pode editar na home: cada seção, seus campos e o texto atual
// como valor padrão. O banco guarda só a ordem, a visibilidade e os campos
// alterados; o que faltar cai no padrão daqui. Assim o site funciona igual
// sem banco (build local, Supabase fora do ar).

import { conquistas, linhaDoTempo } from "@/lib/site"

export type Imagem = { src: string; alt: string }
export type Item = { titulo: string; texto: string }

export type Campo =
  | { chave: string; rotulo: string; tipo: "texto"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "textarea"; padrao: string; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagem"; padrao: Imagem; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "imagens"; padrao: Imagem[]; fixo?: boolean; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "lista"; padrao: string[]; ajuda?: string }
  | { chave: string; rotulo: string; tipo: "itens"; padrao: Item[]; rotulos?: [string, string]; ajuda?: string }

export type Valor = string | Imagem | Imagem[] | string[] | Item[]

export type TipoSecao = {
  id: IdSecao
  nome: string
  descricao: string
  /** a abertura fica sempre no topo: não arrasta nem some */
  fixa?: boolean
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

const quebra = "Use Enter para quebrar a linha do título."

export const secoes: TipoSecao[] = [
  {
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
  },
  {
    id: "apresentacao",
    nome: "Apresentação",
    descricao: "Frase, números e faixa de fotos logo após a abertura.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Do 1º ano ao vestibular, em Dracena." },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "Fundamental I, Fundamental II e Ensino Médio, com o sistema de ensino SAS e a plataforma de leitura Árvore." },
      { chave: "botao", rotulo: "Botão", tipo: "texto", padrao: "Agende uma visita" },
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
  },
  {
    id: "escola",
    nome: "A escola",
    descricao: "Quem somos, fotos e a linha do tempo.",
    campos: [
      { chave: "destaque", rotulo: "Início em negrito", tipo: "texto", padrao: "O Colégio Dask" },
      { chave: "paragrafo1", rotulo: "Primeiro parágrafo", tipo: "textarea", padrao: "nasceu da ideia de um grupo de professores de Dracena. Ensinar, para nós, é revelar o talento de cada aluno." },
      { chave: "paragrafo2", rotulo: "Segundo parágrafo", tipo: "textarea", padrao: "Hoje são mais de 700 alunos, do Fundamental I ao Médio. O nome mudou em 2022; a ideia continua: evoluir para transformar." },
      { chave: "desde", rotulo: "Ano de fundação (“Desde”)", tipo: "texto", padrao: "1996" },
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
  },
  {
    id: "ensino",
    nome: "Ensino e coordenação",
    descricao: "Seletor de série, segmentos e telefones das coordenações.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "textarea", padrao: "Do primeiro ano\nao vestibular.", ajuda: quebra },
      { chave: "pergunta", rotulo: "Pergunta do seletor", tipo: "texto", padrao: "Em que série seu filho vai estudar?" },
      { chave: "foto", rotulo: "Foto", tipo: "imagem", padrao: { src: "/fotos/laboratorio.jpg", alt: "Alunos do Fundamental observando experimentos no laboratório" } },
    ],
  },
  {
    id: "metodo",
    nome: "Método (SAS e Árvore)",
    descricao: "Os dois parceiros pedagógicos, com logo e link.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Aprender fazendo, com método." },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "O professor orienta, o aluno põe a mão na massa. Por trás disso estão dois parceiros presentes no dia a dia do Dask." },
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
  },
  {
    id: "robotica",
    nome: "Robótica",
    descricao: "A foto dos Makerníficos que se aproxima com a rolagem.",
    campos: [
      { chave: "titulo1", rotulo: "Primeira linha", tipo: "texto", padrao: "Robótica é aula" },
      { chave: "titulo2", rotulo: "Segunda linha", tipo: "texto", padrao: "com pódio." },
      { chave: "foto", rotulo: "Foto", tipo: "imagem", padrao: { src: "/fotos/robotica-bandeira.jpg", alt: "Equipe Makerníficos do Colégio Dask com a bandeira e as medalhas" } },
    ],
  },
  {
    id: "conquistas",
    nome: "Conquistas",
    descricao: "A frase lida palavra por palavra com a rolagem.",
    campos: [
      { chave: "inicio", rotulo: "Início da frase", tipo: "texto", padrao: "Nossos alunos estiveram" },
      { chave: "lista", rotulo: "Onde estiveram", tipo: "lista", padrao: conquistas, ajuda: "Cada linha com a preposição: “na UNESP”, “no Simulado FUVEST”." },
    ],
  },
  {
    id: "noticias",
    nome: "Notícias",
    descricao: "Destaque e últimas notícias. As notícias em si ficam na aba Notícias.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Acontece no Dask" },
      { chave: "link", rotulo: "Link para todas", tipo: "texto", padrao: "Todas as notícias" },
    ],
  },
  {
    id: "contato",
    nome: "Contato e localização",
    descricao: "Convite para visita, contatos, fachada e mapa.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto", padrao: "Venha nos visitar" },
      { chave: "texto", rotulo: "Texto", tipo: "textarea", padrao: "Conheça as salas, o laboratório, a quadra e as pessoas que vão acompanhar seu filho." },
      { chave: "foto", rotulo: "Foto pequena", tipo: "imagem", padrao: { src: "/fotos/campus.jpg", alt: "Alunos no gramado do campus do Colégio Dask" } },
      { chave: "tituloLocal", rotulo: "Título da localização", tipo: "texto", padrao: "Onde estamos" },
      { chave: "fachada", rotulo: "Foto da fachada", tipo: "imagem", padrao: { src: "/fotos/fachada.jpg", alt: "Vista aérea da fachada do Colégio Dask, com a praça das palmeiras na entrada" } },
    ],
  },
]

export const tipoDaSecao = Object.fromEntries(secoes.map((s) => [s.id, s])) as Record<IdSecao, TipoSecao>
