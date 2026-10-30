# Publicação (Vercel)

## Fluxo normal: commit + push = deploy

O repositório `ninhoslk/dask` está **conectado à Vercel** (feito pelo Breno no painel
da Vercel). A regra do projeto é: **toda mudança vira commit e push**.

- `git push` na **`main`** → deploy de **produção**.
- Push em qualquer outra branch / PR → **URL de preview**.
- A Vercel precisa estar com **Root Directory = `site`** (o projeto Next.js não está na raiz do repositório). Framework: Next.js (detectado). Build: `npm run build` (padrão). Sem variáveis de ambiente.
- Antes do push, rode `typecheck`, `lint` e `build` em `site/`: se o build local falha, o deploy da Vercel também falha.

```bash
cd site && npm run typecheck && npm run lint && npm run build
cd .. && graphify update .          # atualiza o grafo (ver docs/GRAFO.md)
git add -A && git commit -m "Descreve a mudança" && git push
```

Depois do push, confira o deploy no painel da Vercel (aba Deployments) ou, com a CLI:
`cd site && npx vercel@latest ls`.

## Estado atual

- **URL de demonstração:** <https://colegio-dask.vercel.app>
- Conta Vercel do Breno: **brenobaalves-7852** (plano Hobby). O projeto antigo `colegio-dask` foi publicado antes pela CLI, a partir de `site/`.
- Última conferência manual no endereço público (deploy pela CLI): home e `/central-do-aluno` respondem 200, 37 imagens carregam, sem erro de console, abertura em vídeo funciona em desktop e celular.
- Em 30/10/2026 o repositório foi **apagado e recriado** no GitHub (mesmo endereço), e a Vercel foi reconectada pelo Breno (projeto `colegio-dask` → `ninhoslk/dask`, branch de produção `main`).
- O primeiro deploy por Git falhou porque o **Root Directory** do projeto estava vazio (raiz). Foi corrigido para `site` por API (`vercel api /v9/projects/<id> -X PATCH -f rootDirectory=site`).

### Se o deploy por Git falhar

| Sintoma no log | Causa | Correção |
| --- | --- | --- |
| `Couldn't find any pages or app directory` | Root Directory vazio ou errado | Settings → Build and Deployment → Root Directory = `site` |
| Erro de TypeScript/ESLint no build | Push com `typecheck`/`build` quebrado | Rode `npm run typecheck && npm run build` em `site/`, corrija e envie de novo |
| Deploy "Ready", mas página antiga | Alias de produção ainda no deploy anterior | Veja Deployments; só `main` atualiza o domínio de produção |

Ver logs: `cd site && npx vercel@latest inspect <url-do-deploy> --logs`.
No Git Bash do Windows, prefixe comandos `vercel api /…` com `MSYS_NO_PATHCONV=1`,
senão o caminho é convertido para um caminho de arquivo.

## Publicar manualmente (CLI, sem Git)

Requer conta Vercel e a CLI (via `npx`, sem instalar):

```bash
cd site
npm run build                          # precisa passar
npx vercel@latest login                # uma vez; autoriza no navegador
npx vercel@latest link --yes --project colegio-dask   # liga a pasta ao projeto
npx vercel@latest deploy --prod -y     # publica e atualiza colegio-dask.vercel.app
```

`link` cria `site/.vercel/` e `site/.env.local` (token OIDC). **Ambos estão no
`.gitignore`; nunca commite.** O `.vercelignore` impede que `node_modules`, `.next`,
`.claude` e `.taste-skill` sejam enviados.

Para uma publicação de teste sem mexer em produção, tire o `--prod`
(gera uma URL de preview).

A CLI tem `deploy --temporary` (sem conta), mas a Vercel recusou nas tentativas
feitas ("Temporary deployments aren't available for this attempt") e exigiu login.

## Quem colabora e quer ver a própria versão

Duas opções:

1. **Seu próprio deploy:** rode os comandos acima com a sua conta e outro nome de projeto (`link --project <nome>`). Cada pessoa tem a própria URL.
2. **Integração com o GitHub** (recomendado para o time): na Vercel, "Add New Project" → importar `ninhoslk/dask` → **Root Directory = `site`**, framework Next.js detectado automaticamente. Cada branch/PR ganha uma URL de preview e `main` publica em produção. Quem faz isso precisa ter permissão de administrador no repositório.

## Domínio

Nenhum domínio próprio está configurado. Se a escola aprovar, o domínio
(`colegiodask.com.br`) deve ser apontado só depois de a escola autorizar a troca do site.

## Cuidados

- O site tem **17 MB + 5,6 MB** de frames em `public/hero/` e ≈ 18 MB de fotos e capas de notícias; o upload leva alguns minutos.
- Não há variáveis de ambiente necessárias para rodar ou publicar o site.
- Não commite `site/.env.local`: ele contém um token temporário da Vercel.
