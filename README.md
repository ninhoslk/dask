# Colégio Dask — novo site

Redesign do site do **Colégio Dask** (Dracena-SP, Fundamental I ao Ensino Médio),
feito como proposta para a escola. O site de produção atual da escola continua
em <https://colegiodask.com.br>; este repositório é a versão nova.

- **Demonstração no ar:** <https://colegio-dask.vercel.app>
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix)
- **Conteúdo:** todo real, extraído do site do colégio e do material do sistema de ensino SAS. Nenhuma foto foi criada ou gerada.

## Começando

Requisitos: Node.js 20.9 ou mais novo (testado com 24.22) e npm.

```bash
cd site
npm install
npm run dev          # http://localhost:3000
```

Outros comandos (todos dentro de `site/`):

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção; precisa passar antes de qualquer deploy |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint (inclui regras do React 19, como `set-state-in-effect`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier em `.ts` e `.tsx` |

## Estrutura do repositório

```
Dask/
├── site/            ← o projeto Next.js (tudo que roda e vai para produção)
├── docs/            ← documentação detalhada (comece pelo ARQUITETURA.md)
├── scripts/         ← utilitários usados para levantar conteúdo e testar (PowerShell/Node)
├── referencia/      ← texto extraído dos sites originais + RESUMO.md (as fotos brutas não são versionadas)
├── CLAUDE.md        ← instruções para o Claude Code e visão geral para quem colabora
└── README.md
```

## Documentação

| Arquivo | Assunto |
| --- | --- |
| [CLAUDE.md](CLAUDE.md) | Regras do projeto, convenções, comandos e armadilhas. Leia primeiro, com ou sem Claude. |
| [docs/ARQUITETURA.md](docs/ARQUITETURA.md) | Mapa de arquivos, como a página é montada, o que cada componente faz |
| [docs/CONTEUDO.md](docs/CONTEUDO.md) | De onde vem cada texto, foto e número, e onde editar |
| [docs/ANIMACOES.md](docs/ANIMACOES.md) | Como funcionam as animações (abertura cinematográfica, robótica, conquistas, entradas) e o que muda no celular |
| [docs/DESIGN.md](docs/DESIGN.md) | Direção de arte, cores, tipografia, regras visuais e por quê |
| [docs/PUBLICACAO.md](docs/PUBLICACAO.md) | Como publicar na Vercel e o estado atual do deploy |
| [docs/FERRAMENTAS.md](docs/FERRAMENTAS.md) | Skills e servidores MCP usados com o Claude Code, e como reproduzir |
| [docs/HISTORICO.md](docs/HISTORICO.md) | Decisões tomadas, o que foi feito, estado dos testes e pendências |
| [scripts/README.md](scripts/README.md) | O que cada script faz |
| [referencia/RESUMO.md](referencia/RESUMO.md) | Dados institucionais levantados dos sites originais |

## Antes de publicar de verdade

Este é um projeto de proposta. Itens que a escola precisa confirmar estão em
[docs/HISTORICO.md](docs/HISTORICO.md#pendências-e-confirmações-com-a-escola)
(endereço, uso das fotos do SAS e da Árvore, documentos marcados como "Em breve").
