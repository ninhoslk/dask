# Ferramentas, skills e servidores MCP

O site foi construído em sessões do **Claude Code** (app desktop, Windows 11).
Nada disso é necessário para **rodar** o site (basta Node e npm), mas ajuda a
continuar no mesmo padrão.

## Programas instalados na máquina (via `winget`)

| Programa | Para quê |
| --- | --- |
| Node.js LTS (24.22) | rodar o site, `npx` |
| Git 2.56 | controle de versão; a CLI do shadcn clona templates com ele |
| FFmpeg 9.0 (Gyan.FFmpeg) | analisar e converter o vídeo da abertura em frames |
| Vercel CLI (via `npx vercel@latest`) | publicar |
| Google Chrome | testes headless (`scripts/cine-test.mjs`, inspetor da taste-skill) |

## Skills do Claude Code usadas (instaladas em `~/.claude/skills/`)

Skills são pastas com um `SKILL.md`. Não estão neste repositório (ficam no perfil
de cada pessoa). Para reproduzir, copie a pasta indicada de cada repositório para
`~/.claude/skills/<nome>/`.

| Skill | Origem | Para quê foi usada |
| --- | --- | --- |
| `frontend-design` | arquivo `frontend-design.zip` (skill de design de interface da Anthropic, com `LICENSE.txt`) | Princípios: partir do assunto, tipografia com personalidade, evitar visual genérico |
| `taste-skill` | <https://github.com/leonxlnx/taste-skill> → `skills/taste-skill` | Direção de arte sorteada, regras da "casa", inspetor em Chrome real (`inspect.mjs`, `lint.mjs`), crítica visual |
| `shadcn` | <https://github.com/shadcn-ui/ui> → `skills/shadcn` | Regras de composição dos componentes shadcn/ui, CLI |
| `migrate-radix-to-base` | mesmo repositório do shadcn | instalada junto; não usada |
| `web-design-guidelines` | <https://github.com/vercel-labs/agent-skills> → `skills/web-design-guidelines` | Auditoria de acessibilidade e boas práticas (busca as regras em `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`) |
| `grill-me` / `grilling` | <https://github.com/mattpocock/skills> | A rodada de perguntas inicial sobre o que o cliente queria |
| demais skills do mattpocock | mesmo repositório (engineering, productivity, misc) | instaladas (`tdd`, `triage`, `to-spec`, `handoff`…); não usadas neste projeto |
| `21st-ui` | <https://github.com/21st-dev/magic-mcp> → `skills/21st-ui` | instalada; o servidor MCP não carregou na sessão, então não foi usada |
| `chrome-devtools`, `a11y-debugging`, `debug-optimize-lcp`… | <https://github.com/ChromeDevTools/chrome-devtools-mcp> → `skills/` | instaladas; o servidor MCP não carregou, então não foram usadas |

A skill `code-review` do mattpocock **não** foi instalada porque o nome colide com
uma skill nativa do Claude Code.

## Servidores MCP configurados (em `~/.claude.json`, nível do usuário)

| Servidor | Comando | Observação |
| --- | --- | --- |
| `chrome-devtools` | `npx -y chrome-devtools-mcp@latest` | |
| `shadcn` | `npx -y @jpisnice/shadcn-ui-mcp-server` | o repositório GitHub `Jpisnice/shadcn-ui-mcp-server` deu 404 no download; o pacote npm existe (3.0.0) |
| `magic` (21st.dev) | `npx -y @21st-dev/magic@latest` com `API_KEY` | exige chave pessoal da 21st.dev |

No Windows, o Claude Code precisa de `"command": "cmd", "args": ["/c", "npx", …]`.
Esses servidores só aparecem em sessões **novas** e **não chegaram a ser usados**
nas sessões que construíram o site.

> **Segurança:** a chave da 21st.dev ficou só em `~/.claude.json` do computador do
> Breno e **não** está no repositório. Cada colaborador deve gerar a sua em
> <https://21st.dev/mcp>. Nunca coloque chaves em arquivos versionados.

## Graphify (grafo de conhecimento do código)

Instalado com `uv tool install --python 3.13 graphifyy` (v0.9.97) e `graphify install`. Gera `graphify-out/`, que fica no repositório. Uso, atualização, limites e instalação para colaboradores: [GRAFO.md](GRAFO.md). Programas extras instalados por causa dele: `uv` (`winget install astral-sh.uv`).

## Atalhos do shadcn

```bash
cd site
npx shadcn@latest info --json      # configuração do projeto e componentes instalados
npx shadcn@latest add <componente> # adiciona (ex.: dialog, accordion)
npx shadcn@latest docs <componente>
```

Componentes já adicionados: `alert-dialog`, `badge`, `button`, `dialog`, `dropdown-menu`, `field`, `input`, `label`, `select`, `separator`, `sheet`, `sonner`, `switch`, `tabs`, `textarea`, `toggle`, `toggle-group`.

## Navegador de teste

Para ver o site e testar interação, use o Chrome normal em <http://localhost:3000>
e as ferramentas de desenvolvedor (F12 → modo dispositivo para celular). Para provar
animação por scroll com capturas, use `scripts/cine-test.mjs` (Chrome headless).
