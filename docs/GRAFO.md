# Grafo de conhecimento do código (Graphify)

O repositório inclui, em `graphify-out/`, um **grafo do código do site** gerado
pelo [Graphify](https://github.com/Graphify-Labs/graphify) (pacote `graphifyy`,
com dois "y"). Ele existe para **economizar tokens**: em vez de abrir arquivos
inteiros para descobrir "quem usa o quê", pergunta-se ao grafo e ele devolve só o
trecho relevante.

> **Regra do projeto:** para perguntas sobre o código, rode `graphify query`,
> `graphify explain` ou `graphify path` **antes** de ler arquivos. Depois de mudar
> código, rode `graphify update .` e commite o `graphify-out/` junto.
> (Está também no topo do [CLAUDE.md](../CLAUDE.md).)

## O que tem no grafo

| Item | Valor (gerado em 30/10/2026, a partir do commit `16063371`) |
| --- | --- |
| Arquivos lidos | 53: 39 de código (`site/app`, `site/components`, `site/lib`, `scripts`, configs) e os `.md` da documentação |
| Nós | 363 (arquivos, funções, componentes, constantes, dependências e **títulos das seções dos `.md`**) |
| Conexões | 603 (importa, chama, contém, usa) |
| Comunidades | 23 (grupos de nós bem ligados entre si) |
| Origem das conexões | 97% `EXTRACTED` (lidas direto do código/texto); 3% `INFERRED` (21 conexões, confiança média 0,95) |
| Custo | **0 tokens e 0 chamadas de API** (análise local: AST com tree-sitter e estrutura dos `.md`) |

Arquivos em `graphify-out/` (versionados, exceto `cache/`, as cópias datadas e arquivos com caminho da máquina):

| Arquivo | Para quê |
| --- | --- |
| `graph.json` | O grafo completo. É o que `graphify query/path/explain` consultam. |
| `GRAPH_REPORT.md` | Resumo: nós mais conectados, comunidades, ciclos de import, perguntas sugeridas |
| `graph.html` | Grafo interativo; abra no navegador (clicar em nós, filtrar, buscar) |
| `manifest.json` | Hash de cada arquivo, para o `update` reprocessar só o que mudou |
| `.graphify_analysis.json`, `.graphify_labels.json(.sig)` | Análise e rótulos das comunidades |

### O que NÃO está no grafo (de propósito)

- **O conteúdo semântico dos `.md`, imagens e vídeo:** exigiria uma etapa com modelo de IA, que **gasta tokens** (`/graphify --update` no assistente, ou uma chave de API). Não foi feita. Dos `.md` entra só a **estrutura de títulos**, sem custo: uma consulta como `graphify query "regras de animação"` devolve a seção certa do `CLAUDE.md` com o número da linha.
- **CSS** (`globals.css`) e **JSON de dados** (`noticias.json`): o Graphify não extrai símbolos deles. Para CSS e dados, use `grep` ou leia o arquivo.
- `site/public/` e `referencia/` estão no `.graphifyignore` (mídia e material bruto).
- Arquivos de código que a ferramenta avisou que não têm símbolos: `scripts/crawl.ps1`, `pick.ps1`, `sheet.ps1`, `site/lib/utils.ts`.

## Como usar

```bash
graphify query "como a abertura controla o vídeo pelo scroll"
graphify explain "HeroCinematico"          # um nó e seus vizinhos
graphify path "Home" "whatsappLink"        # caminho entre dois nós
graphify affected "whatsappLink"           # quem é afetado se eu mudar isto
graphify god-nodes                         # os nós mais conectados
```

**Dica importante:** as buscas casam com **nomes** de nós (funções, componentes,
arquivos), não com prosa. `graphify explain "HeroCinematico"` funciona muito bem;
`graphify query "onde ficam os contatos"` pode partir de um nó irrelevante. Use
identificadores, e se vier cortado, aumente `--budget`.

Códigos de saída: `0` resposta, `3` nome ambíguo (mostra candidatos), `4` nenhum nó.

### Economia medida

`graphify benchmark graphify-out/graph.json` neste projeto: corpus de ~18 mil
palavras (~24 mil tokens se lido inteiro) contra ~1,8 mil tokens por consulta
média, ou seja, **cerca de 13x menos**. O projeto é pequeno e esse benchmark usa
perguntas genéricas do próprio Graphify; o ganho absoluto cresce junto com o código.

## Manter o grafo atualizado

```bash
graphify update .      # reprocessa só o que mudou (código e títulos dos .md); sem API
```

Rode antes de cada commit que mude código ou documentação e commite o
`graphify-out/` junto (é reescrito inteiro a cada build, então um diff grande nele
em PR é esperado; não é ruído).

O `update` guarda uma cópia do grafo anterior numa pasta com a data
(`graphify-out/2026-10-30/`). Essas pastas **não são versionadas** (estão no
`.gitignore`), para o repositório não crescer a cada atualização. `GRAPH_REPORT.md` mostra "Built from commit …": se for diferente de
`git rev-parse HEAD` **e** houve mudança de código desde então, o grafo está velho.

Para reconstruir do zero (por exemplo, após muitas mudanças):

```bash
GRAPHIFY_BACKEND=none graphify extract . --code-only
GRAPHIFY_BACKEND=none graphify cluster-only .
```

`GRAPHIFY_BACKEND=none` garante que nenhum modelo de IA é chamado (sem isso, o
Graphify usa qualquer chave de API que encontrar no ambiente para nomear
comunidades). Sem isso e sem chave, os nomes das comunidades ficam "Community N",
derivados do nó mais conectado, que é o que está no repositório.

## Instalação (cada colaborador, uma vez)

Requer o `uv` (ou `pipx`). Python 3.10+ é gerenciado pelo `uv`.

```bash
# Windows:  winget install astral-sh.uv
# macOS:    brew install uv
uv tool install --python 3.13 graphifyy   # o pacote oficial tem DOIS y
graphify install            # registra a skill /graphify no Claude Code (~/.claude/skills)
graphify claude install     # no clone do projeto: gancho que faz o Claude consultar o grafo antes de buscar
```

Observações:

- Instale **`graphifyy`** (dois y). Outros pacotes `graphify*` no PyPI não são oficiais.
- `graphify install` também cria/atualiza `~/.claude/CLAUDE.md` (arquivo global do usuário) com uma linha sobre a skill.
- `graphify claude install` grava o gancho em `.claude/settings.json` com o **caminho absoluto** do `graphify` da sua máquina. Por isso a pasta `.claude/` está no `.gitignore`: cada pessoa roda o comando e gera o seu. A seção "graphify" que ele escreve no `CLAUDE.md` já está versionada.
- No Windows, se `uv tool install` falhar com "Missing expected target directory for Python minor version link", use `--python 3.13` como acima.
- Sem a skill instalada, o grafo continua útil: `graphify query/explain/path` funcionam no terminal, e `graph.html` abre em qualquer navegador.

## Privacidade

- Código é processado **localmente**; nada sai da máquina e não há telemetria.
- Cada `query`, `path` e `explain` é registrado em `~/.cache/graphify-queries.log` (hora, pergunta, nós devolvidos). Desligue com `GRAPHIFY_QUERY_LOG_DISABLE=1`.

## Como foi gerado aqui

1. `winget install astral-sh.uv` e `uv tool install --python 3.13 graphifyy` (versão 0.9.97).
2. `graphify install` (skill em `~/.claude/skills/graphify`).
3. `.graphifyignore` na raiz: `site/public/`, `referencia/`, `site/node_modules/`, `site/.next/`, `site/.taste-skill/`.
4. `GRAPHIFY_BACKEND=none graphify extract . --code-only` e `graphify cluster-only .`.
5. `graphify claude install` para a seção do `CLAUDE.md` e o gancho local.
