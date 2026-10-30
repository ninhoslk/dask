import "server-only"

import { createClient } from "@supabase/supabase-js"

import { supabaseChave, supabaseConfigurado, supabaseUrl } from "@/lib/supabase/config"

// Leitura pública (conteúdo publicado e notícias). As respostas entram no
// cache do Next com a etiqueta "conteudo"; publicar no painel invalida essa
// etiqueta e o site atualiza na hora. Sem publicação, revalida a cada hora.
export const ETIQUETA_CONTEUDO = "conteudo"

export function clientePublico() {
  if (!supabaseConfigurado) return null
  return createClient(supabaseUrl, supabaseChave, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { tags: [ETIQUETA_CONTEUDO], revalidate: 3600 } }),
    },
  })
}
