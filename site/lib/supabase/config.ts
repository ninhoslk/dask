// Endereço e chave pública (anon/publishable) do projeto Supabase. São
// públicas por natureza: quem protege os dados são as políticas de RLS do
// banco (supabase/migrations). A chave service_role NUNCA entra no site.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const supabaseChave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
export const supabaseConfigurado = Boolean(supabaseUrl && supabaseChave)
