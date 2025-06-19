import { RecommendedProduct } from "@/types/products.types";

const PRODUCT_MAP: Record<string, Record<"es" | "en", RecommendedProduct[]>> = {
  speakers: {
    es: [
      {
        title: "Auriculares Bluetooth Sony WH-CH520",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.es/dp/B0BN2WZ5C6?tag=TU_TAG",
      },
      {
        title: "Auriculares Bluetooth Sony WH-CH520",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.es/dp/B0BN2WZ5C6?tag=TU_TAG",
      },
      {
        title: "Auriculares Bluetooth Sony WH-CH520",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.es/dp/B0BN2WZ5C6?tag=TU_TAG",
      },
      {
        title: "Auriculares Bluetooth Sony WH-CH520",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.es/dp/B0BN2WZ5C6?tag=TU_TAG",
      },
      {
        title: "Auriculares Bluetooth Sony WH-CH520",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.es/dp/B0BN2WZ5C6?tag=TU_TAG",
      },
    ],
    en: [
      {
        title: "Sony WH-CH520 Wireless Headphones",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.com/dp/B0BN2WZ5C6?tag=YOUR_TAG",
      },
      {
        title: "Sony WH-CH520 Wireless Headphones",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.com/dp/B0BN2WZ5C6?tag=YOUR_TAG",
      },
      {
        title: "Sony WH-CH520 Wireless Headphones",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.com/dp/B0BN2WZ5C6?tag=YOUR_TAG",
      },
      {
        title: "Sony WH-CH520 Wireless Headphones",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.com/dp/B0BN2WZ5C6?tag=YOUR_TAG",
      },
      {
        title: "Sony WH-CH520 Wireless Headphones",
        imageUrl: "/images/jbl8128.png",
        affiliateUrl: "https://www.amazon.com/dp/B0BN2WZ5C6?tag=YOUR_TAG",
      },
    ],
  },
};

export function getRecommendedProducts(
  topic: string,
  lang: "es" | "en"
): RecommendedProduct[] {
  const lower = topic.toLowerCase();

  for (const keyword in PRODUCT_MAP) {
    if (lower.includes(keyword)) {
      return PRODUCT_MAP[keyword][lang] ?? [];
    }
  }

  return [];
}
