import { Metadata } from "next";
import { Language } from "@/utils/i18n/settings";
import HomeContent from "@/components/Home/HomeContent";

export async function generateMetadata({
    params,
}: {
    params: { lang: Language };
}): Promise<Metadata> {
    const isEs = params.lang === "es";
    return {
        title: isEs
            ? "Reseñas Automatizadas de Productos Amazon | Afiliado Oficial"
            : "Amazon Product Reviews | Official Affiliate",
        description: isEs
            ? "Descubre los mejores productos de Amazon con análisis diarios generados por IA."
            : "Discover top Amazon products with AI-generated daily reviews.",
        keywords: isEs
            ? "amazon, reseñas productos, inteligencia artificial, ofertas amazon, afiliado amazon"
            : "amazon, product reviews, artificial intelligence, amazon deals, amazon affiliate",
    };
}

export default function Page({
    params,
}: {
    params: { lang: Language };
}) {
    return <HomeContent lang={params.lang} />;
}

export async function generateStaticParams() {
    return [{ lang: "es" }, { lang: "en" }];
}
