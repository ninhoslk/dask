# Ajudando no projeto

Guia para quem vai colaborar no site do Colégio Dask. O código está em `site/`;
a visão geral do projeto está em [CLAUDE.md](../CLAUDE.md) e [README.md](../README.md).

## Acessos (quem convida é o dono do projeto)

| O quê | Para quê | Precisa? |
| --- | --- | --- |
| **GitHub**, repositório `ninhoslk/dask` (Settings → Collaborators → Add people) | Baixar o código e abrir PRs | Sim |
| **Vercel**, projeto `colegio-dask` (Team → Invite) | Ver o resultado de cada PR e os logs de deploy | Só se for mexer na publicação |
| **Supabase**, projeto "Dask Site" (Organization → Team) | Mexer no banco, nas regras de acesso e nos arquivos | Só se for mexer no banco |

Quem não mexe no banco **não precisa de nenhuma chave**: sem as variáveis de
ambiente o site funciona com os textos padrão e com o arquivo de notícias
(`site/lib/noticias-todas.json`). Só o painel `/admin` depende do Supabase.

Se precisar do painel, peça ao dono as três variáveis de `site/.env.example`
por um canal privado (mensagem direta, gerenciador de senhas), nunca por
e-mail aberto, issue ou PR. Elas vão em `site/.env.local`, que não vai para o Git.
A chave `service_role` do Supabase **nunca** é usada nem pedida.

## Rodar no seu computador

```bash
git clone https://github.com/ninhoslk/dask.git
cd dask/site
npm install
npm run dev      # http://localhost:3000
```

O Next.js desta versão (16) tem mudanças em relação ao que a maioria conhece.
Antes de mexer em rotas, cache ou `proxy.ts`, leia o guia correspondente em
`site/node_modules/next/dist/docs/`.

## Como enviar uma mudança

1. Crie uma branch curta: `git switch -c feat/o-que-voce-faz`.
2. Antes do PR, na pasta `site/`, tudo precisa passar:
   `npm run typecheck && npm run lint && npm run build`.
3. Olhe a página no navegador, **no computador e no celular**.
4. Commit em português, no imperativo ("Corrige…", "Adiciona…"), e abra o PR.
   A Vercel gera um endereço de prévia para cada PR.
5. **Não faça push direto na `main`**: cada push nela publica o site para todo mundo.

## Regras que valem sempre

- **Nada inventado.** Texto, número, nome e foto vêm dos sites reais da escola,
  do SAS e da Árvore. Sem depoimentos ou estatísticas que não existam.
- **Sem imagens geradas.** Só fotos reais. Se faltar uma, avise.
- **Contatos, endereço e links** ficam só em `site/lib/site.ts`.
- **Design:** [DESIGN.md](DESIGN.md). Títulos em no máximo duas linhas, sem
  gradientes, uma só fonte, cores pelos tokens de `globals.css`.
- **Animação:** [ANIMACOES.md](ANIMACOES.md). Só `transform` e `opacity`, respeitar
  `prefers-reduced-motion`, trabalho de scroll dentro de `requestAnimationFrame`.
- **Painel e banco:** [PAINEL.md](PAINEL.md). As mudanças no banco entram como
  novos arquivos em `supabase/migrations/`, nunca editando as antigas.

## O que nunca vai para o Git

`.env*`, `.vercel/`, qualquer chave ou senha (inclusive o login de teste do
painel), fotos brutas de `referencia/` e vídeos `.mp4`.

## Achar as coisas sem ler tudo

O repositório tem um mapa do código em `graphify-out/`. Para entender de onde
vem algo, comece por ele:

```bash
graphify query "como o painel salva o rascunho"
graphify explain "HeroCinematico"
```

Depois de mexer no código, atualize com `graphify update .`. Detalhes em
[GRAFO.md](GRAFO.md).

## O que está em aberto

A lista completa e as decisões já tomadas estão em [HISTORICO.md](HISTORICO.md).
Os pontos que mais pedem ajuda:

- **Tour 360°:** hoje é a exportação do Panoee (`tour/`), que ainda busca dados e
  fotos nos servidores deles. A saída definitiva é um tour próprio, a partir das
  fotos 360 originais.
- **"Mais de 700 alunos":** o site da escola dá esse número como marco de 2021;
  falta a escola confirmar que vale para hoje.
- **Supabase:** desligar o cadastro público e ligar a proteção contra senhas
  vazadas (só no painel do Supabase) e apagar a conta de teste do `/admin` antes
  de entregar o site à escola.
