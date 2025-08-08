// app/lib/generate-article-content.ts
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
      ? `Eres un redactor profesional especializado en tecnología. Crea artículos minimalistas y atractivos con:
         - Varios estilos de post (párrafos, listas, citas)
         - Elementos visuales: emojis, iconos (🔍, ⚡, 💡, ❗, ✅)
         - Formato: negritas, cursivas, subtítulos H2/H3
         - Elementos interactivos: botones, preguntas/respuestas (FAQ)
         - Sección de recomendaciones con tarjetas de productos
         Usa espacio en blanco generosamente. Máximo 800 palabras.`
      : `You are a professional tech writer. Create minimalist, engaging articles with:
         - Multiple post styles (paragraphs, lists, blockquotes)
         - Visual elements: emojis, icons (🔍, ⚡, 💡, ❗, ✅)
         - Formatting: bold, italics, H2/H3 headings
         - Interactive elements: buttons, Q&A sections (FAQ)
         - Product recommendation cards
         Use generous whitespace. Max 800 words.`;

  const productCards = products
    .map((p) => {
      return lang === "es"
        ? `<div class="product-card">
            <h3>${p.title}</h3>
            <p>${p.description || ""}</p>
            <p class="price">${p.price}</p>
            <a href="${p.url}" class="product-button">Ver producto →</a>
          </div>`
        : `<div class="product-card">
            <h3>${p.title}</h3>
            <p>${p.description || ""}</p>
            <p class="price">${p.price}</p>
            <a href="${p.url}" class="product-button">View product →</a>
          </div>`;
    })
    .join("\n");

  const user =
    lang === "es"
      ? `## Tema: ${title}
         ### Descripción: ${description}
         
         ## Instrucciones especiales:
         1. Incluye al menos 2 preguntas/respuestas (FAQ) con ❓ e iconos
         2. Usa negritas para términos importantes y citas para frases destacadas
         3. Incluye 1-2 botones interactivos (clase: interactive-button)
         4. Sección de productos: usa tarjetas con clase "product-grid"
         5. Máximo 5 párrafos seguidos antes de un elemento visual
         6. Usa iconos (🔍, ⚡, 💡) para listas y tips
         
         ### Productos recomendados:
         <div class="product-grid">
           ${productCards}
         </div>`
      : `## Topic: ${title}
         ### Description: ${description}
         
         ## Special instructions:
         1. Include at least 2 Q&A items (FAQ) with ❓ and icons
         2. Use bold for key terms and blockquotes for highlights
         3. Include 1-2 interactive buttons (class: interactive-button)
         4. Product section: use cards with "product-grid" class
         5. Max 5 consecutive paragraphs before visual break
         6. Use icons (🔍, ⚡, 💡) for lists and tips
         
         ### Recommended Products:
         <div class="product-grid">
           ${productCards}
         </div>`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return response.choices[0].message.content ?? "";
}
