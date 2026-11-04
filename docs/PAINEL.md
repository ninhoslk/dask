# Painel administrativo (backend com Supabase)

O site tem um painel em **`/admin`** para a equipe/assessoria editar a home, as
notícias, as fotos e o futuro tour 360°, sem mexer em código.

## O que dá para fazer

| Aba | Para quê |
| --- | --- |
| **Editor visual** (`/admin`) | Prévia ao vivo da home (computador, tablet, celular). Clique numa seção na prévia (ou na lista) para editar textos, títulos, fotos e listas; arraste as seções para mudar a ordem; olho para ocultar/mostrar; setas ↑ ↓ e "Ocultar" também na barra que aparece sobre a seção na prévia. Itens de listas (tópicos do SAS, linha do tempo, conquistas, fotos) se arrastam, somam e removem. Desfazer/refazer (Ctrl+Z / Ctrl+Y), "Original" volta um campo ao texto de fábrica, rascunho salvo sozinho, botão **Publicar**, histórico de publicações para voltar a uma versão. |
| **Notícias** | Criar, editar, despublicar e apagar notícias (as 265 do blog antigo já vêm importadas). |
| **Mídia** | Enviar fotos (JPG/PNG/WebP/AVIF/GIF, até 8 MB), copiar o endereço, apagar. |
| **Tour 360°** | Endereço do tour (ou o código `<iframe>`) e ativar. Hoje aponta para https://colegio-dask-tour.vercel.app (exportação do Panoee, ver [`tour/README.md`](../tour/README.md)). A página pública `/tour-360` só carrega o tour quando o visitante clica; se o site do tour proibir ser incorporado, mostra um botão para abrir em outra aba. |

O que o editor **não** faz (diferenças honestas em relação ao Elementor): não
cria seções novas do zero nem muda o layout interno de cada seção; edita
o conteúdo das 10 seções existentes, a ordem e a visibilidade delas. Rodapé,
cabeçalho, contatos e telefones continuam em `site/lib/site.ts`.

## Como funciona

- `site/lib/conteudo/esquema.ts`: lista de seções e campos editáveis, com o
  texto atual como **padrão**. Para tornar um texto novo editável, adicione o
  campo aqui e leia-o no componente com `txt(c, "chave")`.
- `site/lib/conteudo/documento.ts`: o banco guarda só a ordem, a visibilidade e
  os campos alterados. `normalizar` valida tudo (tipos, tamanhos, imagens só do
  próprio site ou do bucket `midia`); `resolver` mescla com os padrões.
- Sem banco (variáveis ausentes ou Supabase fora do ar) o site mostra os padrões.
- Publicar chama `revalidatePath("/", "layout")`: o site muda na hora.

## Banco (Supabase)

Projeto Supabase **"Dask Site"** (`ijtczqufmwyulchjwbmb`, us-east-1). Migrações em
[`supabase/migrations/`](../supabase/migrations), já aplicadas. Tabelas: `admins`,
`paginas` (publicada, leitura pública), `rascunhos` (só painel), `versoes`,
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
