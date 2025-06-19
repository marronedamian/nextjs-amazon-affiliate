// lib/amazonClient.ts
require("dotenv").config();
const AmazonPaapi = require("amazon-paapi");

const commonParams = {
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_ASSOCIATE_TAG, // Associate Tag
  partnerType: "Associates",
  marketplace: "www.amazon.com", // usa 'www.amazon.es' si es para España
};

async function fetchAmazonProducts(count = 5) {
  const searchItemsParams = {
    ...commonParams,
    Keywords: "electronics", // puedes cambiarlo o hacerlo dinámico
    SearchIndex: "All",
    Resources: [
      "ItemInfo.Title",
      "Images.Primary.Medium",
      "ItemInfo.Features",
      "ItemInfo.ProductInfo",
      "Offers.Listings.Price",
    ],
  };

  try {
    const data = await AmazonPaapi.SearchItems(searchItemsParams);

    const items = data.SearchResult?.Items || [];

    // Limitar a 'count'
    return items.slice(0, count).map((item: any) => ({
      id: item?.ASIN ?? "",
      title: item?.ItemInfo?.Title?.DisplayValue ?? "Producto sin título",
      description:
        (item?.ItemInfo?.Features?.DisplayValues || []).join(", ") ||
        "Sin descripción",
      imageUrl: item?.Images?.Primary?.Medium?.URL ?? "",
    }));
  } catch (error) {
    console.error("Error fetching Amazon products:", error);
    return [];
  }
}

module.exports = { fetchAmazonProducts };
