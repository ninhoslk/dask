# Conteúdo: de onde vem e onde editar

Todo conteúdo é real. Foi levantado em out/2026 de três fontes:

1. **colegiodask.com.br**: 5 páginas e 265 posts do blog via API do WordPress (`/wp-json/wp/v2/`).
2. **saseducacao.com.br**: 45 páginas (sistema de ensino do colégio).
3. **arvore.com.br**: página inicial (plataforma de leitura usada nas aulas de Português) e o post do blog do Dask sobre o uso da plataforma.

O texto bruto de tudo isso está em `referencia/` (ver [referencia/RESUMO.md](../referencia/RESUMO.md)).
As fotos brutas (≈940 arquivos, 490 MB) **não** estão no Git; veja `scripts/download.ps1`.

## Onde editar cada coisa

**Pelo painel** (`/admin`), sem mexer em código. Ver [PAINEL.md](PAINEL.md).

| O quê | Onde no painel |
| --- | --- |
| Telefone, WhatsApp, mensagem pronta, e-mail, horário de atendimento, mapa | Informações do site → Contatos e atendimento |
| Nome, logos, endereço, bairro, CEP, CNPJ, mantenedora | Informações do site → Identidade e endereço |
| Instagram, Facebook e outros perfis | Informações do site → Redes sociais |
| Abas do menu (inclui Trabalhe conosco), Área do aluno, botão de visita | Informações do site → Menu do topo |
| Segmentos, séries, coordenações, telefones, horários, psicóloga, documentos de cada segmento | Informações do site → Segmentos e coordenação |
| Cartões e textos da Central do aluno, link das normas | Informações do site → Central do aluno |
| Links e créditos do rodapé | Informações do site → Rodapé |
| Título e descrição no Google, textos da página de notícias | Informações do site → Páginas e buscadores |
| Cores e cantos arredondados | Informações do site → Cores e aparência |
| Textos, fotos, botões e ordem das seções da home (linha do tempo, conquistas…) | Página inicial |
| Notícias | Notícias (a reserva sem banco é `site/lib/noticias-todas.json`) |

Os **valores de fábrica** (o que aparece quando ninguém mexeu) estão em
`site/lib/site.ts`, `site/lib/conteudo/esquema.ts` e `site/lib/conteudo/config.ts`.
Tempos e frames da abertura em vídeo: `site/lib/hero-cinematico.ts`.

## Contatos usados (do site da escola)

- Secretaria: (18) 3822-3018 · WhatsApp (18) 99781-5960 · secretaria@colegiodask.com.br
- Coordenação Fundamental I: Simone Tolardo, (18) 99821-7828, 8h–12h e 14h–16h
- Coordenação Fundamental II: Marcia Fonte, (18) 99759-9256, 8h–12h e 15h–17h
- Coordenação Ensino Médio: Fábio Neves, (18) 99618-5122, 9h–11h e 14h–16h
- Psicóloga escolar: Andréa Barbosa, (18) 3822-3018, seg 13h30–17h30 · ter 8h–12h · qua 7h30–11h30 (agendar pela secretaria)
- Mantenedora: Associação Dracenense de Ensino e Cultura (ACED), CNPJ 48.778.307/0001-44
- Razão: Escola de Ensino Fundamental e Médio Profª Liliana Gonzaga – Colégio Dask

> **Endereço:** o site atual da escola mostra dois: "R. Aristides Zanoni, s/n" (CEP 17911-262 e também 17900-000) e "R. Venezuela, 220". O novo site usa **R. Aristides Zanoni, s/n – Jardim América, CEP 17911-262**. Confirmar com a escola.

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

> **Direitos de uso:** as fotos do SAS e da Árvore são material de divulgação
> deles. O logo e o conteúdo são exibidos para destacar a parceria, mas convém a
> escola confirmar com cada empresa antes de publicar em definitivo.

## Notícias: como atualizar

O arquivo `site/lib/noticias.json` foi gerado assim (PowerShell, ver o trecho em
[HISTORICO.md](HISTORICO.md#como-foram-gerados-os-dados)): lista os 9 posts mais
recentes que têm imagem de destaque, baixa a imagem para `public/noticias/` e
grava `slug`, `title`, `date`, `category`, `excerpt`, `image` e `url`.
O `url` aponta para o post no site da escola; o link abre em nova aba.

O campo `excerpt` vem cortado do WordPress. `noticias.tsx` mostra só até a última
frase completa. O primeiro item usa uma foto alternativa (`outraFoto`) porque a
capa original já aparece na seção de robótica.
