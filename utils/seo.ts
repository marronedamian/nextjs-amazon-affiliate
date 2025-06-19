import type { Metadata } from "next";
import { Post } from "@/types/posts.types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";

export function generateSiteMetadata(lang: "es" | "en"): Metadata {
  const isEs = lang === "es";
  const title = isEs
    ? "Artículos Recomendados | Amazon Affiliate Blog"
    : "Recommended Articles | Amazon Affiliate Blog";
  const description = isEs
    ? "Encuentra los mejores productos recomendados por IA en Amazon."
    : "Find the best Amazon recommended products daily using AI.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/blog`,
      siteName: "Amazon Affiliate Blog",
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog`,
      languages: {
        es: `${SITE_URL}/es/blog`,
        en: `${SITE_URL}/en/blog`,
      },
    },
  };
}

export function generatePostMetadata(post: Post): Metadata {
  const { lang, title, description, slug, thumbnail } = post;
  const isEs = lang === "es";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/blog/${slug}`,
      siteName: "Amazon Affiliate Blog",
      images: [
        {
          url: `${SITE_URL}${thumbnail}`,
          width: 1200,
          height: 630,
        },
      ],
      locale: isEs ? "es_ES" : "en_US",
      type: "article",
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/${slug}`,
      languages: {
        es: `${SITE_URL}/es/blog/${slug}`,
        en: `${SITE_URL}/en/blog/${slug}`,
      },
    },
  };
}
