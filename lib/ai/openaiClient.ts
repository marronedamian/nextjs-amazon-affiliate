require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generatePostContent(title: string, description: string) {
  const prompt = `
Eres un redactor experto. Escribe un artículo SEO de entre 300 y 400 palabras sobre el siguiente producto de Amazon:

Título: "${title}"
Descripción breve: "${description}"

Incluye:
- Introducción breve.
- Características principales.
- Ventajas de comprarlo.
- Llamado a la acción final.

No menciones que eres una IA. No repitas el título al principio. Hazlo natural y humano.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content || "";

  return { content };
}

module.exports = { generatePostContent };
