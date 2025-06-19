import { promises as fs } from "fs";
import path from "path";
import { Post } from "@/types/posts.types";

export async function getPosts(lang: "es" | "en"): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "data", `posts_${lang}.json`);
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file) as Post[];
}

export async function getPost(
  lang: "es" | "en",
  slug: string
): Promise<Post | undefined> {
  const posts = await getPosts(lang);
  return posts.find((post) => post.slug === slug);
}
