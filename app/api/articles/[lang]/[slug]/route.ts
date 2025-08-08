import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { lang: string; slug: string } }
) {
  const { lang, slug } = params;

  try {
    const article = await db.article.findFirst({
      where: {
        slug,
        language: lang,
      },
      include: {
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

    if (!article) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Formatear las categorías para incluir un campo `name` traducido
    const formattedCategories = article.categories.map((c) => ({
      id: c.category.id,
      emoji: c.category.emoji,
      query: c.category.query,
      name: lang === "en" ? c.category.label_en : c.category.label_es,
    }));

    return NextResponse.json({
      ...article,
      categories: formattedCategories,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
