import { fetchAmazonProducts } from "../amazon/amazonClient";
import { generateArticleContent } from "./generateArticleContent";
import { fetchUnsplashImage } from "../unsplash/unsplashClient";
import slugify from "slugify";
import { db } from "../db";

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isValidAmazonProductUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.includes("amazon.") &&
      (parsed.pathname.includes("/dp/") || parsed.pathname.includes("/gp/"))
    );
  } catch {
    return false;
  }
}

export async function getSmartImageFallback(
  keyword: string,
  productImage?: string
): Promise<string> {
  if (productImage) return productImage;

  const unsplashImage = await fetchUnsplashImage(keyword);
  if (unsplashImage) return unsplashImage;

  const fallbackImages = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581090700227-1e8eab66f94a?auto=format&fit=crop&w=800&q=80",
  ];
  return getRandom(fallbackImages);
}

export async function generatePostsForLanguage(language: "es" | "en") {
  const topics =
    language === "es"
      ? [
          "auriculares",
          "notebooks",
          "gadgets",
          "gaming",
          "sillas ergonómicas",
          "cámaras web",
          "ropa deportiva",
          "zapatillas running",
          "accesorios de cocina",
          "organizadores de escritorio",
          "bicicletas",
          "smartwatches",
          "juguetes educativos",
          "herramientas eléctricas",
          "libros de autoayuda",
          "muebles para oficina",
          "mochilas escolares",
        ]
      : [
          "headphones",
          "laptops",
          "gadgets",
          "gaming",
          "ergonomic chairs",
          "webcams",
          "sportswear",
          "running shoes",
          "kitchen accessories",
          "desk organizers",
          "bicycles",
          "smartwatches",
          "educational toys",
          "power tools",
          "self-help books",
          "office furniture",
          "school backpacks",
        ];

  const titles = {
    es: [
      "¿Cuál es el mejor {keyword} que puedes comprar?",
      "Guía definitiva de {keyword} en 2025 🛒",
      "Comparativa: Los {keyword} más recomendados por expertos",
      "Top picks en {keyword} con mejor relación precio-calidad",
      "¿Buscando {keyword}? Esto es lo que necesitás saber",
      "Ranking de los mejores {keyword} según usuarios reales ⭐",
      "Elegí bien: Los {keyword} más valorados del año",
    ],
    en: [
      "Which {keyword} should you buy in 2025?",
      "Ultimate Guide to Choosing the Best {keyword} 📘",
      "Top-rated {keyword} for Quality and Price",
      "What are the best {keyword} right now? Here's our pick",
      "Expert Comparison: Best {keyword} this year",
      "Our favorite {keyword} from Amazon deals",
      "Buyer’s guide: The best value {keyword} in 2025",
    ],
  };

  const descriptions = {
    es: [
      "Una revisión completa con consejos, ventajas y enlaces útiles.",
      "Conocé los mejores {keyword} para este año y por qué valen la pena.",
      "Exploramos opciones confiables para ayudarte a decidir mejor.",
      "Todo lo que necesitás saber antes de comprar {keyword}.",
      "Seleccionamos los {keyword} con mejores reviews y precios.",
    ],
    en: [
      "A complete review with tips, pros and affiliate links.",
      "Discover the best {keyword} this year and why they stand out.",
      "Explore reliable choices and smart recommendations.",
      "Everything you need to know before buying {keyword}.",
      "We selected the best-reviewed and priced {keyword}.",
    ],
  };

  const affiliateTag = process.env.AMAZON_ASSOCIATE_TAG;

  for (const keyword of topics) {
    try {
      console.log(`🔍 Buscando productos para: ${keyword}`);
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const products = await fetchAmazonProducts(keyword, language, randomPage);
      if (!products?.length) {
        console.warn(`⚠️ No se encontraron productos para: ${keyword}`);
        continue;
      }

      const validProduct = products.find((p: any) =>
        isValidAmazonProductUrl(p.url)
      );
      if (!validProduct) {
        console.warn(`❌ Ningún producto con URL válida para: ${keyword}`);
        continue;
      }

      const rawTitle = getRandom(titles[language]);
      const rawDescription = getRandom(descriptions[language]);

      const title = rawTitle.replace("{keyword}", keyword);
      const description = rawDescription.replace("{keyword}", keyword);
      const imageUrl = await getSmartImageFallback(
        keyword,
        validProduct.imageUrl
      );

      const content = await generateArticleContent({
        title,
        description,
        lang: language,
        products,
      });

      const slug = slugify(title, { lower: true, strict: true });

      const url = new URL(validProduct.url);
      url.searchParams.set("tag", affiliateTag!);
      url.searchParams.set("linkCode", "sl1");
      url.searchParams.set("language", language === "es" ? "es_US" : "en_US");
      url.searchParams.set("ref_", "as_li_ss_tl");

      const amazonLink = url.toString();

      await db.article.create({
        data: {
          title,
          slug,
          content,
          description,
          language,
          imageUrl,
          amazonLink,
          products: products as any,
        },
      });

      console.log(`✅ Guardado artículo [${language}]: ${title}`);
    } catch (err) {
      console.error(`❌ Error generando artículo para "${keyword}":`, err);
    }
  }
}
