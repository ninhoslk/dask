# Graph Report - Dask  (2026-10-30)

## Corpus Check
- 110 files · ~80,698 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 646 nodes · 1579 edges · 36 communities (24 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a5c21f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- documento.ts
- site-header.tsx
- editor.tsx
- components.json
- react
- compilerOptions
- ensino.tsx
- next
- cine-test.mjs
- previa-ao-vivo.tsx
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
- @dnd-kit/sortable
- next-themes
- sanitize-html
- tw-animate-css

## God Nodes (most connected - your core abstractions)
1. `react` - 37 edges
2. `next` - 34 edges
3. `Button()` - 27 edges
4. `FormNoticia()` - 24 edges
5. `SiteHeader()` - 24 edges
6. `txt()` - 21 edges
7. `lucide-react` - 21 edges
8. `cn` - 19 edges
9. `Ensino()` - 17 edges
10. `normalizar()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Onde editar cada coisa` --references--> `whatsappLink()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/site.ts
- `Como a home é montada (`app/page.tsx`)` --references--> `Ensino()`  [INFERRED]
  docs/ARQUITETURA.md → site/components/sections/ensino.tsx
- `Como a home é montada (`app/page.tsx`)` --references--> `SiteFooter()`  [INFERRED]
  docs/ARQUITETURA.md → site/components/site-footer.tsx
- `Como funciona` --references--> `normalizar()`  [INFERRED]
  docs/PAINEL.md → site/lib/conteudo/documento.ts
- `Como funciona` --references--> `resolver()`  [INFERRED]
  docs/PAINEL.md → site/lib/conteudo/documento.ts

## Import Cycles
- None detected.

## Communities (36 total, 12 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.12
Nodes (23): prettier, prettier-plugin-tailwindcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/sanitize-html (+15 more)

### Community 1 - "documento.ts"
Cohesion: 0.08
Nodes (58): Como a sincronização funciona, Como a home é montada (`app/page.tsx`), PaginaInicial(), Conquistas(), Palavra, palavrasDa(), Contato(), Escola() (+50 more)

### Community 2 - "site-header.tsx"
Cohesion: 0.06
Nodes (52): Arquitetura, Cabeçalho (`site-header.tsx`), Central do aluno (`app/central-do-aluno/page.tsx`), Fonte, tema e acessibilidade global, Mapa de arquivos de `site/`, Seletor de série (`ensino.tsx`), Tipos e dados, Acessibilidade (+44 more)

### Community 3 - "editor.tsx"
Cohesion: 0.09
Nodes (46): apagarMidia(), apagarNoticia(), conteudoSeguro(), falha(), lerVersao(), listarVersoes(), NoticiaForm, publicar() (+38 more)

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (56): Regras de design, class-variance-authority, cn, radix-ui, react, sonner, FormularioLogin(), avisos (+48 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "ensino.tsx"
Cohesion: 0.09
Nodes (34): lenis, metadata, RootLayout(), schibsted, viewport, BotoesFlutuantes(), Compartilhar(), icones (+26 more)

### Community 8 - "next"
Cohesion: 0.10
Nodes (25): next, server-only, @supabase/ssr, entrar(), EstadoLogin, sair(), tentativas, LayoutPainel() (+17 more)

### Community 9 - "cine-test.mjs"
Cohesion: 0.11
Nodes (13): chrome, errors, evalJs(), pending, report, send(), categorias, entidades (+5 more)

### Community 10 - "previa-ao-vivo.tsx"
Cohesion: 0.10
Nodes (30): metadata, Previa(), metadata, PaginaNoticias(), generateStaticParams(), Home(), BotaoBarra(), Caixa (+22 more)

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

### Community 25 - "dependencies"
Cohesion: 0.11
Nodes (19): @dnd-kit/core, @dnd-kit/utilities, react-dom, shadcn, @supabase/supabase-js, dependencies, cn@^0.5.0, @dnd-kit/core@^6.3.1 (+11 more)

### Community 26 - "Ferramentas, skills e servidores MCP"
Cohesion: 0.29
Nodes (7): Atalhos do shadcn, Ferramentas, skills e servidores MCP, Graphify (grafo de conhecimento do código), Navegador de teste, Programas instalados na máquina (via `winget`), Servidores MCP configurados (em `~/.claude.json`, nível do usuário), Skills do Claude Code usadas (instaladas em `~/.claude/skills/`)

### Community 27 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, start, typecheck

### Community 28 - "Painel administrativo (backend com Supabase)"
Cohesion: 0.33
Nodes (6): Banco (Supabase), Como funciona, Criar uma pessoa da equipe, O que dá para fazer, Painel administrativo (backend com Supabase), Segurança

### Community 29 - "Colégio Dask — novo site"
Cohesion: 0.33
Nodes (6): Antes de publicar de verdade, Colégio Dask — novo site, Começando, Documentação, Estrutura do repositório, Regras de trabalho (resumo; detalhes no [CLAUDE.md](CLAUDE.md))

### Community 30 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.4.2

### Community 31 - "Conteúdo: de onde vem e onde editar"
Cohesion: 0.40
Nodes (5): Contatos usados (do site da escola), Conteúdo: de onde vem e onde editar, Fotos, Notícias: como atualizar, Onde editar cada coisa

## Knowledge Gaps
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `documento.ts`, `site-header.tsx`, `editor.tsx`, `ensino.tsx`, `previa-ao-vivo.tsx`, `dependencies`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `package.json`, `documento.ts`, `site-header.tsx`, `editor.tsx`, `react`, `ensino.tsx`, `previa-ao-vivo.tsx`, `dependencies`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Should `documento.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07967806841046278 - nodes in this community are weakly interconnected._
- **Why does `CLAUDE.md — Colégio Dask` connect `CLAUDE.md — Colégio Dask` to `README.md`, `react`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `site-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05516431924882629 - nodes in this community are weakly interconnected._
- **Should `editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08956228956228957 - nodes in this community are weakly interconnected._