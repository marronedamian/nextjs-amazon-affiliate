import { getPosts } from "@/utils/amazon/posts";
import { generateSiteMetadata } from "@/utils/seo";
import dynamic from "next/dynamic";

const BlogContent = dynamic(() => import("@/components/Blog/Content"), { ssr: false });

export async function generateMetadata({ params }: { params: { lang: "es" | "en" } }) {
    return generateSiteMetadata(params.lang);
}

export default async function Page({ params }: { params: { lang: "es" | "en" } }) {
    const posts = await getPosts(params.lang);

    return (
        <main className="relative min-h-screen overflow-hidden text-white font-sans bg-gradient-radial from-[#1a1a1d] via-[#111114] to-[#0a0a0a]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[180px] animate-pulse-slow delay-700" />
                <div className="absolute bottom-[-5%] left-[35%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[240px] animate-pulse-slow delay-1000" />
            </div>
            <BlogContent posts={posts} lang={params.lang} />
        </main>
    );
}

export async function generateStaticParams() {
    return [{ lang: "es" }, { lang: "en" }];
}
