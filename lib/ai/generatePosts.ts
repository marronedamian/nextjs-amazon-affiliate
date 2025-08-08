import "dotenv/config";
import { generatePostsWithGPT } from "./generatePostsFromArticles";

async function main() {
  const totalPosts = Number(process.env.POSTS_TO_GENERATE || "2");
  const ratio = Number(process.env.GPT_POST_RATIO || "0.6"); // 30% serán posts GPT-only

  try {
    await generatePostsWithGPT({ amount: totalPosts, ratio });
    console.log("🎉 Generación de publicaciones completada.");
  } catch (err) {
    console.error("❌ Error generando publicaciones:", err);
  }
}

main();
