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
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      categories: {
        select: {
          category: {
            select: {
              id: true,
              emoji: true,
              query: true,
              label_es: true,
              label_en: true,
            },
          },
        },
      },
    },
  });

  const formatted = articles.map((a) => ({
    ...a,
    categories: a.categories.map((c) => ({
      id: c.category.id,
      emoji: c.category.emoji,
      query: c.category.query,
      name: lang === "en" ? c.category.label_en : c.category.label_es,
    })),
  }));

  return NextResponse.json(formatted);
}
