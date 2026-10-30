-- As funções de permissão (security definer) saem do schema public, que a API
-- REST expõe em /rest/v1/rpc, e vão para um schema privado. As políticas
-- continuam podendo usá-las; ninguém consegue chamá-las pela API.
create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to anon, authenticated;

alter function public.eh_admin() set schema privado;
alter function public.eh_admin_geral() set schema privado;
alter function public.podar_historico() set schema privado;

revoke all on function privado.eh_admin() from public, anon, authenticated;
revoke all on function privado.eh_admin_geral() from public, anon, authenticated;
revoke all on function privado.podar_historico() from public, anon, authenticated;
-- as políticas avaliam a função com o papel de quem consulta
grant execute on function privado.eh_admin() to anon, authenticated;
grant execute on function privado.eh_admin_geral() to authenticated;
