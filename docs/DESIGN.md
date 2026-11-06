# Design

## Ideia

Escola "feita de professores para alunos" que quer **evoluir para transformar**.
O lema do próprio colégio é a frase de abertura da página e é a ideia visual: a
palavra e a foto dividem a linha, o texto é grande e as fotos reais da escola
fazem o trabalho de "decoração". O prédio com o logo DASK em teal é o
personagem da abertura em vídeo.

A direção de composição veio da skill **taste-skill** (direção sorteada
`sentence-as-layout`, "A frase é o layout", seed `962632083`; o resumo está em
`site/.taste-skill/direction.json`). Ela mantém a paleta da marca (`--keep palette`)
e define a composição: frase grande, uma foto no lugar de uma palavra, seções
como "frase + prova ao lado", muito espaço entre seções.

Pedido do cliente depois da primeira versão: **menos branco, mais cheio e vivo**.
Resposta: cada seção ganhou um campo de cor próprio (verde-água claro, azul-marinho,
teal), faixas de fotos que correm, colagens e números de destaque.

## Cores (tokens em `site/app/globals.css`)

Marca extraída do site do colégio: teal do logo `#54D4BF`, azul `#196CA0`,
azul-marinho `#183E6D`.

| Token | Hex | Uso |
| --- | --- | --- |
| `--background` | `#f4f8f8` | fundo "papel" frio |
| `--foreground` (tinta) | `#0e2944` | texto e títulos (azul-marinho profundo) |
| `--muted-foreground` | `#344d68` | texto secundário (contraste ≥ 7:1 sobre o fundo) |
| `--card` | `#e7efef` | superfícies discretas |
| `--brand` | `#54d4bf` | teal do logo: botão de ação, destaques |
| `--field` | `#183e6d` | campo azul-marinho: Método, Conquistas, linha do tempo, rodapé |
| `--tint` | `#dcf3ee` | verde-água claro: Apresentação, Ensino, Contato |
| `--sky` | `#196ca0` | azul para números de destaque |
| `--ring` | `#196ca0` | anel de foco |

Os componentes usam as classes `bg-background`, `bg-brand`, `bg-field`,
`bg-tint`, `text-sky`, `text-muted-foreground`, nunca hex solto. Marcas de
parceiros (SAS, Árvore) ficam sobre `.logo-chip` (fundo branco) para manter as
próprias cores.

Regra de uso: **uma tinta, um fundo, um acento**. O acento (teal) vai na ação
principal e em poucos destaques. Superfícies se separam por mudança de tom, não por linha.

## Tipografia

Uma família só: **Schibsted Grotesk** (400 texto, 600 funcional, 800 títulos), via `next/font/google`.

| Classe | Uso | Regra |
| --- | --- | --- |
| `.display` | frases enormes (abertura, Robótica, rodapé) | 800 · tracking −0,05em · entrelinha 0,9 |
| `.head` | título de seção | 800 · −0,045em · 0,98 · `text-wrap: balance` · `--step-head` (2,25–4,5 rem) |
| `.lead` | frase de apoio | `--step-lead` (1,25–1,625 rem) · entrelinha 1,3 |
| corpo | parágrafos | `--step-body` (1,0625–1,1875 rem) · entrelinha 1,5 |
| `.small` | notas | `--step-small` (0,8125–0,875 rem), nunca menos de 13 px |

Títulos sempre em **até duas linhas**, em qualquer largura. Parágrafos grandes
("declarações") ficam em até ~36 px no desktop e ~24 px no celular, em até ~3 linhas.

## Espaço

- Margem lateral única: `--margin` (16–32 px) via `.frame`.
- Distância entre seções: `--section-gap` (80–140 px). Dentro de uma seção, bem menos.
- Grade de 12 colunas (`.grid12`); assimetria **dentro** da grade, nunca nas margens: quando o texto fica à esquerda, algo (foto, tabela, número) fecha a direita.
- Raio único `--radius` (0,875 rem) em fotos e cartões; botões de ação totalmente redondos (pílula), escolhido uma vez e mantido.

## O que é proibido (e por quê)

Regras da taste-skill, medidas por `inspect.mjs` em um Chrome real. A skill
observou 247 sites premiados e viu que os mais bem avaliados quase não usam esses
recursos (ex.: cartões com ícone em 1% deles contra 28% dos fracos; gradientes
22% contra 52%; sombras 24% contra 48%). Aqui:

- sem rótulo pequeno acima de título (eyebrow) nem selo/pílula acima do título;
- sem numeração 01/02/03 (exceto sequências reais: linha do tempo, "N de 13" das conquistas);
- sem fonte monoespaçada fora de código;
- sem linhas finas decorativas (as linhas dentro de tabelas e campos de formulário são permitidas);
- sem gradientes (exceção: véu escuro sob o texto da abertura em vídeo);
- sem sombras em elementos parados, sem vidro/blur, sem emoji, sem blobs;
- sem destacar uma palavra de título em itálico ou cor;
- sem cartões de ícone nem fileira de cartões idênticos; seções vizinhas com composições diferentes;
- sem paleta "de assistente" (creme + terracota, violeta/índigo).

## Imagens

- Sempre fotos reais do colégio, do SAS e da Árvore. Nada gerado.
- A skill exige pelo menos quatro fotos reais por página; a home tem hoje cerca de 70 imagens.
- Mesmo tratamento: cantos com `--radius`, `object-fit: cover`, sem filtros.
- Alt descritivo nas fotos que carregam informação; `alt=""` nas decorativas.
- Todas com `width`/`height` e `sizes`; a abertura tem `fetchPriority="high"` no poster.

## Responsivo

Três larguras de verificação: 1440, 768 e 390 px. No celular: o título da abertura
fica em duas linhas (tamanho próprio abaixo de 640 px), cabeçalho vira botão "Menu" com painel lateral, tabelas
empilham, colagens passam a coluna única, algumas fotos extras (`hidden md:block`)
somem para não competir com o título. A única animação simplificada no celular é
a da robótica (não fixa); a abertura em vídeo usa uma sequência menor.

## Acessibilidade

- Contraste: texto sobre fundo ≥ 7:1 (corpo) em `--foreground`/`--background`; textos brancos sobre vídeo sobre véu escuro.
- Foco visível: contorno de 3 px `--ring` com afastamento.
- Skip link, `lang="pt-BR"`, um só `<h1>` (a abertura), `<h2>` em toda seção, tabelas com `<caption>` oculto e `scope`.
- `aria-live="polite"` no resultado do seletor de série.
- Menu móvel com `SheetTitle` e `SheetDescription` (exigência do shadcn).
- Elementos animados e escondidos recebem `inert`/`visibility: hidden`.
- No toque, links e itens de menu têm área clicável de pelo menos ~44 px (camada invisível, sem mudar o desenho) e respondem na hora em que são pressionados.
- A faixa de fotos que corre pode ser pausada com um toque, um clique ou o teclado.
- O menu marca a página atual (`aria-current`).
