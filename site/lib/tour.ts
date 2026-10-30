import "server-only"

// O site do tour pode proibir que a página apareça dentro de outro site
// (X-Frame-Options ou CSP frame-ancestors); nesse caso o quadro fica em branco.
// Sem resposta do site, assume que pode (o navegador decide).
export async function permiteIncorporar(url: string, cache: RequestCache | { revalidate: number } = "no-store") {
  const host = new URL(url).hostname
  if (host === "localhost" || /^[\d.]+$/.test(host) || host.includes(":")) return false
  try {
    const r = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      ...(typeof cache === "string" ? { cache } : { next: cache }),
    })
    r.body?.cancel()
    const xfo = r.headers.get("x-frame-options")?.toLowerCase() ?? ""
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false
    const ancestrais = /frame-ancestors([^;]*)/i.exec(r.headers.get("content-security-policy") ?? "")?.[1].trim()
    if (ancestrais && !/(^|\s)(\*|https:)(\s|$)/.test(ancestrais)) return false
    return true
  } catch {
    return true
  }
}
