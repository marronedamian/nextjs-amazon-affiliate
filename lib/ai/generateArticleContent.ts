import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateArticleContent({
  title,
  description,
  lang,
  products,
}: {
  title: string;
  description: string;
  lang: "es" | "en";
  products: {
    title: string;
    price: string;
    imageUrl: string;
    url: string;
    description?: string;
  }[];
}) {
  const system =
    lang === "es"
      ? `Eres un redactor profesional de tecnología. Redactá un artículo atractivo con subtítulos, texto en negrita, emojis, bullets y consejos útiles. Incluí una sección de recomendaciones al final con enlaces de afiliado.`
      : `You are a professional tech writer. Write an engaging article with headings, bold text, emojis, bullet points and practical tips. Include a final section with affiliate links.`;

  const productList = products
    .map((p) => {
      const name = p.title.trim();
      const link = p.url;
      return lang === "es"
        ? `🔹 ${name} → [Comprar ahora](${link})`
        : `🔹 ${name} → [Buy now](${link})`;
    })
    .join("\n");

  const user =
    lang === "es"
      ? `Título: ${title}\nDescripción: ${description}\nProductos:\n${productList}\n\nRedactá el artículo completo incluyendo los productos en el cuerpo. Al final, colocá una lista con los enlaces de afiliado bajo el título "Productos recomendados".`
      : `Title: ${title}\nDescription: ${description}\nProducts:\n${productList}\n\nWrite the full article including the products in the main content. At the end, add a list of affiliate links under the heading "Recommended Products".`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.8,
  });

  return response.choices[0].message.content ?? "";
}
