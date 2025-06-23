import { getPost, getPosts } from "@/utils/amazon/posts";
import { generatePostMetadata } from "@/utils/seo";
import Background from "@/components/Shared/Background";
import Image from "next/image";
import ArticleContent from "@/components/Blog/ArticleContent";
import Recommended from "@/components/Blog/Recommended";
import { Heart, Share2, ShoppingCart } from "lucide-react";

export async function generateMetadata({ params }: { params: { lang: "es" | "en"; slug: string } }) {
  const post = await getPost(params.lang, params.slug);
  if (!post) return { title: "Post not found" };
  return generatePostMetadata(post);
}

export default async function Page({ params }: { params: { lang: "es" | "en"; slug: string } }) {
  const post = await getPost(params.lang, params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        {params.lang === "es" ? "Artículo no encontrado." : "Post not found."}
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [`${process.env.NEXT_PUBLIC_SITE_URL}${post.thumbnail}`],
    author: {
      "@type": "Organization",
      name: "Amazon Affiliate Blog",
    },
    publisher: {
      "@type": "Organization",
      name: "Amazon Affiliate Blog",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    datePublished: post.createdAt,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.lang}/blog/${post.slug}`,
  };

  return (
    <Background>
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-2xl mb-10 border border-white/10">
          <Image
            src={post.thumbnail || "/images/fallback.jpg"}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="bg-black/40 hover:bg-pink-500 transition-colors p-2 rounded-full text-white">
              <Heart size={18} />
            </button>
            <button className="bg-black/40 hover:bg-blue-400 transition-colors p-2 rounded-full text-white">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl px-8 py-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 text-center">
            {post.title}
          </h1>
          <p className="text-sm text-gray-400 mb-8 text-center">
            {new Date(post.createdAt).toLocaleDateString(params.lang === "es" ? "es-ES" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <ArticleContent html={post.content} />

          <div className="mt-16 flex justify-center">
            <a
              href={post.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-2xl border border-green-500 hover:bg-green-600/30 text-green-300 hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-110 shadow-xl"
            >
              <ShoppingCart size={20} />
              {params.lang === "es" ? "Comprar en Amazon" : "Buy on Amazon"}
            </a>
          </div>
        </div>
        <Recommended topic={post.slug} lang={params.lang} />
      </div>
    </Background>
  );
}

export async function generateStaticParams() {
  const langs = ["es", "en"] as const;
  const params: { lang: string; slug: string }[] = [];

  for (const lang of langs) {
    const posts = await getPosts(lang);
    posts.forEach((post) => {
      params.push({ lang, slug: post.slug });
    });
  }

  return params;
}
