# Painel administrativo (backend com Supabase)

O site tem um painel em **`/admin`** para a equipe/assessoria editar o site
inteiro (home, informações, menus, Central do aluno, cores), as notícias, as
fotos e o tour 360°, sem mexer em código.

## O que dá para fazer

| Aba | Para quê |
| --- | --- |
| **Página inicial** (`/admin`) | Prévia ao vivo da home (computador, tablet, celular). Clique numa seção na prévia (ou na lista) para editar textos, títulos, fotos, botões, links e listas. Arraste para mudar a ordem; olho para ocultar/mostrar; **Adicionar seção** ("Texto e imagem", "Chamada com botão"), **Duplicar** e **Remover**, também pela barra que aparece sobre a seção na prévia. Desfazer/refazer (Ctrl+Z / Ctrl+Y), "Original" volta um campo ao texto de fábrica, rascunho salvo sozinho, botão **Publicar**, histórico de publicações. |
| **Informações do site** (`/admin/site`) | O que vale para todas as páginas: identidade e endereço (nome, logos, CNPJ), contatos e horário de atendimento, redes sociais, **menu do topo** (abas, Área do aluno, botão de visita), **segmentos e coordenação** (séries, coordenador, telefone/WhatsApp, horário, documentos), Central do aluno (cartões e textos), rodapé, títulos das páginas e do Google, **cores** e cantos arredondados. Mesma prévia, rascunho e publicação da home. |
| **Notícias** | Criar, editar, despublicar e apagar notícias (as 265 do blog antigo já vêm importadas). A lista se atualiza sozinha quando outra pessoa mexe. |
| **Mídia** | Enviar fotos (JPG/PNG/WebP/AVIF/GIF, até 8 MB), copiar o endereço, apagar. |
| **Tour 360°** | Endereço do tour (ou o código `<iframe>`) e ativar. Hoje aponta para https://colegio-dask-tour.vercel.app (exportação do Panoee, ver [`tour/README.md`](../tour/README.md)). A página pública `/tour-360` só carrega o tour quando o visitante clica; se o site do tour proibir ser incorporado, mostra um botão para abrir em outra aba. |

Listas de itens (cartões, abas do menu, coordenações, documentos, redes) se
arrastam, somam, **duplicam**, **ligam/desligam** (a chave esconde do site sem
apagar) e removem. Telefones são digitados uma vez: o link de ligação e o de
WhatsApp são montados sozinhos.

### Sincronização e trabalho em equipe

- **Painel → site:** publicar chama `revalidatePath("/", "layout")`; o site muda
  na hora, em todas as páginas.
- **Banco → painel:** o editor assina o Realtime do Supabase. Se outra pessoa
  salvar o mesmo rascunho e aqui não houver nada pendente, o editor carrega a
  versão nova sozinho. Ao voltar para a aba, ele confere de novo (rede
  reserva caso o Realtime caia).
- **Ninguém apaga o trabalho de ninguém:** o rascunho só é salvo sobre a versão
  que o editor conhece (`atualizado_em`). Se mudou no meio do caminho, o painel
  mostra o conflito e pergunta: carregar a versão da outra pessoa ou manter a
  sua. Publicar fica travado até decidir.
- O Realtime abre a conexão com o token da sessão (`prepararTempoReal`); sem
  ele, o RLS não entrega rascunhos.

### O que continua fixo (diferenças honestas em relação ao Elementor)

- O **layout interno** de cada seção da home (onde fica cada foto, a animação)
  é o do design; o painel muda conteúdo, ordem, visibilidade e cores.
- As 10 seções originais têm âncoras do menu ou efeitos próprios, então cada
  uma existe **uma vez** (dá para remover e acrescentar de novo). As seções
  "Texto e imagem" e "Chamada com botão" se repetem à vontade.
- **Fonte** e espaçamentos não são editáveis: o design usa uma fonte só
  (Schibsted Grotesk) e uma escala própria; trocar pelo painel quebraria o
  título de duas linhas e o carregamento rápido. Cores e cantos, sim.
- Páginas novas inteiras ainda não se criam pelo painel.

## Como funciona

- `site/lib/conteudo/esquema.ts`: seções da home e seus campos, com o texto
  atual como **padrão**. `site/lib/conteudo/config.ts`: os grupos de
  Informações do site, no mesmo formato. `site/lib/site.ts` guarda só os
  valores de fábrica que esses dois usam.
- Tipos de campo: texto, texto longo, link (validado), cor, número, escolha,
  imagem, lista de imagens, lista, itens e **registros** (lista de cartões com
  campos próprios, um nível de lista dentro).
- `site/lib/conteudo/documento.ts`: o banco guarda só a ordem, a visibilidade e
  os campos alterados. `normalizar`/`normalizarConfig` validam tudo (tipos,
  tamanhos, links só do site ou https/mailto/tel, imagens só do próprio site ou
  do bucket `midia`, cores só `#rrggbb`); `resolver`/`resolverConfig` mesclam
  com os padrões.
- O layout lê as informações publicadas (`configPublicada`) e entrega a todos os
  componentes pelo `ConfigSite` (`useConfig()`); `lib/conteudo/dados.ts` monta
  telefone, WhatsApp, menu, segmentos e o CSS das cores. Na prévia, o mesmo
  provedor recebe o rascunho.
- Para tornar um texto novo editável: acrescente o campo no esquema (ou no
  grupo) e leia no componente pelo conteúdo tipado (`c.chave`, de `ConteudoDe<"tipo">`) ou pelo `useConfig()`.
  **Não** escreva contato, telefone ou link direto no componente.
- Sem banco (variáveis ausentes ou Supabase fora do ar) o site mostra os padrões.
- Leitura e gravação passam pelo repositório (`lib/conteudo/repositorio.ts`), o mesmo para "home" e "site"; as regras do editor (mover, ocultar, duplicar, remover, acrescentar) são funções puras em `lib/conteudo/operacoes.ts`. Tudo coberto por testes (`npm test`).

## Banco (Supabase)

Projeto Supabase **"Dask Site"** (`ijtczqufmwyulchjwbmb`, us-east-1). Migrações em
[`supabase/migrations/`](../supabase/migrations), já aplicadas. Tabelas: `admins`,
`paginas` (publicadas "home" e "site", leitura pública), `rascunhos` (só painel), `versoes`,
`noticias`, `tour360`, `auditoria`; bucket `midia`. As funções de permissão
ficam no schema `privado`, fora da API.

As 265 notícias do blog foram copiadas com `scripts/semear-noticias.mjs`, que
entra com uma conta do painel (pode rodar de novo; atualiza pelo slug).

### Economia de espaço

O plano grátis tem 500 MB de banco e 1 GB de arquivos. Hoje o banco usa ~12 MB
(quase tudo é o próprio Supabase; as 265 notícias ocupam ~0,5 MB).

- A página guarda só o que mudou em relação ao texto padrão (centenas de bytes).
- Fotos das notícias antigas continuam no site do colégio (só o endereço vai ao banco).
- Texto das notícias e versões com compressão `lz4`.
- Histórico: só as **20 últimas publicações**; auditoria: **180 dias / 2000 linhas**.
- Fotos enviadas pelo painel são reduzidas no navegador (lado maior 2000px, WebP)
  antes de subir.

Variáveis (Vercel e `site/.env.local`, que **não** vai para o Git):

```
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave anon/publishable>
NEXT_PUBLIC_SITE_URL=https://colegio-dask.vercel.app
```

A chave `service_role` **nunca** entra no site.

## Segurança

- **Senhas**: ficam só no Supabase Auth (hash bcrypt). O site nunca recebe nem
  guarda senha; a sessão é um token assinado renovado pelo `proxy.ts`.
- **Quem pode editar**: só quem está na tabela `admins`. Uma conta criada fora
  dela entra em lugar nenhum (é deslogada). Toda ação do servidor confere a
  sessão (`getUser`, que valida o token no Supabase) e o cadastro de novo.
- **RLS em todas as tabelas**: o público só lê o publicado; rascunho, histórico,
  auditoria e equipe são invisíveis para quem não é admin. As escritas do painel
  usam o token do próprio usuário, então o banco é a última barreira.
- **Entrada validada** no servidor (tamanhos, formatos, URLs só https, slugs);
  HTML de notícia limpo com `sanitize-html` ao salvar **e** ao mostrar.
- **Upload**: bucket aceita só imagens (sem SVG) até 8 MB, nome aleatório.
- **Login**: mensagem genérica (não revela se o e-mail existe), freio de
  tentativas por IP além do limite do Supabase Auth, registro na auditoria.
- **Cabeçalhos**: CSP, HSTS, `X-Frame-Options: SAMEORIGIN`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`; `/admin` com `no-store` e `noindex`.

## Criar uma pessoa da equipe

No painel do Supabase: *Authentication → Users → Add user* (e-mail e senha
forte, "Auto Confirm"). Depois, no *SQL Editor*:

```sql
insert into public.admins (user_id, nome, papel)
select id, 'Nome da pessoa', 'editor' from auth.users where email = 'pessoa@colegiodask.com.br';
```

Recomendado no painel do Supabase: desligar cadastro público (*Auth → Sign In
/ Providers → Allow new users to sign up*), ligar proteção contra senhas
vazadas e MFA.

Existe uma conta de teste `admin.teste@dask.test` (senha só no arquivo local
`.login-teste.local.txt`, fora do Git). Apague antes de entregar à escola:
`delete from auth.users where email = 'admin.teste@dask.test';`

## Testes de segurança (30/10/2026)

Rodados contra o banco real: visitante (anon) não lê rascunho, histórico,
equipe nem auditoria e não escreve em nada; conta logada **fora** da equipe
idem (não se promove a admin, não envia arquivo); funções de permissão não
são chamáveis pela API; bucket recusa SVG e envio sem login; slug, imagem e
tour só aceitam formatos válidos/https; HTML com `<script>`, `onerror` e
`javascript:` sai limpo; senha errada dá mensagem genérica e a 6ª tentativa
em 10 min é bloqueada; `/admin` sem sessão redireciona ao login. Advisors do
Supabase: sem alertas de segurança além da proteção de senha vazada (opção
do painel do Supabase).

O freio de tentativas do site é por instância do servidor; o Supabase Auth
tem o próprio limite por IP por trás.
