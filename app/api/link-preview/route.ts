import { NextRequest } from "next/server";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return Response.json({ error: "URL is required" }, { status: 400 });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") || $("title").text() || "";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    return Response.json({ title, description, image });
  } catch (err) {
    console.error("Error fetching metadata:", err);
    return Response.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
