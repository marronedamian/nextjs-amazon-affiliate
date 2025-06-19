import postsEs from "@/data/posts_es.json";
import postsEn from "@/data/posts_en.json";

export function getTranslatedSlug(slug: string, fromLang: string, toLang: string): string {
  const fromPosts = fromLang === "es" ? postsEs : postsEn;
  const toPosts = toLang === "es" ? postsEs : postsEn;

  const match = fromPosts.find((p) => p.slug === slug);
  if (!match) return slug; 

  const equivalent = toPosts.find((p) => p.amazonLink === match.amazonLink);
  return equivalent?.slug || slug;
}
