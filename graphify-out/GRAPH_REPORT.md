# Graph Report - dask  (2026-11-06)

## Corpus Check
- 114 files · ~83,653 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 674 nodes · 1641 edges · 36 communities (28 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eda07a5d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- documento.ts
- site-header.tsx
- editor.tsx
- components.json
- react
- compilerOptions
- [slug]/page.tsx
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
- hero-cinematico.tsx
- Publicação (Vercel)
- dependencies
- Ferramentas, skills e servidores MCP
- scripts
- Painel administrativo (backend com Supabase)
- Colégio Dask — novo site
- eslint
- Conteúdo: de onde vem e onde editar
- ensino.tsx
- Arquitetura
- historia-cinematica.tsx
- next-themes

## God Nodes (most connected - your core abstractions)
1. `react` - 39 edges
2. `next` - 35 edges
3. `Button()` - 27 edges
4. `SiteHeader()` - 24 edges
5. `FormNoticia()` - 24 edges
6. `lucide-react` - 22 edges
7. `txt()` - 21 edges
8. `cn` - 19 edges
9. `normalizar()` - 17 edges
10. `Ensino()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Tipos e dados` --references--> `Coordenacao`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/site.ts
- `Onde editar cada coisa` --references--> `whatsappLink()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/site.ts
- `Notícias: como atualizar` --references--> `resumoInteiro()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/noticias-tipos.ts
- `Tipos e dados` --references--> `Noticia`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/noticias-tipos.ts
- `Tipos e dados` --references--> `Segmento`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/site.ts

## Import Cycles
- None detected.

## Communities (36 total, 8 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.12
Nodes (23): prettier, prettier-plugin-tailwindcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/sanitize-html (+15 more)

### Community 1 - "documento.ts"
Cohesion: 0.08
Nodes (56): Como a home é montada (`app/page.tsx`), Tipos e dados, PaginaInicial(), Conquistas(), Palavra, palavrasDa(), Contato(), Escola() (+48 more)

### Community 2 - "site-header.tsx"
Cohesion: 0.12
Nodes (17): Acessibilidade, acessos, SiteHeader(), DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuTrigger() (+9 more)

### Community 3 - "editor.tsx"
Cohesion: 0.09
Nodes (49): sonner, apagarMidia(), apagarNoticia(), conteudoSeguro(), enderecoDoTour(), falha(), lerVersao(), listarVersoes() (+41 more)

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (57): Regras de design, class-variance-authority, cn, radix-ui, react, NoticiaForm, FormularioLogin(), avisos (+49 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "[slug]/page.tsx"
Cohesion: 0.14
Nodes (21): lenis, lucide-react, metadata, RootLayout(), schibsted, viewport, BotoesFlutuantes(), icones (+13 more)

### Community 8 - "sessao.ts"
Cohesion: 0.12
Nodes (21): server-only, @supabase/ssr, entrar(), EstadoLogin, sair(), tentativas, LayoutPainel(), metadata (+13 more)

### Community 9 - "cine-test.mjs"
Cohesion: 0.08
Nodes (21): sanitize-html, chrome, errors, evalJs(), pending, report, send(), categorias (+13 more)

### Community 10 - "@types/sanitize-html"
Cohesion: 0.07
Nodes (46): next, metadata, Previa(), metadata, PaginaNoticias(), generateMetadata(), generateStaticParams(), PaginaNoticia() (+38 more)

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

### Community 23 - "hero-cinematico.tsx"
Cohesion: 0.12
Nodes (16): 1. Abertura cinematográfica (scroll controla o vídeo), 2. Robótica: zoom pelo scroll (`showcase.tsx`), 3. Conquistas pelo scroll (`conquistas.tsx`), 4. Entradas ao rolar (`motion.tsx` + `[data-reveal]`), 5. Outras animações, 6. "Nossa história": a linha percorre os anos (`historia-cinematica.tsx`), Animações, Carregamento (+8 more)

### Community 24 - "Publicação (Vercel)"
Cohesion: 0.25
Nodes (8): Cuidados, Domínio, Estado atual, Fluxo normal: commit + push = deploy, Publicar manualmente (CLI, sem Git), Publicação (Vercel), Quem colabora e quer ver a própria versão, Se o deploy por Git falhar

### Community 25 - "dependencies"
Cohesion: 0.09
Nodes (22): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, shadcn, @supabase/supabase-js, tw-animate-css, dependencies, class-variance-authority@^0.7.1 (+14 more)

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
Cohesion: 0.09
Nodes (33): Central do aluno (`app/central-do-aluno/page.tsx`), Acesso(), CentralDoAluno(), Doc, docsPorSegmento, metadata, Linhas(), Ensino() (+25 more)

### Community 33 - "Arquitetura"
Cohesion: 0.40
Nodes (5): Arquitetura, Cabeçalho (`site-header.tsx`), Fonte, tema e acessibilidade global, Mapa de arquivos de `site/`, Seletor de série (`ensino.tsx`)

### Community 34 - "historia-cinematica.tsx"
Cohesion: 0.33
Nodes (8): gsap, assinar(), Cinematica(), comMovimento(), HistoriaCinematica(), Marco, noServidor(), gsap@^3.15.1

### Community 35 - "next-themes"
Cohesion: 0.33
Nodes (4): next-themes, react-dom, next-themes@^0.4.6, react-dom@19.3.1

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ensino.tsx`, `documento.ts`, `historia-cinematica.tsx`, `editor.tsx`, `site-header.tsx`, `devDependencies`, `[slug]/page.tsx`, `@types/sanitize-html`, `dependencies`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Why does `next` connect `@types/sanitize-html` to `ensino.tsx`, `documento.ts`, `site-header.tsx`, `editor.tsx`, `devDependencies`, `react`, `[slug]/page.tsx`, `sessao.ts`, `dependencies`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `documento.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08482523444160273 - nodes in this community are weakly interconnected._
- **Why does `CLAUDE.md — Colégio Dask` connect `CLAUDE.md — Colégio Dask` to `README.md`, `react`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `site-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._
- **Should `editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0852994555353902 - nodes in this community are weakly interconnected._