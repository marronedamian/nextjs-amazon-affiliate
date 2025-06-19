const amazonClient = require("../lib/amazonClient");
const openaiClient = require("../lib/openaiClient");

function slugify(text: any) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

module.exports.generatePostsForLanguage = async function (lang: any) {
  const products = await amazonClient.fetchAmazonProducts(5);

  const posts = [];

  for (const product of products) {
    const { content } = await openaiClient.generatePostContent(
      product.title,
      product.description
    );

    const slug = slugify(product.title);

    posts.push({
      slug,
      title: product.title,
      description: product.description,
      content,
      imageUrl: product.imageUrl,
      affiliateUrl: `https://www.amazon.${lang === "es" ? "es" : "com"}/dp/${
        product.id
      }?tag=${process.env.AMAZON_ASSOCIATE_TAG}`,
    });
  }

  return posts;
};
