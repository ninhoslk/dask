// Copia as notícias de site/lib/noticias-todas.json para public.noticias.
// Entra com uma conta do painel (o banco só aceita escrita de admin, pela RLS):
//
//   PAINEL_EMAIL=… PAINEL_SENHA=… node scripts/semear-noticias.mjs
//
// Lê NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY de site/.env.local.
// Pode rodar de novo: notícias com o mesmo slug são atualizadas, não duplicadas.
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

// o pacote está em site/node_modules
const { createClient } = createRequire(new URL("../site/package.json", import.meta.url))("@supabase/supabase-js")

const env = Object.fromEntries(
  readFileSync(new URL("../site/.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)])
)
const { PAINEL_EMAIL, PAINEL_SENHA } = process.env
if (!PAINEL_EMAIL || !PAINEL_SENHA) throw new Error("Defina PAINEL_EMAIL e PAINEL_SENHA.")

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
const { error: erroLogin } = await sb.auth.signInWithPassword({ email: PAINEL_EMAIL, password: PAINEL_SENHA })
if (erroLogin) throw erroLogin

const https = (u) => (typeof u === "string" && u.startsWith("https://") ? u : null)
const todas = JSON.parse(readFileSync(new URL("../site/lib/noticias-todas.json", import.meta.url), "utf8"))
const linhas = todas
  .filter((n) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.slug))
  .map((n) => ({
    slug: n.slug,
    titulo: n.title.slice(0, 300),
    data: n.date,
    categoria: ["Geral", "Ensino", "Eventos"].includes(n.category) ? n.category : "Geral",
    resumo: (n.excerpt ?? "").slice(0, 2000),
    conteudo: n.content ?? "",
    imagem: https(n.image),
    miniatura: https(n.thumb),
  }))
if (linhas.length !== todas.length) console.warn(`${todas.length - linhas.length} notícias com slug inválido ficaram de fora`)

for (let i = 0; i < linhas.length; i += 50) {
  const { error } = await sb.from("noticias").upsert(linhas.slice(i, i + 50), { onConflict: "slug" })
  if (error) throw error
}
console.log(`${linhas.length} notícias gravadas`)
await sb.auth.signOut()
