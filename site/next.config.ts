import type { NextConfig } from "next"

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseHost = supabase ? new URL(supabase).host : ""
const dev = process.env.NODE_ENV !== "production"

// Content Security Policy: só carrega o que o site usa. Scripts inline são
// os do próprio Next (hidratação); não há script de terceiros.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://colegiodask.com.br${supabaseHost ? ` https://${supabaseHost}` : ""}`,
  "font-src 'self'",
  `connect-src 'self'${supabaseHost ? ` https://${supabaseHost} wss://${supabaseHost}` : ""}`,
  // mapa do Google e o futuro tour 360 (qualquer endereço https cadastrado no painel)
  "frame-src 'self' https:",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ")

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // NEXT_BUILD_CPUS=2 limita os processos do build em máquinas com pouca memória
  ...(process.env.NEXT_BUILD_CPUS ? { experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS) } } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "colegiodask.com.br", pathname: "/wp-content/uploads/**" },
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/midia/**" }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        // o painel nunca vai para cache compartilhado nem para buscadores
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ]
  },
}

export default nextConfig
