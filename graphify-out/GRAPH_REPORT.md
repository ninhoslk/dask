# Graph Report - dask  (2026-11-06)

## Corpus Check
- 114 files · ~83,440 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 667 nodes · 1632 edges · 35 communities (26 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `423f30ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- documento.ts
- site-header.tsx
- react-dom
- components.json
- react
- compilerOptions
- lucide-react
- sessao.ts
- cine-test.mjs
- @types/sanitize-html
- README.md
- postcss.config.mjs
- CLAUDE.md — Colégio Dask
- Histórico, decisões e pendências
- Grafo de conhecimento do código (Graphify)
- Design
- AGENTS.md
- 1. Abertura cinematográfica (scroll controla o vídeo)
- Publicação (Vercel)
- dependencies
- Ferramentas, skills e servidores MCP
- scripts
- Painel administrativo (backend com Supabase)
- Colégio Dask — novo site
- eslint
- Conteúdo: de onde vem e onde editar
- ensino.tsx
- editor.tsx
- @dnd-kit/sortable

## God Nodes (most connected - your core abstractions)
1. `react` - 40 edges
2. `next` - 35 edges
3. `SiteHeader()` - 27 edges
4. `Button()` - 27 edges
5. `FormNoticia()` - 24 edges
6. `lucide-react` - 22 edges
7. `txt()` - 19 edges
8. `cn` - 19 edges
9. `normalizar()` - 17 edges
10. `Ensino()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Onde editar cada coisa` --references--> `whatsappLink()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/site.ts
- `Notícias: como atualizar` --references--> `resumoInteiro()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/noticias-tipos.ts
- `Tipos e dados` --references--> `Coordenacao`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/site.ts
- `Como a home é montada (`app/page.tsx`)` --references--> `HeroCinematico()`  [INFERRED]
  docs/ARQUITETURA.md → site/components/sections/hero-cinematico.tsx
- `Como funciona` --references--> `resolver()`  [INFERRED]
  docs/PAINEL.md → site/lib/conteudo/documento.ts

## Import Cycles
- None detected.

## Communities (35 total, 9 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.12
Nodes (23): prettier, prettier-plugin-tailwindcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/sanitize-html (+15 more)

### Community 1 - "documento.ts"
Cohesion: 0.07
Nodes (59): Arquitetura, Cabeçalho (`site-header.tsx`), Como a home é montada (`app/page.tsx`), Fonte, tema e acessibilidade global, Mapa de arquivos de `site/`, Seletor de série (`ensino.tsx`), Tipos e dados, Conquistas() (+51 more)

### Community 2 - "site-header.tsx"
Cohesion: 0.07
Nodes (35): Como a sincronização funciona, Acessibilidade, lucide-react, CabecalhoFixo(), assinarReduzido(), clamp(), desenharCover(), HeroCinematico() (+27 more)

### Community 3 - "react-dom"
Cohesion: 0.33
Nodes (4): react-dom, tw-animate-css, react-dom@19.3.1, tw-animate-css@^1.4.0

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (60): class-variance-authority, cn, radix-ui, react, enderecoDoTour(), NoticiaForm, salvarTour(), TourForm (+52 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "lucide-react"
Cohesion: 0.14
Nodes (21): lenis, metadata, RootLayout(), schibsted, viewport, BotoesFlutuantes(), icones, Icone() (+13 more)

### Community 8 - "sessao.ts"
Cohesion: 0.10
Nodes (26): next, server-only, @supabase/ssr, entrar(), EstadoLogin, sair(), tentativas, LayoutPainel() (+18 more)

### Community 9 - "cine-test.mjs"
Cohesion: 0.08
Nodes (21): sanitize-html, chrome, errors, evalJs(), pending, report, send(), categorias (+13 more)

### Community 10 - "@types/sanitize-html"
Cohesion: 0.09
Nodes (37): metadata, PaginaNoticias(), generateMetadata(), generateStaticParams(), PaginaNoticia(), Props, Home(), metadata (+29 more)

### Community 17 - "CLAUDE.md — Colégio Dask"
Cohesion: 0.12
Nodes (16): 1. Consulte o grafo antes de ler arquivos (economiza tokens), 2. Toda mudança vira commit e push (a Vercel publica a partir do GitHub), Armadilhas conhecidas, CLAUDE.md — Colégio Dask, Comandos (rodar dentro de `site/`), Duas regras que valem sempre, Fluxo de trabalho com Git, graphify (+8 more)

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

### Community 25 - "dependencies"
Cohesion: 0.10
Nodes (20): @dnd-kit/core, @dnd-kit/utilities, next-themes, shadcn, @supabase/supabase-js, dependencies, class-variance-authority@^0.7.1, cn@^0.5.0 (+12 more)

### Community 26 - "Ferramentas, skills e servidores MCP"
Cohesion: 0.29
Nodes (7): Atalhos do shadcn, Ferramentas, skills e servidores MCP, Graphify (grafo de conhecimento do código), Navegador de teste, Programas instalados na máquina (via `winget`), Servidores MCP configurados (em `~/.claude.json`, nível do usuário), Skills do Claude Code usadas (instaladas em `~/.claude/skills/`)

### Community 27 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, start, typecheck

### Community 28 - "Painel administrativo (backend com Supabase)"
Cohesion: 0.25
Nodes (8): Banco (Supabase), Como funciona, Criar uma pessoa da equipe, Economia de espaço, O que dá para fazer, Painel administrativo (backend com Supabase), Segurança, Testes de segurança (30/10/2026)

### Community 29 - "Colégio Dask — novo site"
Cohesion: 0.33
Nodes (6): Antes de publicar de verdade, Colégio Dask — novo site, Começando, Documentação, Estrutura do repositório, Regras de trabalho (resumo; detalhes no [CLAUDE.md](CLAUDE.md))

### Community 30 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.4.2

### Community 31 - "Conteúdo: de onde vem e onde editar"
Cohesion: 0.33
Nodes (5): Contatos usados (do site da escola), Conteúdo: de onde vem e onde editar, Fotos, Notícias: como atualizar, Onde editar cada coisa

### Community 32 - "ensino.tsx"
Cohesion: 0.12
Nodes (26): Central do aluno (`app/central-do-aluno/page.tsx`), Acesso(), CentralDoAluno(), Doc, docsPorSegmento, metadata, Linhas(), Ensino() (+18 more)

### Community 34 - "editor.tsx"
Cohesion: 0.10
Nodes (44): sonner, apagarMidia(), apagarNoticia(), conteudoSeguro(), falha(), lerVersao(), listarVersoes(), publicar() (+36 more)

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ensino.tsx`, `documento.ts`, `site-header.tsx`, `editor.tsx`, `devDependencies`, `lucide-react`, `@types/sanitize-html`, `dependencies`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Why does `next` connect `sessao.ts` to `ensino.tsx`, `documento.ts`, `editor.tsx`, `site-header.tsx`, `devDependencies`, `react`, `lucide-react`, `@types/sanitize-html`, `dependencies`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `documento.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07135135135135136 - nodes in this community are weakly interconnected._
- **Why does `CLAUDE.md — Colégio Dask` connect `CLAUDE.md — Colégio Dask` to `README.md`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `site-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07390648567119155 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._