import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const lang = req.headers.get("x-lang") || "es";

  const stories = await db.story.findMany({
    where: {
      isGlobal: true,
    },
    include: {
      images: { orderBy: { order: "asc" } },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
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
    orderBy: { createdAt: "desc" },
  });

  const formatted = stories.map((story) => ({
    id: story.id,
    user: story.user,
    images: story.images.map((img) => img.url),
    description: story.description,
    isGlobal: story.isGlobal,
    category: story.category
      ? {
          id: story.category.id,
          emoji: story.category.emoji,
          query: story.category.query,
          name:
            lang === "en" ? story.category.label_en : story.category.label_es,
        }
      : null,
  }));

  return NextResponse.json(formatted);
}
