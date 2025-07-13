// lib/articles.ts
import { db } from "@/lib/db"; // ajusta esto a tu instancia Prisma o la que uses

export async function getAllArticlesFromDB(lang: "es" | "en") {
  return await db.article.findMany({
    // Replace 'language' with the actual field name if different
    where: { language: lang },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSingleArticleFromDB(lang: "es" | "en", slug: string) {
  return await db.article.findFirst({
    where: { language: lang, slug },
  });
}
