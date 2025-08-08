import { db } from "../db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const POST_USER_ID = "cmd1cj11z0000g9eadfmhb552"; //cmd20pos10008y7m6ppu1r80t
const SITE_URL = "https://bestpickr.store";

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const prompts = {
  en: [
    `Write a short 2-3 line post asking a tech-related question to the community.
Use informal language like "anyone else", "worth it?", emojis (1–2 max), broken sentences, lowercase ok.
Examples:
- anyone else notice their bluetooth buds disconnect when walking? 🤨
- i bought this wireless charger... not sure if it was a good move
- is paying $300 for a keyboard just... normal now?

Don't use hashtags or product names. Make it sound like a real person.`,
    
    `Write a short 2-3 line personal recommendation about a tech product you like (no name or link).
Use natural tone, casual phrasing. Add a small emoji or emotional reaction.
Examples:
- been using the same mouse for months now. zero complaints 👌
- this power bank legit saved me 3 times last week lol
- headphones with physical buttons >>> anything else. trust me.`,
    
    `Write a quick, casual tech tip or trick that sounds human.
Use natural tone, emojis ok, lowercase accepted, minor grammar flaws allowed.
Examples:
- put your phone in airplane mode to charge faster ⚡
- blowing into usb-c ports fixes so many issues it's insane
- restart your earbuds. seriously. solved my lag problem 😅`,
  ],
  es: [
    `Escribí un post corto (2-3 líneas) con una duda real para la comunidad sobre tecnología.
Usá lenguaje natural, emojis si querés, frases cortadas o minúsculas también sirven.
Ejemplos:
- alguien más tuvo dramas con auriculares bluetooth? 😩
- me compré un cargador inalámbrico... y no sé si fue buena idea
- vale la pena pagar 200 dólares por unos auris?

No pongas hashtags ni nombres de productos. Que suene real.`,

    `Recomendá algo que uses de verdad. 2 líneas. Sin marcas ni links. Con tono relajado.
Ejemplos:
- tengo un mouse barato que me anda perfecto hace meses 🖱️
- el cargador portátil me salvó la vida el finde pasado
- prefiero botones físicos en los auris. siempre.`,

    `Compartí un tip real que te haya servido con tecnología. Que suene humano, como una historia real.
Ejemplos:
- ponelo en modo avión y carga más rápido ⚡
- soplar el puerto usb-c... parece chiste, pero me funcionó
- reiniciar los auriculares a veces arregla todo 😅`,
  ],
};

const articleContextPrompts = {
  en: (title: string) =>
    `You're a casual tech enthusiast sharing a blog post on social media. Write a 2-3 line post that sounds very real and informal. Use emojis, lowercase, minor grammar quirks.
React to the topic (don't mention title), give a small opinion or emotion. The article is about: "${title}". End with a natural pause like "🤔", "worth a read", etc.`,
  
  es: (title: string) =>
    `Sos una persona común compartiendo un artículo tech en redes. Escribí 2-3 líneas reales, con tono relajado, informal.
Reaccioná al tema (no pongas el título). Puede haber emojis, errores sutiles o expresiones como “no sé”, “posta”, “jajaja”.
El artículo es sobre: "${title}". Terminá con una reacción humana tipo “me pareció curioso 🤷‍♂️”, “leánlo y me cuentan”, etc.`,
};

export async function generatePostsWithGPT({
  amount = 10,
  ratio = 0.5,
}: {
  amount?: number;
  ratio?: number;
}) {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const grouped = {
    en: articles.filter((a) => a.language === "en"),
    es: articles.filter((a) => a.language === "es"),
  };

  let created = 0;

  for (const lang of ["en", "es"] as const) {
    let langCreated = 0;
    const usedSlugs = new Set<string>();

    while (langCreated < amount) {
      const shouldUseGPT = Math.random() < ratio;

      if (shouldUseGPT) {
        const prompt = getRandom(prompts[lang]);

        const completion = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.95,
          max_tokens: 200,
        });

        const content = completion.choices[0].message.content?.trim();
        if (!content || content.length < 30) continue;

        const alreadyPosted = await db.post.findFirst({
          where: {
            userId: POST_USER_ID,
            content: {
              startsWith: content.slice(0, 50),
            },
          },
        });

        if (alreadyPosted) continue;

        await db.post.create({
          data: {
            userId: POST_USER_ID,
            content,
          },
        });

        console.log(`🤖 GPT post libre creado en ${lang}`);
        langCreated++;
        created++;
      } else {
        const availableArticles = grouped[lang].filter(
          (a) => !usedSlugs.has(a.slug)
        );
        const article = getRandom(availableArticles);
        if (!article) break;

        const slug = article.slug;
        usedSlugs.add(slug);

        const alreadyPosted = await db.post.findFirst({
          where: {
            userId: POST_USER_ID,
            content: {
              contains: `/blog/${slug}`,
            },
          },
        });

        if (alreadyPosted) continue;

        const contextPrompt = articleContextPrompts[lang](article.title);

        const completion = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [{ role: "user", content: contextPrompt }],
          temperature: 0.95,
          max_tokens: 200,
        });

        const generatedText = completion.choices[0].message.content?.trim();
        if (!generatedText || generatedText.length < 30) continue;

        const blogLink = `${SITE_URL}/${lang}/blog/${slug}`;
        const content = `${generatedText}\n\n${blogLink}`;

        await db.post.create({
          data: {
            userId: POST_USER_ID,
            content,
          },
        });

        console.log(`✅ Post con artículo creado en [${lang}]: ${slug}`);
        langCreated++;
        created++;
      }
    }
  }

  if (created === 0) {
    console.log("⚠️ No se generaron nuevos posts (todos ya existen).");
  }
}
