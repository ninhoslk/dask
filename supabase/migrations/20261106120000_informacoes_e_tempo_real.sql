-- Informações do site inteiro (contatos, menus, segmentos, Central do aluno,
-- rodapé, cores) num documento próprio, "site", com rascunho e publicação
-- iguais aos da home.
insert into public.paginas (id) values ('site') on conflict (id) do nothing;
insert into public.rascunhos (id) values ('site') on conflict (id) do nothing;

-- O painel acompanha as mudanças de outras pessoas da equipe pelo Realtime.
-- As políticas de RLS continuam valendo: só quem é da equipe recebe rascunhos.
do $$
declare
  t text;
begin
  foreach t in array array['rascunhos', 'paginas', 'noticias', 'tour360'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end
$$;
