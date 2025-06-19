"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect, ReactNode } from "react";
import { Language } from "./settings";

export function I18nProvider({ children, lang }: { children: ReactNode; lang: Language }) {
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
