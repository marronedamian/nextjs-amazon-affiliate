
"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/utils/i18n/i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import Background from "../Shared/Background";

export default function LandingPage({ lang }: { lang: string }) {
    const { t } = useTranslation("common");
    const pathname = usePathname();
    const currentLang = pathname?.split("/")[1] || "en";

    useEffect(() => {
        if (lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }
    }, [lang]);

    useEffect(() => {
        AOS.init({ once: true, duration: 800, offset: 100, easing: 'ease-out-cubic' });
    }, []);

    const benefits = [
        { title: t("benefits.ai_title"), content: t("benefits.ai_desc"), icon: "🤖" },
        { title: t("benefits.daily_title"), content: t("benefits.daily_desc"), icon: "🔄" },
        { title: t("benefits.affiliate_title"), content: t("benefits.affiliate_desc"), icon: "🔒" },
    ];

    const howItWorks = [
        { title: t("how.0.title"), description: t("how.0.desc"), icon: "📝" },
        { title: t("how.1.title"), description: t("how.1.desc"), icon: "📈" },
        { title: t("how.2.title"), description: t("how.2.desc"), icon: "💰" },
    ];

    const testimonials = [
        { quote: t("testimonials.0.quote"), name: t("testimonials.0.name") },
        { quote: t("testimonials.1.quote"), name: t("testimonials.1.name") },
        { quote: t("testimonials.2.quote"), name: t("testimonials.2.name") },
    ];

    return (
        <Background>
            <section className="pt-40 pb-24 px-6 text-center z-10 relative">
                <div className="max-w-4xl mx-auto p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-lg transition duration-500" data-aos="fade-down">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        {t("hero.title_part1")} <span className="text-pink-500">{t("hero.title_part2")}</span><span className="animate-pulse text-white">_</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10">{t("hero.subtitle")}</p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <a href="/es/blog" className="px-6 py-3 bg-white/10 border border-pink-400 text-pink-300 hover:bg-pink-600 hover:text-white rounded-lg font-semibold transition-all duration-300 backdrop-blur-xl shadow-md hover:scale-105">
                            {t("hero.cta_es")}
                        </a>
                        <a href="/en/blog" className="px-6 py-3 bg-white/10 border border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg font-semibold transition-all duration-300 backdrop-blur-xl shadow-md hover:scale-105">
                            {t("hero.cta_en")}
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-16" data-aos="zoom-in-up">{t("benefits.title")}</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg transition-transform hover:scale-105" data-aos="flip-left" data-aos-delay={`${index * 100}`}>
                            <div className="text-5xl mb-4">{benefit.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2">{benefit.title}</h3>
                            <p className="text-gray-300">{benefit.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 bg-white/5 backdrop-blur-xl border-t border-white/10 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-16" data-aos="fade-left">{t("how.title")}</h2>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {howItWorks.map((step, index) => (
                        <div key={index} className="p-6 bg-white/10 rounded-2xl text-center shadow-lg transition-transform hover:scale-105" data-aos="fade-right" data-aos-delay={`${index * 150}`}>
                            <div className="text-4xl mb-4">{step.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-300">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-16" data-aos="zoom-in">{t("testimonials.title")}</h2>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <blockquote key={i} className="p-6 bg-white/5 rounded-xl border border-white/10 shadow-inner text-center" data-aos="zoom-in-up" data-aos-delay={`${i * 200}`}>
                            <p className="italic text-gray-300">"{t.quote}"</p>
                            <footer className="mt-4 text-pink-400 font-semibold">— {t.name}</footer>
                        </blockquote>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 text-center bg-pink-600/10 backdrop-blur-2xl rounded-t-3xl border-t border-white/10 relative z-10">
                <h2 className="text-4xl font-bold mb-6 text-white" data-aos="fade-up">{t("cta.title")}</h2>
                <p className="text-lg text-gray-300 mb-8" data-aos="fade-up" data-aos-delay="100">{t("cta.description")}</p>
                <Link href={`/${currentLang}/blog`} className="px-10 py-4 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-transform hover:scale-110" data-aos="zoom-in">
                    {t("cta.button")}
                </Link>
            </section>
        </Background>
    );
}