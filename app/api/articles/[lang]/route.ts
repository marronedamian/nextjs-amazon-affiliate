// app/api/articles/[lang]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { lang: string } }
) {
  const lang = params.lang;

  if (!["es", "en"].includes(lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const articles = await db.article.findMany({
    where: { language: lang },
    orderBy: { createdAt: "desc" },
    select: {
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json(articles);
}
