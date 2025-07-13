import { getPosts } from "@/utils/amazon/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";
  const langs = ["es", "en"] as const;

  const staticRoutes = [
    {
      loc: `${siteUrl}`,
      changefreq: "daily",
      priority: 1.0,
    },
    ...langs.map((lang) => ({
      loc: `${siteUrl}/${lang}/blog`,
      changefreq: "daily",
      priority: 0.9,
    })),
  ];

  const dynamicRoutes: string[] = [];

  for (const lang of langs) {
    const posts = await getPosts(lang);

    if (posts?.length) {
      posts.forEach((post: any) => {
        const lastmod = new Date(
          post.updatedAt || post.createdAt
        ).toISOString();

        dynamicRoutes.push(`
          <url>
            <loc>${siteUrl}/${lang}/blog/${post.slug}</loc>
            <lastmod>${lastmod}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>`);
      });
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticRoutes
      .map(
        (route) => `
      <url>
        <loc>${route.loc}</loc>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>`
      )
      .join("")}
    ${dynamicRoutes.join("")}
  </urlset>`;

  return new NextResponse(sitemapXml.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
