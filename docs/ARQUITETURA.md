# Arquitetura

Projeto Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 e shadcn/ui
(estilo `radix-nova`, base Radix, ícones `lucide`). As páginas públicas são
pré-renderizadas no build. O conteúdo editável da home, as notícias e o tour 360°
vêm do **Supabase** (ver [PAINEL.md](PAINEL.md)); sem banco, o site usa os textos
padrão e `lib/noticias-todas.json`.

## SEO

Tudo parte de `NEXT_PUBLIC_SITE_URL` (`lib/seo.tsx`): `metadataBase`, URLs
canônicas, `app/sitemap.ts`, `app/robots.ts` e os dados estruturados. **Ao trocar o
domínio, basta mudar essa variável na Vercel e publicar de novo.**

- Open Graph e Twitter: `public/og.jpg` (recorte 1200×630 da foto aérea real da fachada); notícias usam a própria capa.
- JSON-LD: `School` na home e `NewsArticle` em cada notícia.
- `robots.txt` bloqueia `/admin`.

## Mapa de arquivos de `site/`

```
site/
├── app/
│   ├── layout.tsx                  fonte, metadados, skip link, <Motion />
│   ├── page.tsx                    home: ordem das seções
│   ├── globals.css                 tokens, utilitários e CSS de TODAS as animações
│   └── central-do-aluno/page.tsx   página de acessos e documentos
├── components/
│   ├── motion.tsx                  revela [data-reveal] ao rolar
│   ├── site-header.tsx             cabeçalho (tom "escuro" | "claro")
│   ├── site-footer.tsx             rodapé azul-marinho com o telefone gigante
│   ├── sections/
│   │   ├── hero-cinematico.tsx     abertura: scroll controla o voo do drone (canvas)
│   │   ├── hero.tsx                exporta <Apresentacao />: frase, números, faixa de fotos
│   │   ├── faixa-fotos.tsx         faixa de fotos que corre sozinha (CSS)
│   │   ├── escola.tsx              história, colagem de fotos, linha do tempo
│   │   ├── ensino.tsx              seletor de série + tabela de segmentos e coordenações
│   │   ├── metodo.tsx              SAS Educação e Árvore, com logos e fotos
│   │   ├── showcase.tsx            "Robótica é aula com pódio", zoom pelo scroll
│   │   ├── vida.tsx                "Vida no Dask": fotos soltas sobre fundo teal
│   │   ├── conquistas.tsx          frase com nomes que acendem pelo scroll
│   │   ├── noticias.tsx            1 destaque + 4 notícias reais do blog
│   │   └── contato.tsx             convite à visita, WhatsApp, e-mail, faixa de fotos
│   └── ui/                         shadcn: button, dropdown-menu, select, sheet, tabs, toggle, toggle-group
├── lib/
│   ├── site.ts                     dados institucionais (ver CONTEUDO.md)
│   ├── noticias.json               9 notícias importadas do WordPress do colégio
│   ├── hero-cinematico.ts          configuração da abertura (frames, altura, textos)
│   └── utils.ts                    cn()
├── public/
│   ├── fotos/                      fotos reais (Dask e SAS/Árvore), já redimensionadas
│   ├── hero/                       frames WebP do vídeo (desktop/, mobile/) e posters
│   ├── logos/                      sas.png, arvore.svg
│   ├── noticias/                   capa de cada notícia
│   ├── logo-dask.png               logo teal (fundo claro)
│   ├── logo-dask-branco.png        logo branco (sobre vídeo/foto)
│   └── favicon.png
├── components.json                 configuração do shadcn
├── next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs, .prettierrc
├── .vercelignore
└── .taste-skill/direction.json     a "folha de direção" sorteada pela skill de design
```

## Como a home é montada (`app/page.tsx`)

Ordem das seções e o que cada uma faz:

| # | Componente | Cor de fundo | Função |
| --- | --- | --- | --- |
| 1 | `HeroCinematico` | vídeo (canvas) sobre `--field` | Abertura em tela cheia. Três textos entram e saem conforme o scroll. |
| 2 | `Apresentacao` | `bg-tint` (verde-água claro) | Frase, botão de visita, números (1996 / +700 / SAS) e faixa de fotos |
| 3 | `Escola` | `--background`, faixa `bg-field` | Quem é o Dask, fotos, linha do tempo 1995–2022 |
| 4 | `Ensino` | `bg-tint` | Seletor "Em que série seu filho vai estudar?" e tabela dos 3 segmentos + psicologia |
| 5 | `Metodo` | `bg-field` (azul-marinho) | SAS Educação e Árvore, ambos integrados ao "aprender fazendo" |
| 6 | `Showcase` | `--background` | Robótica: foto dos Makerníficos com zoom pelo scroll |
| 7 | `Vida` | `bg-brand` (teal) | Fotos soltas "caídas" sobre o título; ficam retas ao passar o mouse |
| 8 | `Conquistas` | `bg-field` | Frase pinned; o nome atual acende em teal conforme o scroll |
| 9 | `Noticias` | `--background` | Blog real; cada item abre no site da escola |
| 10 | `Contato` | `bg-tint` | Faixa de fotos reversa, convite, WhatsApp e e-mail |
| — | `SiteFooter` | `bg-field` | Endereço, razão social, mantenedora, CNPJ, telefone da secretaria |

Âncoras de navegação: `#escola`, `#ensino`, `#metodo`, `#vida`, `#noticias`, `#contato`
(o menu usa `/#escola`, `/#ensino`, `/#vida`, `/#noticias` para funcionar também
a partir da Central do aluno).

## Cabeçalho (`site-header.tsx`)

- Props: `tom?: "escuro" | "claro"`. `claro` troca o logo para o branco e o texto para branco (usado sobre o vídeo).
- Desktop (`lg`): links, menu "Área do aluno" (Diário do Aluno, Prof. Web, Central do aluno) e botão "Agendar visita".
- Celular: botão "Menu" abre um `Sheet` com os mesmos itens e o botão do WhatsApp.
- Botão "Agendar visita" abre o WhatsApp da secretaria com mensagem pronta (`whatsappLink(mensagemVisita)` em `lib/site.ts`).

## Seletor de série (`ensino.tsx`)

Componente cliente. O estado é a série escolhida (`useState`). Ao escolher:
descobre o segmento (`segmentos.find(s => s.series.includes(serie))`), mostra
quem coordena, o horário de atendimento e um botão para o WhatsApp **com a série
escrita na mensagem**; para o Fundamental I também mostra o atalho para a lista de
material. A tabela ao lado apaga (opacidade 35%) os segmentos que não são o da
série escolhida. O `aria-live="polite"` anuncia a mudança.

## Central do aluno (`app/central-do-aluno/page.tsx`)

Página de servidor (estática) com três cartões de acesso (Diário do Aluno,
Prof. Web, Trabalhe conosco), `Tabs` por segmento com os documentos e um cartão
com a coordenação. Documentos com URL do Google Drive aparecem como "PDF";
os sem URL aparecem como "Em breve", igual ao site original. Os links do
Fundamental I (lista de material 2026, 8 arquivos) e das "Normas disciplinares"
são reais.

## Fonte, tema e acessibilidade global

- Fonte: `Schibsted_Grotesk` via `next/font/google` (pesos 400, 600, 800), exposta como `--font-sans`.
- Não há modo escuro. O tema único está em `globals.css` (`:root`); o bloco `.dark` do template foi removido (a diretiva `@custom-variant dark` ainda está no topo do arquivo, sem uso, porque os componentes shadcn trazem classes `dark:`).
- Skip link "Pular para o conteúdo" aponta para `#conteudo` (o `<main>`).
- `prefers-reduced-motion` é tratado no CSS (regra global ao fim de `globals.css`) e, na abertura, no componente.
- Alvos de toque com `touch-action: manipulation`; `overflow-x: clip` no `body`.
- `lang="pt-BR"`.

## Tipos e dados

`lib/site.ts` exporta tipos `Coordenacao` e `Segmento` e as constantes `contato`,
`segmentos`, `psicologa`, `linhaDoTempo`, `conquistas`, `documentos`, `navegacao`,
além das funções `whatsappLink(mensagem)` e da constante `mensagemVisita`.
`lib/noticias.json` é importado diretamente (`resolveJsonModule`); o tipo vem do
próprio JSON (`typeof noticias[number]`).
