# Graph Report - Dask  (2026-11-06)

## Corpus Check
- 143 files · ~103,513 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 858 nodes · 2322 edges · 43 communities (34 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2caf9f80`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- ensino.tsx
- dados.ts
- hero-cinematico.tsx
- components.json
- react
- compilerOptions
- esquema.ts
- next
- cine-test.mjs
- admin/acoes.ts
- README.md
- postcss.config.mjs
- CLAUDE.md — Colégio Dask
- Histórico, decisões e pendências
- Grafo de conhecimento do código (Graphify)
- Design
- AGENTS.md
- operacoes.ts
- Publicação (Vercel)
- dependencies
- Ferramentas, skills e servidores MCP
- scripts
- Painel administrativo (backend com Supabase)
- Colégio Dask — novo site
- eslint
- Conteúdo: de onde vem e onde editar
- documento.ts
- @dnd-kit/sortable
- Arquitetura
- package.json
- editor.tsx
- Arquitetura
- encaixe-secoes.tsx
- sanitize-html
- previa-ao-vivo.tsx
- documento.ts
- vitest

## God Nodes (most connected - your core abstractions)
1. `react` - 47 edges
2. `next` - 40 edges
3. `SiteHeader()` - 34 edges
4. `Button()` - 33 edges
5. `useConfig()` - 30 edges
6. `txt()` - 30 edges
7. `Editor()` - 26 edges
8. `contatoDe()` - 25 edges
9. `FormNoticia()` - 24 edges
10. `lucide-react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Mapa rápido` --references--> `useConfig()`  [INFERRED]
  CLAUDE.md → site/components/config-site.tsx
- `Regras de conteúdo (importante)` --references--> `useConfig()`  [INFERRED]
  CLAUDE.md → site/components/config-site.tsx
- `Regras que valem sempre` --references--> `useConfig()`  [INFERRED]
  docs/COLABORACAO.md → site/components/config-site.tsx
- `Notícias: como atualizar` --references--> `resumoInteiro()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/noticias-tipos.ts
- `Sincronização e trabalho em equipe` --references--> `prepararTempoReal()`  [INFERRED]
  docs/PAINEL.md → site/lib/supabase/navegador.ts

## Import Cycles
- None detected.

## Communities (43 total, 9 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.12
Nodes (17): prettier, prettier-plugin-tailwindcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/sanitize-html (+9 more)

### Community 1 - "ensino.tsx"
Cohesion: 0.10
Nodes (45): Como a home é montada (`app/page.tsx`), Tipos e dados, CampoEscolha(), useConfig(), Linhas(), PaginaInicial(), Bloco(), BotaoDaSecao() (+37 more)

### Community 2 - "dados.ts"
Cohesion: 0.06
Nodes (55): Acessibilidade, generateMetadata(), PaginaCentralDoAluno(), generateMetadata(), generateViewport(), RootLayout(), schibsted, CabecalhoFixo() (+47 more)

### Community 3 - "hero-cinematico.tsx"
Cohesion: 0.07
Nodes (34): 1. Abertura cinematográfica (scroll controla o vídeo), 2. Robótica: zoom pelo scroll (`showcase.tsx`), 3. Conquistas pelo scroll (`conquistas.tsx`), 4. Entradas ao rolar (`motion.tsx` + `[data-reveal]`), 5. Outras animações, Animações, Carregamento, Como a sincronização funciona (+26 more)

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (66): Regras de design, class-variance-authority, cn, radix-ui, react, NoticiaForm, TourForm, ErroPainel() (+58 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "esquema.ts"
Cohesion: 0.08
Nodes (30): docsPadrao, Grupo, grupoPorId, grupos, icones, IdGrupo, link, acoesDoBotao (+22 more)

### Community 8 - "next"
Cohesion: 0.08
Nodes (33): next, server-only, @supabase/ssr, entrar(), EstadoLogin, sair(), tentativas, LayoutPainel() (+25 more)

### Community 9 - "cine-test.mjs"
Cohesion: 0.09
Nodes (19): chrome, errors, evalJs(), pending, report, send(), categorias, entidades (+11 more)

### Community 10 - "admin/acoes.ts"
Cohesion: 0.08
Nodes (50): apagarMidia(), apagarNoticia(), enderecoDoTour(), lerRascunho(), lerVersao(), listarVersoes(), paginaInvalida, publicar() (+42 more)

### Community 17 - "CLAUDE.md — Colégio Dask"
Cohesion: 0.12
Nodes (16): 1. Consulte o grafo antes de ler arquivos (economiza tokens), 2. Toda mudança vira commit e push (a Vercel publica a partir do GitHub), Armadilhas conhecidas, CLAUDE.md — Colégio Dask, Colaboradores, Comandos (rodar dentro de `site/`), Duas regras que valem sempre, Fluxo de trabalho com Git (+8 more)

### Community 18 - "Histórico, decisões e pendências"
Cohesion: 0.18
Nodes (11): Auditorias, Como foram gerados os dados, Decisões do cliente (por ordem), Estado dos testes (honesto), Histórico, decisões e pendências, Levantamento, O que foi feito, Pedido original (+3 more)

### Community 19 - "Grafo de conhecimento do código (Graphify)"
Cohesion: 0.22
Nodes (9): Como foi gerado aqui, Como usar, Economia medida, Grafo de conhecimento do código (Graphify), Instalação (cada colaborador, uma vez), Manter o grafo atualizado, O que NÃO está no grafo (de propósito), O que tem no grafo (+1 more)

### Community 20 - "Design"
Cohesion: 0.25
Nodes (8): Cores (tokens em `site/app/globals.css`), Design, Espaço, Ideia, Imagens, O que é proibido (e por quê), Responsivo, Tipografia

### Community 23 - "operacoes.ts"
Cohesion: 0.21
Nodes (21): Estrutura(), ItemSecao(), novaSecao(), SecaoDoc, IdSecao, Valor, achar(), acrescentarSecao() (+13 more)

### Community 24 - "Publicação (Vercel)"
Cohesion: 0.25
Nodes (8): Cuidados, Domínio, Estado atual, Fluxo normal: commit + push = deploy, Publicar manualmente (CLI, sem Git), Publicação (Vercel), Quem colabora e quer ver a própria versão, Se o deploy por Git falhar

### Community 25 - "dependencies"
Cohesion: 0.10
Nodes (20): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, react-dom, shadcn, dependencies, class-variance-authority@^0.7.1, cn@^0.5.0 (+12 more)

### Community 26 - "Ferramentas, skills e servidores MCP"
Cohesion: 0.29
Nodes (7): Atalhos do shadcn, Ferramentas, skills e servidores MCP, Graphify (grafo de conhecimento do código), Navegador de teste, Programas instalados na máquina (via `winget`), Servidores MCP configurados (em `~/.claude.json`, nível do usuário), Skills do Claude Code usadas (instaladas em `~/.claude/skills/`)

### Community 27 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, format, lint, start, test, typecheck

### Community 28 - "Painel administrativo (backend com Supabase)"
Cohesion: 0.22
Nodes (9): Banco (Supabase), Criar uma pessoa da equipe, Economia de espaço, O que continua fixo (diferenças honestas em relação ao Elementor), O que dá para fazer, Painel administrativo (backend com Supabase), Segurança, Sincronização e trabalho em equipe (+1 more)

### Community 29 - "Colégio Dask — novo site"
Cohesion: 0.33
Nodes (6): Antes de publicar de verdade, Colégio Dask — novo site, Começando, Documentação, Estrutura do repositório, Regras de trabalho (resumo; detalhes no [CLAUDE.md](CLAUDE.md))

### Community 30 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.4.2

### Community 31 - "Conteúdo: de onde vem e onde editar"
Cohesion: 0.33
Nodes (5): Contatos usados (do site da escola), Conteúdo: de onde vem e onde editar, Fotos, Notícias: como atualizar, Onde editar cada coisa

### Community 32 - "documento.ts"
Cohesion: 0.18
Nodes (20): lucide-react, sonner, BibliotecaMidia(), Historico(), comprimir(), doSite, enviarImagem(), Grade() (+12 more)

### Community 33 - "@dnd-kit/sortable"
Cohesion: 0.22
Nodes (9): Acessos (quem convida é o dono do projeto), Achar as coisas sem ler tudo, Ajudando no projeto, Como enviar uma mudança, O que está em aberto, O que nunca vai para o Git, Regras que valem sempre, Rodar no seu computador (+1 more)

### Community 34 - "Arquitetura"
Cohesion: 0.09
Nodes (41): generateMetadata(), PaginaNoticias(), generateMetadata(), generateStaticParams(), PaginaNoticia(), Props, Home(), BotoesFlutuantes() (+33 more)

### Community 35 - "package.json"
Cohesion: 0.15
Nodes (12): next-themes, @supabase/supabase-js, tw-animate-css, typescript, next-themes@^0.4.6, @supabase/supabase-js@^2.118.0, tw-animate-css@^1.4.0, typescript@^5 (+4 more)

### Community 36 - "editor.tsx"
Cohesion: 0.16
Nodes (18): DocDaPagina, EstadoDoc, EditorPaginaInicial(), EditorInformacoes(), metadata, AtualizarAoMudar(), Editor(), Estado (+10 more)

### Community 37 - "Arquitetura"
Cohesion: 0.29
Nodes (7): Arquitetura, Cabeçalho (`site-header.tsx`), Central do aluno (`app/central-do-aluno/page.tsx`), Fonte, tema e acessibilidade global, Mapa de arquivos de `site/`, Seletor de série (`ensino.tsx`), Testes

### Community 38 - "encaixe-secoes.tsx"
Cohesion: 0.16
Nodes (17): lenis, EncaixeSecoes(), faixas(), RolagemSuave(), ANTES, DEPOIS, escolherEncaixe(), Faixa (+9 more)

### Community 40 - "previa-ao-vivo.tsx"
Cohesion: 0.26
Nodes (14): Como funciona, normalizarDa(), BotaoBarra(), Caixa, caixaDa(), Contorno(), PreviaAoVivo(), ConfigSite() (+6 more)

### Community 41 - "documento.ts"
Cohesion: 0.25
Nodes (13): camposValidos(), conteudoPadrao(), imagem(), imagemPermitida(), linkSeguro(), registrosDe(), SecaoResolvida, texto() (+5 more)

### Community 42 - "vitest"
Cohesion: 0.40
Nodes (4): vite-tsconfig-paths, vitest, vite-tsconfig-paths@^5.1.4, vitest@^3.2.4

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `documento.ts`, `ensino.tsx`, `dados.ts`, `Arquitetura`, `editor.tsx`, `hero-cinematico.tsx`, `encaixe-secoes.tsx`, `package.json`, `previa-ao-vivo.tsx`, `next`, `admin/acoes.ts`, `dependencies`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `useConfig()` (e.g. with `Mapa rápido` and `Regras de conteúdo (importante)`) actually correct?**
  _`useConfig()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ensino.tsx`, `Arquitetura`, `dados.ts`, `editor.tsx`, `react`, `encaixe-secoes.tsx`, `package.json`, `admin/acoes.ts`, `dependencies`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `ensino.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Why does `CLAUDE.md — Colégio Dask` connect `CLAUDE.md — Colégio Dask` to `README.md`, `react`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `dados.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.057942057942057944 - nodes in this community are weakly interconnected._