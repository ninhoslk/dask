-- Painel do Colégio Dask: conteúdo editável, notícias, tour 360 e mídia.
--
-- Modelo de segurança
-- * Login pelo Supabase Auth (senhas com bcrypt no próprio Auth; o site nunca
--   vê nem guarda senha). Só quem está em public.admins edita alguma coisa:
--   uma conta criada fora desse cadastro não tem permissão nenhuma.
-- * Todas as tabelas com RLS. O público (anon) só lê o que está publicado.
-- * O site não usa a service_role: as escritas do painel saem com o token do
--   próprio usuário e passam pelas políticas abaixo.

-- ---------------------------------------------------------------- admins
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  papel text not null default 'editor' check (papel in ('admin', 'editor')),
  criado_em timestamptz not null default now()
);
alter table public.admins enable row level security;

-- security definer para a política não depender de RLS de admins (sem recursão)
create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

create or replace function public.eh_admin_geral()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid()) and a.papel = 'admin'
  );
$$;

revoke all on function public.eh_admin() from public;
revoke all on function public.eh_admin_geral() from public;
grant execute on function public.eh_admin() to authenticated;
grant execute on function public.eh_admin_geral() to authenticated;

create policy "admin vê a equipe" on public.admins
  for select to authenticated using ((select public.eh_admin()));
create policy "admin geral gerencia a equipe" on public.admins
  for all to authenticated
  using ((select public.eh_admin_geral()))
  with check ((select public.eh_admin_geral()));

-- ---------------------------------------------------------------- auditoria
create table public.auditoria (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  acao text not null,
  alvo text not null default '',
  detalhe jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);
alter table public.auditoria enable row level security;
create policy "admin lê a auditoria" on public.auditoria
  for select to authenticated using ((select public.eh_admin()));
create policy "admin registra a própria ação" on public.auditoria
  for insert to authenticated
  with check ((select public.eh_admin()) and user_id = (select auth.uid()));

-- ---------------------------------------------------------------- páginas
-- Publicado (leitura pública) e rascunho (só painel) ficam em tabelas
-- separadas: assim o rascunho nunca vaza pela API pública.
create table public.paginas (
  id text primary key check (id ~ '^[a-z0-9-]{1,40}$'),
  conteudo jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),
  atualizado_por uuid references auth.users (id) on delete set null
);
alter table public.paginas enable row level security;
create policy "todos leem a página publicada" on public.paginas
  for select to anon, authenticated using (true);
create policy "admin publica" on public.paginas
  for insert to authenticated with check ((select public.eh_admin()));
create policy "admin atualiza a publicada" on public.paginas
  for update to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));

create table public.rascunhos (
  id text primary key references public.paginas (id) on delete cascade,
  conteudo jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),
  atualizado_por uuid references auth.users (id) on delete set null
);
alter table public.rascunhos enable row level security;
create policy "admin lida com rascunhos" on public.rascunhos
  for all to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));

-- histórico de publicações para desfazer
create table public.versoes (
  id bigint generated always as identity primary key,
  pagina text not null references public.paginas (id) on delete cascade,
  conteudo jsonb not null,
  criado_em timestamptz not null default now(),
  criado_por uuid default auth.uid() references auth.users (id) on delete set null
);
create index versoes_pagina_idx on public.versoes (pagina, criado_em desc);
alter table public.versoes enable row level security;
create policy "admin lê versões" on public.versoes
  for select to authenticated using ((select public.eh_admin()));
create policy "admin grava versões" on public.versoes
  for insert to authenticated with check ((select public.eh_admin()));

-- limite de tamanho do documento (defesa contra abuso)
alter table public.paginas add constraint paginas_tamanho check (pg_column_size(conteudo) < 1000000);
alter table public.rascunhos add constraint rascunhos_tamanho check (pg_column_size(conteudo) < 1000000);

-- ---------------------------------------------------------------- notícias
create table public.noticias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 200),
  titulo text not null check (length(titulo) between 1 and 300),
  data timestamptz not null default now(),
  categoria text not null default 'Geral' check (categoria in ('Geral', 'Ensino', 'Eventos')),
  resumo text not null default '' check (length(resumo) <= 2000),
  conteudo text not null default '' check (length(conteudo) <= 200000),
  imagem text check (imagem is null or imagem ~ '^https://'),
  imagem_w int,
  imagem_h int,
  miniatura text check (miniatura is null or miniatura ~ '^https://'),
  url_original text,
  publicado boolean not null default true,
  destaque boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index noticias_data_idx on public.noticias (data desc) where publicado;
alter table public.noticias enable row level security;
create policy "todos leem notícias publicadas" on public.noticias
  for select to anon, authenticated using (publicado or (select public.eh_admin()));
create policy "admin cria notícias" on public.noticias
  for insert to authenticated with check ((select public.eh_admin()));
create policy "admin edita notícias" on public.noticias
  for update to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));
create policy "admin apaga notícias" on public.noticias
  for delete to authenticated using ((select public.eh_admin()));

-- ---------------------------------------------------------------- tour 360
create table public.tour360 (
  id smallint primary key default 1 check (id = 1),
  ativo boolean not null default false,
  titulo text not null default 'Tour 360° pelo Colégio Dask',
  descricao text not null default 'Em breve você vai poder conhecer cada espaço da escola sem sair de casa.',
  url_embed text check (url_embed is null or url_embed ~ '^https://'),
  atualizado_em timestamptz not null default now()
);
insert into public.tour360 (id) values (1);
alter table public.tour360 enable row level security;
create policy "todos leem o tour" on public.tour360
  for select to anon, authenticated using (true);
create policy "admin edita o tour" on public.tour360
  for update to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));

-- ---------------------------------------------------------------- carimbo de data
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;
create trigger noticias_atualizado before update on public.noticias
  for each row execute function public.tocar_atualizado_em();
create trigger tour360_atualizado before update on public.tour360
  for each row execute function public.tocar_atualizado_em();
create trigger paginas_atualizado before update on public.paginas
  for each row execute function public.tocar_atualizado_em();
create trigger rascunhos_atualizado before update on public.rascunhos
  for each row execute function public.tocar_atualizado_em();

insert into public.paginas (id) values ('home');
insert into public.rascunhos (id) values ('home');

-- ---------------------------------------------------------------- mídia (storage)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('midia', 'midia', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "admin envia mídia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'midia' and (select public.eh_admin()));
create policy "admin altera mídia" on storage.objects
  for update to authenticated
  using (bucket_id = 'midia' and (select public.eh_admin()))
  with check (bucket_id = 'midia' and (select public.eh_admin()));
create policy "admin apaga mídia" on storage.objects
  for delete to authenticated
  using (bucket_id = 'midia' and (select public.eh_admin()));
-- listar arquivos (biblioteca de mídia) só no painel; o download público
-- funciona pela URL pública do bucket sem precisar de política de select
create policy "admin lista mídia" on storage.objects
  for select to authenticated
  using (bucket_id = 'midia' and (select public.eh_admin()));
