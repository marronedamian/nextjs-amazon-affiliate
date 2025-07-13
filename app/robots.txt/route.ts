import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";

  const content = `
User-agent: *
Allow: /

# Bloquear carpetas internas si existen
Disallow: /api/
Disallow: /admin/

# (Opcional) Limitar la frecuencia de crawl para bots agresivos
# Crawl-delay: 10

# Sitemap principal
Sitemap: ${siteUrl}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
