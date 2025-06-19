import { getPosts } from "@/utils/amazon/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";
  const langs = ["es", "en"] as const;

  let urls = "";

  for (const lang of langs) {
    const posts = await getPosts(lang);
    posts.forEach((post) => {
      urls += `
                <url>
                  <loc>${siteUrl}/${lang}/blog/${post.slug}</loc>
                  <changefreq>weekly</changefreq>
                  <priority>0.8</priority>
                </url>`;
    });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
                  <urlset
                    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                  >
                    <url>
                      <loc>${siteUrl}</loc>
                      <changefreq>weekly</changefreq>
                      <priority>1.0</priority>
                    </url>
                    <url>
                      <loc>${siteUrl}/es/blog</loc>
                      <changefreq>weekly</changefreq>
                      <priority>0.9</priority>
                    </url>
                    <url>
                      <loc>${siteUrl}/en/blog</loc>
                      <changefreq>weekly</changefreq>
                      <priority>0.9</priority>
                    </url>
                    ${urls}
                  </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
