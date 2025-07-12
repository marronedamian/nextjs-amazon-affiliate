import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

let initialized = false;

export async function createTranslation(locale: string, ns: string) {
  if (!initialized) {
    await i18next.use(Backend).init({
      lng: locale,
      fallbackLng: "en",
      ns: [ns],
      defaultNS: ns,
      backend: {
        loadPath: path.resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
      interpolation: {
        escapeValue: false,
      },
    });
    initialized = true;
  } else {
    await i18next.changeLanguage(locale);
  }

  return {
    t: i18next.getFixedT(locale, ns),
  };
}
