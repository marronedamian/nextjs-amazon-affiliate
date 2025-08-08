import { getPosts } from "@/utils/amazon/posts";
import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";
const urlsPerPage = 20;

export async function GET(
  _req: Request,
  { params }: { params: { lang: string; page: string } }
) {
  const { lang, page } = params;

  if (!["es", "en"].includes(lang)) {
    return new NextResponse("Invalid language", { status: 400 });
  }

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    return new NextResponse("Invalid page number", { status: 400 });
  }

  const posts = await getPosts(lang as "es" | "en");
  const start = (pageNumber - 1) * urlsPerPage;
  const end = pageNumber * urlsPerPage;
  const paginatedPosts = posts.slice(start, end);

  const urls = paginatedPosts.map((post) => {
    const lastmod = new Date(post.createdAt).toISOString();
    return `
  <url>
    <loc>${siteUrl}/${lang}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
