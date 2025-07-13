const amazonPaapi = require("amazon-paapi");
import "dotenv/config";

const commonParams = {
  AccessKey: process.env.AMAZON_ACCESS_KEY!,
  SecretKey: process.env.AMAZON_SECRET_KEY!,
  PartnerTag: process.env.AMAZON_ASSOCIATE_TAG!,
  PartnerType: "Associates",
  Marketplace: "www.amazon.com",
};

export async function fetchAmazonProducts(
  keywords: string,
  lang: string,
  page: number = 1
) {
  const requestParams = {
    Keywords: keywords,
    SearchIndex: "All",
    ItemCount: 5,
    ItemPage: page,
    Resources: [
      "ItemInfo.Title",
      "ItemInfo.Features",
      "Images.Primary.HighRes",
      "Images.Primary.Large",
      "Images.Primary.Medium",
      "Offers.Listings.Price",
    ],
  };

  try {
    const result = await amazonPaapi.SearchItems(commonParams, requestParams);

    return (
      result.SearchResult?.Items?.map((item: any) => {
        const highRes = item.Images?.Primary?.HighRes?.URL;
        const large = item.Images?.Primary?.Large?.URL;
        const medium = item.Images?.Primary?.Medium?.URL;

        return {
          id: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue ?? "",
          description: item.ItemInfo?.Features?.DisplayValues?.join("\n") ?? "",
          imageUrl: highRes || large || medium || "",
          url: item.DetailPageURL ?? "",
        };
      }) ?? []
    );
  } catch (err) {
    console.error("❌ Error al buscar productos de Amazon:", err);
    return [];
  }
}
