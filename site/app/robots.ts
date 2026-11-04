import type { MetadataRoute } from "next"

import { absoluta } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    sitemap: absoluta("/sitemap.xml"),
  }
}
