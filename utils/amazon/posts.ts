// utils/amazon/posts.ts
import { getAllArticlesFromDB, getSingleArticleFromDB } from "@/lib/articles";

export async function getPosts(lang: "es" | "en") {
  return await getAllArticlesFromDB(lang);
}

export async function getPost(lang: "es" | "en", slug: string) {
  return await getSingleArticleFromDB(lang, slug);
}
