const { generatePostsForLanguage } = require("../lib/postGenerator");
const fs = require("fs/promises");
const path = require("path");

async function main() {
  const languages = ["es", "en"];

  for (const lang of languages) {
    const posts = await generatePostsForLanguage(lang);

    const filePath = path.join(process.cwd(), "data", `posts_${lang}.json`);
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");

    console.log(`✅ Generated ${posts.length} posts for [${lang}]`);
  }
}

main().catch((error) => {
  console.error("❌ Error running cron:", error);
  process.exit(1);
});
