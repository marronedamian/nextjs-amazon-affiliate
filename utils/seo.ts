import type { Metadata } from "next";
import { Post } from "@/types/posts.types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bestpickr.store";

export function generateSiteMetadata(lang: "es" | "en"): Metadata {
  const isEs = lang === "es";
  const title = isEs
    ? "Artículos Recomendados | BestPickr.store"
    : "Recommended Articles | BestPickr.store";
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
      siteName: "BestPickr.store",
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

  const imageUrl = thumbnail?.startsWith("http")
    ? thumbnail
    : `${SITE_URL}${thumbnail}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/blog/${slug}`,
      siteName: "BestPickr.store",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      locale: isEs ? "es_ES" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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
