import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function fetchUnsplashImage(
  keyword: string
): Promise<string | null> {
  try {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: keyword,
        orientation: "landscape",
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const image = res.data.results?.[0];
    return image?.urls?.regular ?? null;
  } catch (error) {
    console.error("❌ Error al buscar imagen en Unsplash:", error);
    return null;
  }
}
