# Histórico, decisões e pendências

## Pedido original

Reformar o site do **Colégio Dask** (Dracena-SP) para **oferecer à escola** um
site novo, com cara nova. Foram dados como material o arquivo do site principal
do colégio e o do SAS Educação (parceiro de material didático). Depois o cliente
pediu para ler **todo** o conteúdo dos sites ao vivo e usar as fotos do Dask e do
SAS, **sem criar foto nova**.

## Decisões do cliente (por ordem)

1. Escola em **Dracena-SP**.
2. **Não** quer seção ou aba própria do SAS: ele deve estar **integrado** ao site. A Geekie One do site antigo deve ser **esquecida** ("agora é uma escola SAS").
3. Quer um site **100% profissional**, com animações, usando todas as skills de construção de site/UI.
4. Recomendações aceitas no questionário inicial (resumo): objetivo principal é captar matrículas; proposta/protótipo; público é família de futuros alunos; Next.js + Tailwind + shadcn/ui; manter logo e paleta com cara nova; tom moderno e acolhedor com toque tecnológico; manter logo e conteúdo do site atual; CTA "Agende uma visita" com WhatsApp e botão flutuante; usar só números reais; **Central do aluno** com acessos, documentos e coordenações; rodar local e publicar na Vercel; cor dominante teal do logo com azul-marinho.
5. Primeira revisão: página "muito vazia, muito branco". Pediu mais cheia e viva. Trocar a foto da robótica (sem foco no zoom) pela da bandeira; trocar a foto de "Acontece no Dask"; a frase "Nossos alunos estiveram…" passou a mudar **conforme o scroll**; adicionar o **logo do SAS** e fazer o mesmo com a plataforma **Árvore**; "lembre de sempre usar logos"; publicar na Vercel; garantir animações boas no celular, removendo alguma **somente** no celular e **só se necessário**.
6. Segunda revisão: abertura em **vídeo cinematográfico controlado pelo scroll**, usando o vídeo do drone enviado por ele (`Aerial_view_of_school_building…mp4`) e um roteiro técnico detalhado.
7. Colocar tudo no GitHub (`ninhoslk/dask`) com CLAUDE.md e documentação completa para um amigo colaborar.
8. O repositório foi **apagado e recriado** no GitHub (mesmo endereço) para que o nome de uma conta antiga não aparecesse na lista de contribuidores; a Vercel foi reconectada ao novo repositório.
9. Instalar o **Graphify**, gerar o grafo do código (`graphify-out/`) e deixar explícito no repositório que ele deve ser consultado antes de ler arquivos, para economizar tokens ([GRAFO.md](GRAFO.md)).
10. **Toda mudança vira commit e push**, porque a Vercel publica a partir do GitHub.
11. Terceira revisão (30/out/2026): botão flutuante do WhatsApp sempre no canto inferior direito, com Instagram e "voltar ao topo"; mapa do Google com a foto aérea da fachada (enviada pelo cliente); página própria de notícias com **todas** as 265 do blog e compartilhamento no Facebook, LinkedIn, Pinterest e WhatsApp (o site oficial só tem perfis no Instagram e no Facebook; não há LinkedIn nem Pinterest da escola); menos vazio na seção SAS/Árvore, com logo e "Ver mais" levando ao site de cada parceiro; legenda da robótica removida e "com pódio." afastado da foto; fotos de "Vida no Dask" afastadas do título; Diário do Aluno e Prof. Web estavam invertidos (eduxego é o app do aluno; Eduxe Class é o do professor); ícone do WhatsApp nos telefones das coordenações; frase de conquistas com o efeito de leitura e a rolagem suave (Lenis, lerp 0,085) da onform.studio; **painel administrativo** com Supabase (ver [PAINEL.md](PAINEL.md)) e aba reservada para o tour 360°.

12. Quarta revisão (04/11/2026), confirmações do cliente: o endereço correto é **R. Venezuela, 220, Jardim América**; "mais de 700 alunos" está **correto hoje**; há **autorização** de uso das imagens e dos documentos; a conta de teste do painel **fica** (não apagar). Trabalho em branch com preview da Vercel antes de ir para a `main`.

## O que foi feito

### Levantamento
- Crawl de colegiodask.com.br: 60 páginas e, via API do WordPress, 5 páginas + 265 posts (dez/2022 → out/2026) e catálogo de 521 mídias.
- Crawl de saseducacao.com.br: 45 páginas.
- Leitura da home da Árvore e do post do Dask sobre o uso da plataforma.
- Download de 704 fotos do Dask e 231 do SAS; curadoria visual por folhas de contato numeradas; escolha de 26 + 9 fotos para o site.
- Resultado resumido em [referencia/RESUMO.md](../referencia/RESUMO.md).

### Site
- Projeto criado com `npx shadcn@latest init --template next --base radix --preset nova`.
- Direção de arte e regras de design com a taste-skill (ver [DESIGN.md](DESIGN.md)).
- Home com 10 seções + rodapé e a página Central do aluno (ver [ARQUITETURA.md](ARQUITETURA.md)).
- Animações (ver [ANIMACOES.md](ANIMACOES.md)): abertura cinematográfica, robótica, conquistas, entradas, faixas de fotos.
- SAS Educação e Árvore integrados à seção Método, cada um com logo oficial, texto e fotos.
- Publicado na Vercel (ver [PUBLICACAO.md](PUBLICACAO.md)).

### Auditorias
- `web-design-guidelines` (Vercel): aplicadas correções de toque (`touch-action`), `overflow-x`, `transition` só de propriedades nomeadas, reticências em placeholders.
- Rodadas do inspetor da taste-skill na primeira versão: 6 falhas → 2 → 1 → **0** no build de produção. Depois da versão "mais cheia e colorida" a medição voltou a apontar 1 falha (trechos vazios); veja o estado abaixo.

## Estado dos testes (honesto)

| Verificação | Resultado |
| --- | --- |
| `tsc --noEmit` | passa |
| `eslint` (app, components, lib) | passa |
| `npm run build` | passa; 2 rotas estáticas |
| `scripts/cine-test.mjs` desktop, celular e movimento reduzido, local **e** no site publicado | passa: textos nos intervalos certos, vai e volta, página segue normal depois, sem erro de console, sem rolagem horizontal |
| Seletor de série (7º ano) no navegador | passa: mostra Fundamental II, Marcia Fonte, botão do WhatsApp com a série na mensagem |
| Inspetor taste-skill **completo** | **não foi repetido** depois da abertura cinematográfica e dos últimos ajustes. A última execução completa (antes da abertura) tinha **1 FAIL** (trechos vazios em 3 pontos) e 3 avisos (18 tamanhos de fonte; uma "declaração" de 5 linhas; sem vídeo, hoje resolvido pela abertura). Depois disso foram encurtadas as seções fixas e o bloco de notícias, mas sem nova medição |
| Dispositivos reais (iPhone/Android) | **não testado** |

## Quarta revisão (04/11/2026)

- Endereço trocado para R. Venezuela, 220 (CEP 17900-000) em `lib/site.ts`, mapa incluído.
- Títulos da abertura em **2 linhas** no celular (antes 2 deles quebravam em 3): o tamanho só diminui quando a linha não cabe; desktop igual.
- Abertura com **janela de frames** (`ImageBitmap`), reduzindo a memória decodificada (ver [ANIMACOES.md](ANIMACOES.md)).
- **SEO**: sitemap, robots, canonical, Open Graph com foto real, JSON-LD `School` e `NewsArticle`; domínio só por `NEXT_PUBLIC_SITE_URL`.
- Por decisão do cliente, a página de matrícula, a galeria e os testes automatizados feitos nesta revisão **não** entraram.
- Verificado: typecheck, lint e build passam; `cine-test` desktop, celular e movimento reduzido sem erros.

## Pendências

**Conteúdo**
1. **Documentos "Em breve"** (calendário 2026, horários, datas de provas…): o uso está autorizado, mas faltam os arquivos ou links. Quando a escola enviar, entram em `docsPorSegmento` (`central-do-aluno/page.tsx`).
2. **Depoimentos de famílias**: não há depoimentos reais publicados; nada foi inventado.
3. Página dedicada de **matrícula** e **galeria** de fotos: não construídas.

**Técnico**
4. A memória da abertura caiu, mas **não foi medida em aparelho real** (iPhone/Android).
5. Sem analytics (precisa de uma conta escolhida pela escola) e sem domínio próprio (ao configurar, trocar `NEXT_PUBLIC_SITE_URL`).
6. Sem testes automatizados (unitários/E2E) nem CI no GitHub.
7. O inspetor completo da taste-skill não foi repetido nesta revisão.
8. Componentes shadcn importam `cn` do pacote npm `cn` (veja CLAUDE.md, "Armadilhas").
9. A conta de teste `admin.teste@dask.test` continua ativa por decisão do cliente.

## Como foram gerados os dados

Os scripts de levantamento estão em [../scripts/](../scripts/README.md). Resumo do
que cada dado precisou:

- **Páginas, posts e mídia do WordPress:** `GET https://colegiodask.com.br/wp-json/wp/v2/pages|posts|media?per_page=100&page=N`. Salvos em `referencia/dask/wp_content.json` e `media_catalog.json`.
- **`site/lib/noticias.json`:** dos posts mais recentes com imagem de destaque, via `wp/v2/media/<id>`: baixa a imagem `large` para `site/public/noticias/<slug>.jpg` e grava `slug`, `title`, `date`, `category` (1=Geral, 7=Eventos, 8=Ensino), `excerpt` (HTML removido, cortado no fim), `image`, `url`.
- **Cores e fontes da marca:** variáveis `--e-global-color-*` do CSS do Elementor do site antigo (`#196CA0`, `#54D4BF`, `#61CE70`, `#6EC1E4`, `#54595F`).
- **Logo do SAS:** `https://www.saseducacao.com.br/themes/custom/sas_edu_theme/quark-storybook/packages/core/src/images/logo-md.png`.
- **Logo da Árvore:** `https://assets-global.website-files.com/61155c49f7b752684a9f0584/6139298b482f344a8b3236be_logo-arvore-verde-completo.svg`.
- **Frames do vídeo:** `site/public/hero/README.md`.
- **Fotos extras** (bandeira da robótica e Árvore) foram baixadas à mão da API de mídia do post de origem (`wp/v2/media?parent=<id>`) e redimensionadas para ≤ 2200 px (JPEG 84); não fazem parte de `scripts/pick.ps1`, que registra apenas o primeiro lote.
