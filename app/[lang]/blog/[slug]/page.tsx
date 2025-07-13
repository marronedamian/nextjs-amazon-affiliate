import { getPost, getPosts } from "@/utils/amazon/posts";
import { generatePostMetadata } from "@/utils/seo";
import Background from "@/components/Shared/Background";
import Image from "next/image";
import ArticleContent from "@/components/Blog/ArticleContent";
import Recommended from "@/components/Blog/Recommended";
import { ShoppingCart } from "lucide-react";
import { formatMarkdownToHtml } from "@/lib/formatMarkdown";

export async function generateMetadata({ params }: { params: { lang: "es" | "en"; slug: string } }) {
  const post = await getPost(params.lang, params.slug);
  if (!post) return { title: "Post not found" };
  return generatePostMetadata({
    ...post,
    lang: post.language as "es" | "en",
    thumbnail: post.imageUrl,
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
  });
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
    image: [post.imageUrl],
    author: {
      "@type": "Organization",
      name: "BestPickr.store",
    },
    publisher: {
      "@type": "Organization",
      name: "BestPickr.store",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-2xl mb-10 border border-white/10">
          <Image
            src={post.imageUrl || "/images/fallback.jpg"}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl px-8 py-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 text-center">
            {post.title}
          </h1>
          <p className="text-sm text-gray-400 mb-8 text-center">
            {new Date(post.createdAt).toLocaleDateString(
              params.lang === "es" ? "es-ES" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </p>

          <ArticleContent html={formatMarkdownToHtml(post.content)} />

          {post.amazonLink && (
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
          )}
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
    try {
      const posts = await getPosts(lang);

      if (Array.isArray(posts)) {
        posts.forEach((post) => {
          if (post?.slug) {
            params.push({ lang, slug: post.slug });
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error loading posts for lang ${lang}:`, error);
      // Continúa sin agregar params si falla
    }
  }

  return params;
}
