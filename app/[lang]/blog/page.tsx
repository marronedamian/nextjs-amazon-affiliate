import { getPosts } from "@/utils/amazon/posts";
import { generateSiteMetadata } from "@/utils/seo";
import dynamic from "next/dynamic";

const BlogContent = dynamic(() => import("@/components/Blog/BlogContent"), { ssr: false });

export async function generateMetadata({ params }: { params: { lang: "es" | "en" } }) {
    return generateSiteMetadata(params.lang);
}

export default async function Page({ params }: { params: { lang: "es" | "en" } }) {
    const posts = await getPosts(params.lang);

    return (<BlogContent posts={posts} lang={params.lang} />);
}

export async function generateStaticParams() {
    return [{ lang: "es" }, { lang: "en" }];
}
