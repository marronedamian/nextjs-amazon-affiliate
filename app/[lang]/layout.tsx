"use client";

import { ReactNode } from "react";
import { I18nProvider } from "@/utils/i18n/i18nProvider";
import { Language } from "@/utils/i18n/settings";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import BottomNav from "@/components/Navigation/BottomNav";
import { useSession } from "next-auth/react";
import "@/app/globals.css";

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: Language };
}) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <html lang={params.lang} className="h-full">
      <body className="flex flex-col min-h-screen text-white bg-transparent">
        <I18nProvider lang={params.lang}>
          <Header />
            <main className="flex-grow">{children}</main>
          <Footer />

          {isLoggedIn && (
            <BottomNav />
          )}
        </I18nProvider>
      </body>
    </html >
  );
}
