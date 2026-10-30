# Graph Report - Dask  (2026-10-30)

## Corpus Check
- 53 files · ~21,471 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 364 nodes · 604 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d36dbc5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- app/page.tsx
- site-header.tsx
- central-do-aluno/page.tsx
- components.json
- radix-ui
- compilerOptions
- ensino.tsx
- hero-cinematico.tsx
- cine-test.mjs
- layout.tsx
- README.md
- postcss.config.mjs
- CLAUDE.md — Colégio Dask
- Histórico, decisões e pendências
- Grafo de conhecimento do código (Graphify)
- Design
- AGENTS.md
- 1. Abertura cinematográfica (scroll controla o vídeo)
- Publicação (Vercel)

## God Nodes (most connected - your core abstractions)
1. `SiteHeader()` - 18 edges
2. `compilerOptions` - 16 edges
3. `next` - 15 edges
4. `react` - 14 edges
5. `CLAUDE.md — Colégio Dask` - 14 edges
6. `Ensino()` - 13 edges
7. `Home()` - 12 edges
8. `whatsappLink()` - 12 edges
9. `Como a home é montada (`app/page.tsx`)` - 12 edges
10. `HeroCinematico()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Onde editar cada coisa` --references--> `whatsappLink()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/site.ts
- `Como a home é montada (`app/page.tsx`)` --references--> `Ensino()`  [INFERRED]
  docs/ARQUITETURA.md → site/components/sections/ensino.tsx
- `Como a home é montada (`app/page.tsx`)` --references--> `HeroCinematico()`  [INFERRED]
  docs/ARQUITETURA.md → site/components/sections/hero-cinematico.tsx
- `Como a home é montada (`app/page.tsx`)` --references--> `SiteFooter()`  [INFERRED]
  docs/ARQUITETURA.md → site/components/site-footer.tsx
- `Regras de design` --references--> `Button()`  [INFERRED]
  CLAUDE.md → site/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (25 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (45): eslint, eslint-config-next, next-themes, prettier, prettier-plugin-tailwindcss, react-dom, shadcn, tailwindcss (+37 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.11
Nodes (26): Como a home é montada (`app/page.tsx`), next, Home(), Conquistas(), Contato(), Escola(), FaixaFotos(), fotos (+18 more)

### Community 2 - "site-header.tsx"
Cohesion: 0.10
Nodes (22): Regras de design, Acessibilidade, cn, acessos, SiteHeader(), Button(), buttonVariants, DropdownMenu() (+14 more)

### Community 3 - "central-do-aluno/page.tsx"
Cohesion: 0.10
Nodes (27): Arquitetura, Cabeçalho (`site-header.tsx`), Central do aluno (`app/central-do-aluno/page.tsx`), Fonte, tema e acessibilidade global, Mapa de arquivos de `site/`, Seletor de série (`ensino.tsx`), Tipos e dados, Acesso() (+19 more)

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "radix-ui"
Cohesion: 0.27
Nodes (8): class-variance-authority, radix-ui, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants, class-variance-authority@^0.7.1, radix-ui@^1.8.1

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "ensino.tsx"
Cohesion: 0.26
Nodes (13): lucide-react, react, Ensino(), segmentoDa(), Select(), SelectContent(), SelectGroup(), SelectItem() (+5 more)

### Community 8 - "hero-cinematico.tsx"
Cohesion: 0.23
Nodes (14): Como a sincronização funciona, assinarReduzido(), clamp(), desenharCover(), HeroCinematico(), visibilidade(), alturaSecao, blocos (+6 more)

### Community 9 - "cine-test.mjs"
Cohesion: 0.20
Nodes (6): chrome, errors, evalJs(), pending, report, send()

### Community 10 - "layout.tsx"
Cohesion: 0.32
Nodes (5): metadata, RootLayout(), schibsted, viewport, Motion()

### Community 11 - "README.md"
Cohesion: 0.09
Nodes (20): Contatos usados (do site da escola), Conteúdo: de onde vem e onde editar, Fotos, Notícias: como atualizar, Onde editar cada coisa, Atalhos do shadcn, Ferramentas, skills e servidores MCP, Graphify (grafo de conhecimento do código) (+12 more)

### Community 17 - "CLAUDE.md — Colégio Dask"
Cohesion: 0.13
Nodes (15): 1. Consulte o grafo antes de ler arquivos (economiza tokens), 2. Toda mudança vira commit e push (a Vercel publica a partir do GitHub), Armadilhas conhecidas, CLAUDE.md — Colégio Dask, Comandos (rodar dentro de `site/`), Duas regras que valem sempre, Fluxo de trabalho com Git, graphify (+7 more)

### Community 18 - "Histórico, decisões e pendências"
Cohesion: 0.20
Nodes (10): Auditorias, Como foram gerados os dados, Decisões do cliente (por ordem), Estado dos testes (honesto), Histórico, decisões e pendências, Levantamento, O que foi feito, Pedido original (+2 more)

### Community 19 - "Grafo de conhecimento do código (Graphify)"
Cohesion: 0.22
Nodes (9): Como foi gerado aqui, Como usar, Economia medida, Grafo de conhecimento do código (Graphify), Instalação (cada colaborador, uma vez), Manter o grafo atualizado, O que NÃO está no grafo (de propósito), O que tem no grafo (+1 more)

### Community 20 - "Design"
Cohesion: 0.25
Nodes (8): Cores (tokens em `site/app/globals.css`), Design, Espaço, Ideia, Imagens, O que é proibido (e por quê), Responsivo, Tipografia

### Community 23 - "1. Abertura cinematográfica (scroll controla o vídeo)"
Cohesion: 0.15
Nodes (13): 1. Abertura cinematográfica (scroll controla o vídeo), 2. Robótica: zoom pelo scroll (`showcase.tsx`), 3. Conquistas pelo scroll (`conquistas.tsx`), 4. Entradas ao rolar (`motion.tsx` + `[data-reveal]`), 5. Outras animações, Animações, Carregamento, Como ajustar (tudo em `lib/hero-cinematico.ts`) (+5 more)

### Community 24 - "Publicação (Vercel)"
Cohesion: 0.25
Nodes (8): Cuidados, Domínio, Estado atual, Fluxo normal: commit + push = deploy, Publicar manualmente (CLI, sem Git), Publicação (Vercel), Quem colabora e quer ver a própria versão, Se o deploy por Git falhar

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Arquitetura` connect `central-do-aluno/page.tsx` to `app/page.tsx`, `README.md`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.056429232192414434 - nodes in this community are weakly interconnected._
- **Why does `next` connect `app/page.tsx` to `package.json`, `site-header.tsx`, `central-do-aluno/page.tsx`, `ensino.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._
- **Why does `react` connect `ensino.tsx` to `package.json`, `app/page.tsx`, `site-header.tsx`, `central-do-aluno/page.tsx`, `radix-ui`, `hero-cinematico.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `site-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09957325746799431 - nodes in this community are weakly interconnected._
- **Should `central-do-aluno/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10483870967741936 - nodes in this community are weakly interconnected._