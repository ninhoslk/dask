# Conteúdo: de onde vem e onde editar

Todo conteúdo é real. Foi levantado em out/2026 de três fontes:

1. **colegiodask.com.br**: 5 páginas e 265 posts do blog via API do WordPress (`/wp-json/wp/v2/`).
2. **saseducacao.com.br**: 45 páginas (sistema de ensino do colégio).
3. **arvore.com.br**: página inicial (plataforma de leitura usada nas aulas de Português) e o post do blog do Dask sobre o uso da plataforma.

O texto bruto de tudo isso está em `referencia/` (ver [referencia/RESUMO.md](../referencia/RESUMO.md)).
As fotos brutas (≈940 arquivos, 490 MB) **não** estão no Git; veja `scripts/download.ps1`.

## Onde editar cada coisa

| O quê | Arquivo |
| --- | --- |
| Telefone, WhatsApp, e-mail, endereço, redes, links do Diário do Aluno e Prof. Web, CNPJ, mantenedora | `site/lib/site.ts` → `contato` |
| Mensagem pré-escrita do WhatsApp | `site/lib/site.ts` → `mensagemVisita` e `whatsappLink()` |
| Segmentos, séries, coordenações, horários de atendimento | `site/lib/site.ts` → `segmentos`, `psicologa` |
| Linha do tempo (1995–2022) | `site/lib/site.ts` → `linhaDoTempo` |
| Frase "Nossos alunos estiveram…" | `site/lib/site.ts` → `conquistas` (cada item já leva a preposição: "na Olimpíada…", "no Torneio…") |
| Links de documentos (listas de material, normas) | `site/lib/site.ts` → `documentos`; documentos "Em breve" ficam em `docsPorSegmento` no `central-do-aluno/page.tsx` |
| Notícias | Painel `/admin/noticias` (banco); sem banco, `site/lib/noticias-todas.json` (265, de `scripts/importar-noticias.mjs`) |
| SEO (domínio, imagem de compartilhamento, dados estruturados) | `site/lib/seo.tsx` + variável `NEXT_PUBLIC_SITE_URL` |
| Textos de cada seção da home | no próprio arquivo de `site/components/sections/` |
| Textos e tempos da abertura em vídeo | `site/components/sections/hero-cinematico.tsx` e `site/lib/hero-cinematico.ts` |
| Menu principal | `site/lib/site.ts` → `navegacao` |

## Contatos usados (do site da escola)

- Secretaria: (18) 3822-3018 · WhatsApp (18) 99781-5960 · secretaria@colegiodask.com.br
- Coordenação Fundamental I: Simone Tolardo, (18) 99821-7828, 8h–12h e 14h–16h
- Coordenação Fundamental II: Marcia Fonte, (18) 99759-9256, 8h–12h e 15h–17h
- Coordenação Ensino Médio: Fábio Neves, (18) 99618-5122, 9h–11h e 14h–16h
- Psicóloga escolar: Andréa Barbosa, (18) 3822-3018, seg 13h30–17h30 · ter 8h–12h · qua 7h30–11h30 (agendar pela secretaria)
- Mantenedora: Associação Dracenense de Ensino e Cultura (ACED), CNPJ 48.778.307/0001-44
- Razão: Escola de Ensino Fundamental e Médio Profª Liliana Gonzaga – Colégio Dask

> **Endereço (confirmado em 04/11/2026):** R. Venezuela, 220 – Jardim América, Dracena-SP, CEP 17900-000. O site antigo também mostra "R. Aristides Zanoni, s/n"; esse nome só continua na linha do tempo (sede inaugurada em 2001), por ser fato histórico.

## Fotos

Todas as fotos do site estão em `site/public/` e já foram redimensionadas.

| Pasta/arquivo | Origem |
| --- | --- |
| `fotos/*` sem prefixo `sas-` ou `arvore-` | Banco de fotos do blog do Colégio Dask (WordPress), 2024–2026 |
| `fotos/sas-*` | Material de divulgação do SAS Educação (saseducacao.com.br) |
| `fotos/arvore-sala.jpg`, `arvore-notebook.jpg` | Fotos **do próprio Dask** usando a Árvore, do post "Uso da plataforma Árvore nas aulas de Língua Portuguesa" |
| `fotos/arvore-leitura.jpg` | Imagem de divulgação do site da Árvore |
| `fotos/robotica-bandeira.jpg`, `robotica-bandeira-2.jpg` | Fotos dos Makerníficos do post "Dia de celebrar conquistas…" |
| `logos/sas.png` | Logo oficial do SAS Educação (do tema do site deles) |
| `logos/arvore.svg` | Logo oficial da Árvore |
| `logo-dask*.png`, `favicon.png` | Logo e ícone do colégio |
| `noticias/*.jpg` | Imagem de capa de cada post (via API de mídia do WordPress) |
| `hero/*` | Frames do vídeo de drone enviado pelo cliente |

Regra do projeto: **nenhuma imagem foi criada ou gerada**. Se precisar de outra
foto, escolha entre as de `referencia/fotos/` (rode `scripts/download.ps1` para
baixá-las) e use `scripts/pick.ps1` como modelo para redimensionar.

> **Direitos de uso:** confirmado em 04/11/2026 que há autorização de uso das
> imagens (Dask, SAS e Árvore).

## Notícias: como atualizar

As notícias ficam no banco e são editadas no painel (`/admin/noticias`). O
arquivo `site/lib/noticias-todas.json` (todas as 265 do WordPress do colégio) é o
fallback quando o banco não responde; para regenerá-lo, rode dentro de `site/`:
`node ../scripts/importar-noticias.mjs`. Para copiar de novo para o banco:
`scripts/semear-noticias.mjs` (ver [PAINEL.md](PAINEL.md)). As capas continuam
hospedadas em colegiodask.com.br.

O resumo vem cortado do WordPress; `resumoInteiro()` (em `lib/noticias-tipos.ts`)
mostra só até a última frase completa.
