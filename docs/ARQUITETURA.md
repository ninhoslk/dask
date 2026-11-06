# Arquitetura

Projeto Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 e shadcn/ui
(estilo `radix-nova`, base Radix, ícones `lucide`), com **Supabase** como banco
do painel administrativo.

O site público é pré-renderizado e revalidado: a home, as notícias e o tour
leem o banco com cache (etiqueta `conteudo`, revalida a cada hora) e o painel
invalida esse cache ao publicar. **Sem banco** (variáveis ausentes ou Supabase
fora do ar) tudo continua funcionando com os textos padrão de
`lib/conteudo/esquema.ts` e as notícias de `lib/noticias-todas.json`. O painel
(`/admin`) é sempre dinâmico. Detalhes do painel em [PAINEL.md](PAINEL.md).

| Rota | O quê |
| --- | --- |
| `/` | Home (10 seções editáveis) |
| `/central-do-aluno` | Acessos, documentos por segmento, coordenações |
| `/noticias`, `/noticias/[slug]` | Lista com filtros e busca; página de cada notícia com compartilhamento |
| `/tour-360` | Tour virtual, carregado só ao clicar |
| `/admin/*` | Painel: editor visual, notícias, mídia, tour (login pelo Supabase Auth; `proxy.ts` renova a sessão) |

## Mapa de arquivos de `site/`

```
site/
├── app/
│   ├── layout.tsx                  fonte, metadados, skip link, <Motion />
│   ├── page.tsx                    home: lê o documento publicado e as notícias
│   ├── globals.css                 tokens, utilitários e CSS de TODAS as animações
│   ├── central-do-aluno/page.tsx   página de acessos e documentos
│   ├── noticias/                   lista (page.tsx) e notícia ([slug]/page.tsx)
│   ├── tour-360/page.tsx           tour 360° (Panoee), só ao clicar
│   └── admin/                      painel: login/, (painel)/ (editor, notícias, mídia, tour), previa/, acoes.ts
├── proxy.ts                        renova a sessão do Supabase em /admin e manda ao login
├── components/
│   ├── pagina-inicial.tsx          monta as seções na ordem/visibilidade do documento
│   ├── motion.tsx                  revela [data-reveal] ao rolar
│   ├── rolagem-suave.tsx           Lenis (fora do painel e sem movimento reduzido)
│   ├── botoes-flutuantes.tsx       WhatsApp, Instagram e voltar ao topo
│   ├── cabecalho-fixo.tsx          o cabeçalho volta preso no topo ao rolar para cima
│   ├── lista-noticias.tsx, compartilhar.tsx, redes-sociais.tsx, tour-ao-clicar.tsx
│   ├── admin/                      editor, prévia ao vivo, formulários, mídia
│   ├── site-header.tsx             cabeçalho (tom "escuro" | "claro")
│   ├── site-footer.tsx             rodapé azul-marinho com o telefone gigante
│   ├── sections/
│   │   ├── hero-cinematico.tsx     abertura: scroll controla o voo do drone (canvas)
│   │   ├── hero.tsx                exporta <Apresentacao />: frase, números, faixa de fotos
│   │   ├── faixa-fotos.tsx         faixa de fotos que corre sozinha (CSS)
│   │   ├── escola.tsx              história, colagem de fotos, linha do tempo
│   │   ├── ensino.tsx              seletor de série + tabela de segmentos e coordenações
│   │   ├── metodo.tsx              SAS Educação e Árvore, com logos e fotos
│   │   ├── showcase.tsx            "Robótica é aula com pódio", zoom pelo scroll
│   │   ├── conquistas.tsx          frase com nomes que acendem pelo scroll
│   │   ├── noticias.tsx            1 destaque + 4 notícias reais do blog
│   │   └── contato.tsx             convite à visita, WhatsApp, e-mail, faixa de fotos
│   └── ui/                         shadcn: alert-dialog, badge, button, dialog, dropdown-menu, field, input, label, select, separator, sheet, sonner, switch, tabs, textarea, toggle, toggle-group
├── lib/
│   ├── site.ts                     dados institucionais (ver CONTEUDO.md)
│   ├── conteudo/                   esquema editável (esquema.ts), validação (documento.ts), operações do
│   │                               editor (operacoes.ts) e repositório da página (repositorio.ts, com
│   │                               adaptadores loja-supabase.ts e loja-memoria.ts para os testes)
│   ├── noticias.ts                 cartões, notícia por slug e relacionadas; fallback em noticias-todas.json (265)
│   ├── noticias-html.ts            regra única de HTML das notícias (gravar e mostrar)
│   ├── encaixe.ts                  regra do encaixe automático das seções (função pura)
│   ├── sequencia-frames.ts         cache de quadros da abertura (o que baixar, soltar e desenhar)
│   ├── resultado.ts                tipo Resultado das operações do painel
│   ├── noticias-tipos.ts           tipos e formatação válidos no servidor e no navegador
│   ├── supabase/, admin/sessao.ts  clientes do Supabase e verificação da equipe
│   ├── hero-cinematico.ts          configuração da abertura (frames, janela de memória, textos)
│   ├── rolagem.ts, tour.ts         instância do Lenis; teste de incorporação do tour
│   └── utils.ts                    cn()
├── public/
│   ├── fotos/                      fotos reais (Dask e SAS/Árvore), já redimensionadas
│   ├── hero/                       frames WebP do vídeo (desktop/, mobile/) e posters
│   ├── logos/                      sas.png, arvore.svg
│   ├── noticias/                   capa de cada notícia
│   ├── logo-dask.png               logo teal (fundo claro)
│   ├── logo-dask-branco.png        logo branco (sobre vídeo/foto)
│   └── favicon.png
├── components.json                 configuração do shadcn
├── next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs, .prettierrc
├── .vercelignore
└── .taste-skill/direction.json     a "folha de direção" sorteada pela skill de design
```

## Como a home é montada (`app/page.tsx`)

Ordem das seções e o que cada uma faz:

| # | Componente | Cor de fundo | Função |
| --- | --- | --- | --- |
| 1 | `HeroCinematico` | vídeo (canvas) sobre `--field` | Abertura em tela cheia. Três textos entram e saem conforme o scroll. |
| 2 | `Apresentacao` | `bg-tint` (verde-água claro) | Frase, botão de visita, números (1996 / +700 / SAS) e faixa de fotos |
| 3 | `Escola` | `--background`, faixa `bg-field` | Dois parágrafos lado a lado, dados (onde/desde/secretaria) com "Agendar visita" e Tour 360°, faixa de 3 fotos de mesma altura e linha do tempo 1995–2022 |
| 4 | `Ensino` | `bg-tint` | "Selecionar série" e três cartões de segmento numa faixa: o do segmento escolhido vai ao centro e os outros ficam apagados; psicologia e Central do aluno embaixo |
| 5 | `Metodo` | `bg-field` (azul-marinho) | SAS Educação e Árvore, ambos integrados ao "aprender fazendo" |
| 6 | `Showcase` | `--background` | Robótica: foto dos Makerníficos com zoom pelo scroll |
| 7 | `Conquistas` | `bg-field` | Frase pinned; o nome atual acende em teal conforme o scroll |
| 8 | `Noticias` | `--background` | 1 destaque + 4 notícias; cada item abre em `/noticias/[slug]` |
| 9 | `Contato` | `bg-tint` | Faixa de fotos reversa, convite, WhatsApp e e-mail |
| — | `SiteFooter` | `bg-field` | Endereço, razão social, mantenedora, CNPJ, telefone da secretaria |

Âncoras de navegação: `#escola`, `#ensino`, `#metodo`, `#noticias`, `#contato`
(o menu, em `navegacao` de `lib/site.ts`, usa `/#escola` e `/#ensino` para
funcionar a partir das outras páginas, e leva a `/noticias` e `/tour-360`).

## Cabeçalho (`site-header.tsx`)

- Props: `tom?: "escuro" | "claro"`. `claro` troca o logo para o branco e o texto para branco (usado sobre o vídeo).
- Desktop (`lg`): links, menu "Área do aluno" (Diário do Aluno, ClassApp, Prof. Web, Central do aluno) e botão "Agendar visita".
- Celular: botão "Menu" abre um `Sheet` com os mesmos itens e o botão do WhatsApp.
- O item da página atual recebe `aria-current="page"` e fica sublinhado (como no hover).
- `cabecalho-fixo.tsx` (montado no `layout.tsx`) repete este cabeçalho no topo da tela quando a pessoa rola para cima depois que o original saiu da tela. Fora do painel.
- Botão "Agendar visita" abre o WhatsApp da secretaria com mensagem pronta (`whatsappLink(mensagemVisita)` em `lib/site.ts`).

## Seletor de série (`ensino.tsx`)

Componente cliente. O estado é a série escolhida (`useState`). Ao escolher:
descobre o segmento (`segmentos.find(s => s.series.includes(serie))`), mostra
quem coordena, o horário de atendimento e um botão para o WhatsApp **com a série
escrita na mensagem**; para o Fundamental I também mostra o atalho para a lista de
material. A tabela ao lado apaga (opacidade 35%) os segmentos que não são o da
série escolhida. O `aria-live="polite"` anuncia a mudança.

## Central do aluno (`app/central-do-aluno/page.tsx`)

Página de servidor (estática) com quatro cartões de acesso (Diário do Aluno,
que tem só as notas; ClassApp, onde chegam os recados da escola; Prof. Web;
Trabalhe conosco), `Tabs` por segmento com os documentos e um cartão
com a coordenação. Documentos com URL do Google Drive aparecem como "PDF";
os sem URL aparecem como "Em breve", igual ao site original. Os links do
Fundamental I (lista de material 2026, 8 arquivos) e das "Normas disciplinares"
são reais.

## Fonte, tema e acessibilidade global

- Fonte: `Schibsted_Grotesk` via `next/font/google` (pesos 400, 600, 800), exposta como `--font-sans`.
- Não há modo escuro. O tema único está em `globals.css` (`:root`); o bloco `.dark` do template foi removido (a diretiva `@custom-variant dark` ainda está no topo do arquivo, sem uso, porque os componentes shadcn trazem classes `dark:`).
- Skip link "Pular para o conteúdo" aponta para `#conteudo` (o `<main>`).
- `prefers-reduced-motion` é tratado no CSS (regra global ao fim de `globals.css`) e, na abertura, no componente.
- Alvos de toque com `touch-action: manipulation`; `overflow-x: clip` no `body`.
- `lang="pt-BR"`.

## Tipos e dados

`lib/site.ts` exporta tipos `Coordenacao` e `Segmento` e as constantes `contato`,
`segmentos`, `psicologa`, `linhaDoTempo`, `conquistas`, `documentos`, `navegacao`,
além das funções `whatsappLink(mensagem)` e da constante `mensagemVisita`.

Textos e fotos das seções da home **não** ficam nos componentes: cada seção
recebe `c: ConteudoDe<"id-da-seção">` (o conteúdo resolvido) e lê os campos
direto (`c.sasTitulo`, `c.sasFotos`). O tipo de cada campo sai da declaração em
`lib/conteudo/esquema.ts`, então um nome errado não compila. Os padrões também
estão lá. O tipo `Noticia` está em `lib/noticias-tipos.ts`.

## Testes

`npm test` (Vitest, `vitest.config.mts`) roda os testes de lógica pura, sem
navegador: `lib/**/*.test.ts`. Cobrem o repositório da página (com a loja em
memória), o documento e o esquema, as operações do editor, a regra do encaixe,
o HTML das notícias e o cache de quadros da abertura (com imagens falsas).
Animação e layout continuam sendo conferidos num Chrome real (ver CLAUDE.md).
