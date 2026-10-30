# Publicação (Vercel)

## Estado atual

- **URL de demonstração:** <https://colegio-dask.vercel.app>
- Projeto `colegio-dask` na conta Vercel **brenobaalves-7852** (plano Hobby).
- Publicado **pela CLI**, de dentro de `site/` (`vercel deploy --prod`). Ainda **não** há integração com o GitHub: um `git push` **não** publica sozinho.
- Último deploy conferido no endereço público: home e `/central-do-aluno` respondem 200, 37 imagens carregam, sem erro de console, abertura em vídeo funciona em desktop e celular.

## Publicar manualmente

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
