# Tour 360° (exportação do Panoee)

Pasta estática publicada como projeto separado na Vercel, **colegio-dask-tour**,
em https://colegio-dask-tour.vercel.app. O site mostra o tour em `/tour-360`
dentro de um quadro, que só carrega quando o visitante clica em "Iniciar".

Fica em endereço próprio porque a exportação usa os mesmos caminhos do site
(`/_next/`, `/static/`) e porque os scripts do Panoee (análise de visitas,
Google Analytics deles) ficam isolados do painel e dos logins.

Atenção: a exportação **não** é independente. Os dados do tour e as fotos 360
vêm dos servidores do Panoee (`studio-api.panoee.com`, `assets.panoee.com`);
se o projeto ou a conta lá mudar, o tour para de funcionar.

## Trocar por uma exportação nova

1. Copie o conteúdo da nova pasta `out` para cá (mantenha `vercel.json`,
   `README.md` e `.gitignore`).
2. Apague o que não é usado: `*.map`, `.DS_Store`, `*.php`, `*.swf`,
   `export-full.html`, `.claude/`.
3. Publique: `npx vercel deploy --prod --yes` (dentro desta pasta).

`vercel.json` define cache longo para os arquivos e libera o quadro só para o
site do colégio (`frame-ancestors`). Se a escola passar a usar outro domínio,
acrescente-o ali.
