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
12. Quarta revisão (nov/2026): seção **"Vida no Dask" removida** (e o item do menu); "Nossa história" volta à lista estática da `main` (a versão animada com GSAP foi descartada e o pacote `gsap` removido); no Método, o texto "O professor orienta…" fica logo abaixo do título; a dica "Role para chegar à escola" subiu para não ficar atrás dos botões flutuantes. Depois: na Escola, "Agendar visita" e o link do Tour 360° ocupam o espaço sob Onde/Desde/Secretaria; o texto do Método cabe em duas linhas a partir do tablet; o título "Do primeiro ano ao vestibular." perdeu o recuo da primeira linha.

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
- Home com 9 seções + rodapé e a página Central do aluno (ver [ARQUITETURA.md](ARQUITETURA.md)).
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

## Pendências e confirmações com a escola

**Conteúdo**
1. **Endereço:** o site atual mostra "R. Aristides Zanoni, s/n" e "R. Venezuela, 220", com CEPs diferentes. O novo usa Aristides Zanoni, CEP 17911-262.
2. **"Mais de 700 alunos":** no site da escola é um marco de **2021**; o novo site o apresenta como número de hoje (Apresentação, Escola). Confirmar o número atual.
3. **Documentos "Em breve"** (calendário 2026, horários, datas de provas…) ainda não têm link, igual ao site atual.
4. **Uso de imagens e marcas do SAS e da Árvore:** confirmar com cada empresa. As fotos do SAS vêm do site deles; os logos são os oficiais.
5. Fotos de alunos vêm do blog da própria escola; a escola deve confirmar autorização de uso de imagem.
6. **Sem depoimentos de famílias**: não foram encontrados reais do Dask e nada foi inventado.

**Itens aceitos no questionário inicial e ainda não construídos**
7. Página dedicada de **Matrícula / Agende uma visita** (hoje o CTA é WhatsApp).
8. **Galeria** de fotos.
9. **Depoimentos** (dependem de depoimentos reais).
10. ~~Blog "Acontece no Dask" com **filtros** Ensino/Eventos~~ feito: `/noticias` tem filtros por categoria e busca.

**Técnico**
11. **Memória na abertura em vídeo:** ~~todos os frames ficavam decodificados~~. Desde nov/2026 só fica uma janela ao redor do frame atual (`janelaFrames` em `lib/hero-cinematico.ts`; ver [ANIMACOES.md](ANIMACOES.md#carregamento)), o que corta o pior caso pela metade no celular. **Ainda falta medir em aparelho real** (principalmente Safari do iOS) se a rolagem rápida continua sem quadros vazios; se pesar, os próximos passos são `ImageBitmap` ou frames menores.
12. ~~O título da abertura quebra em 3 linhas no celular~~ corrigido em nov/2026: abaixo de 640 px o tamanho é `clamp(34px, 11vw, 52px)` e "Evoluir / para transformar." cabe em duas linhas de 320 a 640 px. Se o texto for trocado no painel por um mais longo, pode voltar a quebrar.
13. Notícias novas são cadastradas pelo painel; as do blog antigo foram importadas uma vez. Se a escola continuar publicando no WordPress, é preciso rodar `scripts/importar-noticias.mjs` e `semear-noticias.mjs` de novo (não há sincronização automática).
14. SEO básico apenas (título e descrição). Falta imagem Open Graph, sitemap, dados estruturados.
15. Sem analytics, sem domínio próprio, sem testes automatizados (unitários/E2E) no repositório.
16. Componentes shadcn importam `cn` do pacote npm `cn` (veja CLAUDE.md, "Armadilhas").
17. O 21st.dev (Magic) e o Chrome DevTools MCP foram instalados mas **não usados**.
18. O freio de tentativas de login do painel (`app/admin/login/acoes.ts`) fica na memória de cada instância do servidor; na Vercel cada instância conta separado. O limite por IP do próprio Supabase Auth continua valendo por trás. Para um freio único, seria preciso guardar as tentativas no banco (tabela + função), o que pede uma migração nova.

## Como foram gerados os dados

Os scripts de levantamento estão em [../scripts/](../scripts/README.md). Resumo do
que cada dado precisou:

- **Páginas, posts e mídia do WordPress:** `GET https://colegiodask.com.br/wp-json/wp/v2/pages|posts|media?per_page=100&page=N`. Salvos em `referencia/dask/wp_content.json` e `media_catalog.json`.
- **`site/lib/noticias-todas.json`:** `scripts/importar-noticias.mjs` lê todos os posts de `wp/v2/posts` (com `_embed` para a imagem) e grava `slug`, `title`, `date`, `category` (1=Geral, 7=Eventos, 8=Ensino), `excerpt`, `content`, `image`, `thumb` e `url`. O antigo `lib/noticias.json` (9 notícias com capa em `public/noticias/`) foi removido em nov/2026 por não ser mais usado; as capas continuam em `public/noticias/`.
- **Cores e fontes da marca:** variáveis `--e-global-color-*` do CSS do Elementor do site antigo (`#196CA0`, `#54D4BF`, `#61CE70`, `#6EC1E4`, `#54595F`).
- **Logo do SAS:** `https://www.saseducacao.com.br/themes/custom/sas_edu_theme/quark-storybook/packages/core/src/images/logo-md.png`.
- **Logo da Árvore:** `https://assets-global.website-files.com/61155c49f7b752684a9f0584/6139298b482f344a8b3236be_logo-arvore-verde-completo.svg`.
- **Frames do vídeo:** `site/public/hero/README.md`.
- **Fotos extras** (bandeira da robótica e Árvore) foram baixadas à mão da API de mídia do post de origem (`wp/v2/media?parent=<id>`) e redimensionadas para ≤ 2200 px (JPEG 84); não fazem parte de `scripts/pick.ps1`, que registra apenas o primeiro lote.
