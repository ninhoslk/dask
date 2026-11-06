# CLAUDE.md — Colégio Dask

Site novo do **Colégio Dask** (Dracena-SP). Proposta de redesign para a escola.
Código em `site/`. Idioma do projeto: **português do Brasil** (textos, nomes de
componentes, variáveis e comentários). Visão geral em [README.md](README.md);
detalhes em [docs/](docs/).

## Duas regras que valem sempre

### 1. Consulte o grafo antes de ler arquivos (economiza tokens)

O repositório tem um **grafo de conhecimento do código** em `graphify-out/`
(gerado pelo [Graphify](https://github.com/Graphify-Labs/graphify)): quais componentes
existem, quem importa quem, quem chama quem. Para qualquer pergunta sobre o código,
**pergunte ao grafo primeiro**; só leia o arquivo inteiro depois que o grafo apontar
onde olhar.

```bash
graphify query "como a abertura controla o vídeo pelo scroll"   # subgrafo da pergunta
graphify explain "HeroCinematico"                                # um conceito e seus vizinhos
graphify path "Home" "whatsappLink"                              # como duas coisas se ligam
graphify affected "whatsappLink"                                 # o que quebra se eu mudar isto
```

- Visão geral rápida: `graphify-out/GRAPH_REPORT.md` (nós mais conectados, comunidades, perguntas sugeridas) ou abra `graphify-out/graph.html` no navegador.
- Consulta típica custa ~1,8 mil tokens contra ~24 mil para ler código e documentação inteiros (medido com `graphify benchmark`: ~13x menos). O ganho cresce com o projeto.
- **Depois de mudar código, atualize o grafo** (sem custo de API, só AST local): `graphify update .`
- Detalhes, instalação e limites em [docs/GRAFO.md](docs/GRAFO.md).

### 2. Toda mudança vira commit e push (a Vercel publica a partir do GitHub)

O repositório está conectado à Vercel: **cada `git push` na `main` publica o site**
(e cada branch/PR ganha uma URL de preview). Por isso, **toda vez que algo mudar,
faça commit e push**; não deixe alteração só no computador.

Isso vale para o dono do projeto. **Quem só colabora** (ver
[docs/COLABORACAO.md](docs/COLABORACAO.md)) **não dá push na `main`**: cria uma
branch (`feat/…` ou `fix/…`), faz commit nela e abre um PR para o dono revisar.

```bash
cd site && npm run typecheck && npm run lint && npm run build   # tem que passar
cd .. && graphify update .                                        # atualiza o grafo
git add -A && git commit -m "Descreve a mudança em português"
git push
```

Se o build falhar localmente, **não faça push**: o deploy da Vercel quebraria.
Depois do push, confira o deploy (ver [docs/PUBLICACAO.md](docs/PUBLICACAO.md)).

## Comandos (rodar dentro de `site/`)

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (regras do React 19 ativas)
npm run build        # precisa passar antes de publicar
```

Antes de dar uma tarefa por concluída: `typecheck`, `lint` e `build` sem erro, e
olhar a página de verdade no navegador (desktop **e** celular). Passar no
typecheck não prova que a animação ou o layout estão certos.

## Next.js 16 não é o Next que você conhece

`site/AGENTS.md` avisa: esta versão tem mudanças que quebram APIs, convenções e
estrutura. Antes de escrever código de Next, leia o guia relevante em
`site/node_modules/next/dist/docs/` e siga avisos de depreciação. Esse bloco do
`AGENTS.md` é reescrito pelo `next dev`; não o apague.

## Mapa rápido

| Onde | O quê |
| --- | --- |
| `site/app/page.tsx` | Monta a home, na ordem das seções |
| `site/app/central-do-aluno/page.tsx` | Segunda página: acessos, documentos por segmento, coordenações |
| `site/app/globals.css` | Tokens de cor, tipografia, classes utilitárias e **todo o CSS das animações** |
| `site/app/layout.tsx` | Fonte (Schibsted Grotesk), metadados, link "pular para o conteúdo", `<Motion />` |
| `site/components/sections/*` | Uma seção da home por arquivo |
| `site/components/site-header.tsx`, `site-footer.tsx` | Cabeçalho (com variante clara sobre vídeo) e rodapé |
| `site/components/motion.tsx` | Revela elementos `[data-reveal]` ao rolar |
| `site/components/ui/*` | Componentes shadcn/ui (Button, Select, Sheet, Tabs, DropdownMenu, Toggle) |
| `site/lib/site.ts` | **Dados institucionais**: contatos, links, segmentos, coordenações, linha do tempo, conquistas, documentos |
| `site/lib/noticias-todas.json` | **Todas** as notícias do blog do colégio (265), importadas por `scripts/importar-noticias.mjs`; fallback quando o banco não responde |
| `site/app/noticias/` | Lista de notícias (filtros, busca) e página de cada notícia com compartilhamento |
| `site/app/admin/`, `site/components/admin/` | **Painel** (editor visual, notícias, mídia, tour 360°). Ver [docs/PAINEL.md](docs/PAINEL.md) |
| `site/lib/conteudo/` | Esquema do conteúdo editável da home, validação e leitura do banco |
| `site/lib/supabase/`, `site/proxy.ts`, `supabase/migrations/` | Supabase: clientes, sessão do painel, tabelas e RLS |
| `site/lib/hero-cinematico.ts` | Configuração da abertura cinematográfica (frames, altura, textos) |
| `site/public/` | Fotos, logos, frames do vídeo (`hero/`), imagens das notícias |

Arquitetura completa: [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Regras de conteúdo (importante)

1. **Nada inventado.** Texto, número, nome e foto vêm dos sites reais (colegiodask.com.br, SAS Educação, Árvore). Sem depoimentos, estatísticas ou prêmios que não existam. Os números usados: fundado em 1996 (início do ensino médio) e "mais de 700 alunos". Atenção: o site da escola dá os 700 alunos como marco de **2021**; o novo site os apresenta como "hoje" e isso precisa ser confirmado com a escola (ver pendências).
2. **Sem imagens criadas ou geradas.** Só fotos reais já baixadas. Se faltar uma foto, avise em vez de gerar.
3. **Logos de parceiros** (SAS Educação e Árvore) sempre dentro do componente `.logo-chip` (fundo branco), sem alterar cores ou proporções.
4. **SAS e Árvore aparecem integrados** na seção Método, **não** em uma aba ou página própria. Não existe mais menção à Geekie One (era do site antigo; a escola agora é SAS).
5. Contatos, endereço e links ficam **só** em `lib/site.ts`. Não copie para componentes.
6. Notícias: reimportar do WordPress do colégio (`/wp-json/wp/v2/posts`) em vez de digitar à mão.

## Regras de design

A direção de arte veio da skill **taste-skill** (direção "A frase é o layout"). Resumo
do que isso proíbe e por quê, em [docs/DESIGN.md](docs/DESIGN.md):

- Títulos em **no máximo duas linhas** em qualquer largura.
- **Sem** rótulos pequenos acima de títulos (eyebrows), **sem** numeração 01/02/03 (exceto sequência real, como a linha do tempo), **sem** fonte monoespaçada, **sem** linhas finas decorativas, **sem** sombras em elementos parados, **sem** vidro/blur, **sem** emoji, **sem** palavra de destaque em itálico/cor dentro de título.
- **Sem gradientes.** Exceções: o véu escuro sob o texto da abertura em vídeo (`.cine-veu`), por legibilidade, e o preenchimento de cor dura (sem transição visível) das palavras da frase de conquistas (`.leitura`), que reproduz o efeito de leitura da ONFORM.
- Uma fonte só: **Schibsted Grotesk** (400, 600, 800).
- Cores via tokens em `globals.css` (`bg-tint`, `bg-field`, `bg-brand`, `text-sky`…), nunca hex solto nos componentes.
- Cada seção tem composição diferente da vizinha; nada de grade de cartões idênticos.
- Margem lateral única: variável `--margin`; classe `.frame`.

Regras do shadcn (já impostas pela skill `shadcn`): `className` só para layout;
`gap-*` em vez de `space-*`; `size-*` quando largura = altura; cores semânticas;
ícones dentro de `Button` com `data-icon`; `Dialog/Sheet/Drawer` sempre com título;
formulários com `FieldGroup`/`Field`.

## Regras de animação

Detalhes e valores em [docs/ANIMACOES.md](docs/ANIMACOES.md). Resumo:

- Animar **só `transform` e `opacity`** (nunca `transition: all`, nunca largura/altura).
- **Todo movimento respeita `prefers-reduced-motion`** e nunca esconde conteúdo se o JavaScript falhar (o estado "escondido" só existe sob `html.js-motion`).
- Trabalho por scroll acontece **em um `requestAnimationFrame`** e escreve direto no DOM; não use `setState` por evento de scroll.
- Elementos invisíveis não podem bloquear clique nem foco (`visibility: hidden` + `inert`).
- **Celular:** só remova ou simplifique uma animação se ela causar bug. Hoje as diferenças são: sequência de frames menor e recortada na vertical na abertura, robótica sem fixar na tela, textos da abertura e conquistas com alturas menores.

## Verificação visual

Os scripts em `scripts/` (e a skill taste-skill, se você a tiver) medem o site em um Chrome real:

```bash
# inspeção da taste-skill (desktop 1440, tablet 768, celular 390)
node <caminho-da-skill>/scripts/inspect.mjs http://localhost:3000

# percorre a abertura cinematográfica de 0 a 100% e volta, com capturas
node scripts/cine-test.mjs http://localhost:3000 ./saida desktop
node scripts/cine-test.mjs http://localhost:3000 ./saida phone
node scripts/cine-test.mjs http://localhost:3000 ./saida desktop reduzido
```

Rode a inspeção contra o **build de produção** (`npm run build && npm run start`),
não só o `dev`: o bundler pode mudar o que vai ao ar.

## Armadilhas conhecidas

- Os componentes de `components/ui/*` gerados pelo shadcn importam `cn` do **pacote npm `cn`** (está no `package.json`), enquanto `lib/utils.ts` também exporta um `cn`. Funciona; só não "corrija" sem testar.
- `.env.local` e `.vercel/` são criados pela CLI da Vercel e estão no `.gitignore`. **Nunca versione**: contêm tokens.
- `next-env.d.ts` e `*.tsbuildinfo` são ignorados; o Next recria.
- Se o `npm run build` cair com "build worker exited" (pouca memória livre no computador), rode `NEXT_BUILD_CPUS=2 npm run build`: limita os processos do build (`experimental.cpus` em `next.config.ts`). Sem a variável, nada muda (a Vercel usa o padrão).
- Se o Windows estiver com "efeitos de animação" desligados, o navegador informa `prefers-reduced-motion: reduce` e a abertura fica **estática** (sem canvas). Não é bug. `scripts/cine-test.mjs` força "sem preferência" quando o modo `reduzido` não é pedido.
- No Windows, o painel de pré-visualização pode pausar animações quando oculto; ao testar scroll, use um Chrome headless (`scripts/cine-test.mjs`) em vez de confiar em capturas de uma aba escondida.
- `referencia/fotos/` (≈490 MB) **não** está no Git. Para recriar: `scripts/download.ps1`.
- Excerpts do WordPress chegam cortados no meio da frase; `components/sections/noticias.tsx` já corta na última frase completa.
- O vídeo-fonte da abertura (MP4, 19 MB) **não** está no repositório; só os frames em `public/hero/`. Como regerar: `site/public/hero/README.md`.

## Fluxo de trabalho com Git

- Branch principal: `main`. Trabalhe em branches curtas (`feat/…`, `fix/…`) e abra PR.
- Mensagens de commit em português, no imperativo ("Adiciona…", "Corrige…").
- Antes do PR: `typecheck`, `lint`, `build` e olhar desktop + celular.
- Não commite: `.env*`, `.vercel/`, fotos brutas de `referencia/fotos/`, vídeos `.mp4`.

## Publicação

A demonstração atual está na Vercel (`colegio-dask`), publicada pela CLI a partir de
`site/`. Passo a passo e ressalvas em [docs/PUBLICACAO.md](docs/PUBLICACAO.md).
Se conectar o repositório à Vercel, defina **Root Directory = `site`**.

## Colaboradores

Quem vai ajudar no projeto começa por [docs/COLABORACAO.md](docs/COLABORACAO.md):
acessos, como rodar, fluxo de PR (sem push direto na `main`) e pendências.

## Onde está cada decisão

[docs/HISTORICO.md](docs/HISTORICO.md) lista o que foi feito, as decisões do
cliente (ex.: "sem seção própria do SAS", "robótica com a foto da bandeira"), o
estado dos testes e as pendências.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
