# Graph Report - dask  (2026-11-06)

## Corpus Check
- 116 files · ~85,156 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 685 nodes · 1666 edges · 40 communities (28 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ae7f4bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- editor.tsx
- site-header.tsx
- 1. Abertura cinematográfica (scroll controla o vídeo)
- components.json
- react
- compilerOptions
- next
- sessao.ts
- cine-test.mjs
- admin/acoes.ts
- README.md
- postcss.config.mjs
- CLAUDE.md — Colégio Dask
- Histórico, decisões e pendências
- Grafo de conhecimento do código (Graphify)
- Design
- AGENTS.md
- ensino.tsx
- Publicação (Vercel)
- dependencies
- Ferramentas, skills e servidores MCP
- scripts
- Painel administrativo (backend com Supabase)
- Colégio Dask — novo site
- eslint
- Conteúdo: de onde vem e onde editar
- seletor-imagem.tsx
- Ajudando no projeto
- editor.tsx
- tw-animate-css
- next-themes
- Arquitetura
- @dnd-kit/sortable
- sanitize-html

## God Nodes (most connected - your core abstractions)
1. `react` - 41 edges
2. `next` - 35 edges
3. `SiteHeader()` - 27 edges
4. `Button()` - 27 edges
5. `FormNoticia()` - 24 edges
6. `lucide-react` - 22 edges
7. `txt()` - 19 edges
8. `Ensino()` - 19 edges
9. `cn` - 19 edges
10. `normalizar()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Onde editar cada coisa` --references--> `whatsappLink()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/site.ts
- `Tipos e dados` --references--> `Coordenacao`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/site.ts
- `Notícias: como atualizar` --references--> `resumoInteiro()`  [INFERRED]
  docs/CONTEUDO.md → site/lib/noticias-tipos.ts
- `Tipos e dados` --references--> `Segmento`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/site.ts
- `Tipos e dados` --references--> `Noticia`  [INFERRED]
  docs/ARQUITETURA.md → site/lib/noticias-tipos.ts

## Import Cycles
- None detected.

## Communities (40 total, 12 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.12
Nodes (23): prettier, prettier-plugin-tailwindcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/sanitize-html (+15 more)

### Community 1 - "editor.tsx"
Cohesion: 0.07
Nodes (61): Como a home é montada (`app/page.tsx`), Tipos e dados, Estado, Estrutura(), ItemSecao(), larguras, Tela, PaginaInicial() (+53 more)

### Community 2 - "site-header.tsx"
Cohesion: 0.11
Nodes (19): Acessibilidade, CabecalhoFixo(), acessos, atual(), SiteHeader(), DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup() (+11 more)

### Community 3 - "1. Abertura cinematográfica (scroll controla o vídeo)"
Cohesion: 0.13
Nodes (15): 1. Abertura cinematográfica (scroll controla o vídeo), 2. Robótica: zoom pelo scroll (`showcase.tsx`), 3. Conquistas pelo scroll (`conquistas.tsx`), 4. Entradas ao rolar (`motion.tsx` + `[data-reveal]`), 5. Outras animações, Animações, Carregamento, Como a sincronização funciona (+7 more)

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (57): Regras de design, class-variance-authority, cn, radix-ui, react, FormularioLogin(), avisos, Login() (+49 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "next"
Cohesion: 0.06
Nodes (41): Central do aluno (`app/central-do-aluno/page.tsx`), lenis, next, Acesso(), CentralDoAluno(), Doc, docsPorSegmento, metadata (+33 more)

### Community 8 - "sessao.ts"
Cohesion: 0.11
Nodes (22): server-only, @supabase/ssr, entrar(), EstadoLogin, sair(), tentativas, LayoutPainel(), metadata (+14 more)

### Community 9 - "cine-test.mjs"
Cohesion: 0.09
Nodes (19): chrome, errors, evalJs(), pending, report, send(), categorias, entidades (+11 more)

### Community 10 - "admin/acoes.ts"
Cohesion: 0.19
Nodes (20): apagarMidia(), apagarNoticia(), conteudoSeguro(), enderecoDoTour(), falha(), lerVersao(), listarVersoes(), NoticiaForm (+12 more)

### Community 17 - "CLAUDE.md — Colégio Dask"
Cohesion: 0.12
Nodes (16): 1. Consulte o grafo antes de ler arquivos (economiza tokens), 2. Toda mudança vira commit e push (a Vercel publica a partir do GitHub), Armadilhas conhecidas, CLAUDE.md — Colégio Dask, Colaboradores, Comandos (rodar dentro de `site/`), Duas regras que valem sempre, Fluxo de trabalho com Git (+8 more)

### Community 18 - "Histórico, decisões e pendências"
Cohesion: 0.20
Nodes (10): Auditorias, Como foram gerados os dados, Decisões do cliente (por ordem), Estado dos testes (honesto), Histórico, decisões e pendências, Levantamento, O que foi feito, Pedido original (+2 more)

### Community 19 - "Grafo de conhecimento do código (Graphify)"
Cohesion: 0.22
Nodes (9): Como foi gerado aqui, Como usar, Economia medida, Grafo de conhecimento do código (Graphify), Instalação (cada colaborador, uma vez), Manter o grafo atualizado, O que NÃO está no grafo (de propósito), O que tem no grafo (+1 more)

### Community 20 - "Design"
Cohesion: 0.25
Nodes (8): Cores (tokens em `site/app/globals.css`), Design, Espaço, Ideia, Imagens, O que é proibido (e por quê), Responsivo, Tipografia

### Community 23 - "ensino.tsx"
Cohesion: 0.14
Nodes (25): icones, Icone(), IconeFacebook(), IconeInstagram(), IconeLinkedIn(), IconePinterest(), IconeWhatsApp(), Props (+17 more)

### Community 24 - "Publicação (Vercel)"
Cohesion: 0.25
Nodes (8): Cuidados, Domínio, Estado atual, Fluxo normal: commit + push = deploy, Publicar manualmente (CLI, sem Git), Publicação (Vercel), Quem colabora e quer ver a própria versão, Se o deploy por Git falhar

### Community 25 - "dependencies"
Cohesion: 0.10
Nodes (20): @dnd-kit/core, @dnd-kit/utilities, react-dom, shadcn, @supabase/supabase-js, dependencies, class-variance-authority@^0.7.1, cn@^0.5.0 (+12 more)

### Community 26 - "Ferramentas, skills e servidores MCP"
Cohesion: 0.25
Nodes (7): Atalhos do shadcn, Ferramentas, skills e servidores MCP, Graphify (grafo de conhecimento do código), Navegador de teste, Programas instalados na máquina (via `winget`), Servidores MCP configurados (em `~/.claude.json`, nível do usuário), Skills do Claude Code usadas (instaladas em `~/.claude/skills/`)

### Community 27 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, start, typecheck

### Community 28 - "Painel administrativo (backend com Supabase)"
Cohesion: 0.29
Nodes (7): Banco (Supabase), Criar uma pessoa da equipe, Economia de espaço, O que dá para fazer, Painel administrativo (backend com Supabase), Segurança, Testes de segurança (30/10/2026)

### Community 29 - "Colégio Dask — novo site"
Cohesion: 0.33
Nodes (6): Antes de publicar de verdade, Colégio Dask — novo site, Começando, Documentação, Estrutura do repositório, Regras de trabalho (resumo; detalhes no [CLAUDE.md](CLAUDE.md))

### Community 30 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.4.2

### Community 31 - "Conteúdo: de onde vem e onde editar"
Cohesion: 0.33
Nodes (5): Contatos usados (do site da escola), Conteúdo: de onde vem e onde editar, Fotos, Notícias: como atualizar, Onde editar cada coisa

### Community 32 - "seletor-imagem.tsx"
Cohesion: 0.17
Nodes (21): lucide-react, sonner, BibliotecaMidia(), Historico(), comprimir(), doSite, enviarImagem(), Grade() (+13 more)

### Community 33 - "Ajudando no projeto"
Cohesion: 0.22
Nodes (9): Acessos (quem convida é o dono do projeto), Achar as coisas sem ler tudo, Ajudando no projeto, Como enviar uma mudança, O que está em aberto, O que nunca vai para o Git, Regras que valem sempre, Rodar no seu computador (+1 more)

### Community 34 - "editor.tsx"
Cohesion: 0.08
Nodes (43): Como funciona, metadata, Previa(), metadata, PaginaNoticias(), generateMetadata(), generateStaticParams(), PaginaNoticia() (+35 more)

### Community 37 - "Arquitetura"
Cohesion: 0.40
Nodes (5): Arquitetura, Cabeçalho (`site-header.tsx`), Fonte, tema e acessibilidade global, Mapa de arquivos de `site/`, Seletor de série (`ensino.tsx`)

## Knowledge Gaps
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `seletor-imagem.tsx`, `editor.tsx`, `editor.tsx`, `site-header.tsx`, `devDependencies`, `next`, `ensino.tsx`, `dependencies`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `devDependencies`, `editor.tsx`, `site-header.tsx`, `editor.tsx`, `react`, `sessao.ts`, `admin/acoes.ts`, `ensino.tsx`, `dependencies`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Should `editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07403508771929825 - nodes in this community are weakly interconnected._
- **Why does `CLAUDE.md — Colégio Dask` connect `CLAUDE.md — Colégio Dask` to `README.md`, `react`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `site-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11229946524064172 - nodes in this community are weakly interconnected._
- **Should `1. Abertura cinematográfica (scroll controla o vídeo)` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._