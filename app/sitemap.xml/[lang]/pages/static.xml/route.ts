import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";
const langs = ["es", "en"] as const;

interface Params {
  params: {
    lang: string;
  };
}

export async function GET(_: Request, { params }: Params) {
  const { lang } = params;

  if (!langs.includes(lang as any)) {
    return new Response("Invalid language", { status: 400 });
  }

  const staticPaths = [`/${lang}`, `/${lang}/landing`, `/${lang}/blog`];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths
  .map(
    (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join("")}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
