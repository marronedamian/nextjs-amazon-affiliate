import { getPosts } from "@/utils/amazon/posts";
import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";
const urlsPerPage = 20;
const langs = ["es", "en"] as const;

export async function GET() {
  const sitemapEntries: string[] = [];

  for (const lang of langs) {
    // 1. Incluir sitemap de páginas fijas
    sitemapEntries.push(`
  <sitemap>
    <loc>${siteUrl}/sitemap.xml/${lang}/pages/static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`);

    // 2. Incluir páginas paginadas de posts
    const posts = await getPosts(lang);
    const totalPages = Math.ceil(posts.length / urlsPerPage);

    for (let page = 1; page <= totalPages; page++) {
      sitemapEntries.push(`
  <sitemap>
    <loc>${siteUrl}/sitemap.xml/${lang}/${page}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join("\n")}
</sitemapindex>`;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
