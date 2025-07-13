import "dotenv/config";
import { generatePostsForLanguage } from "./articleGenerator";

async function main() {
  const languages: ("es" | "en")[] = ["en", "es"];

  for (const lang of languages) {
    try {
      await generatePostsForLanguage(lang);
    } catch (err) {
      console.error(`❌ Error generando artículos en [${lang}]:`, err);
    }
  }
}

main();
