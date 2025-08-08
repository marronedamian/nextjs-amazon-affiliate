const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function scripts() {
  const notificationTypes = [
    { id: "notif_comment", name: "comment" },
    { id: "notif_follow", name: "follow" },
    { id: "notif_like", name: "like" },
    { id: "notif_story_comment", name: "story_comment" },
    { id: "notif_reply", name: "reply" },
    { id: "notif_mention", name: "mention" },
    { id: "notif_repost", name: "repost" },
    { id: "notif_comment_like", name: "comment_like" },
    { id: "notif_comment_reply", name: "comment_reply" },
    { id: "notif_post_comment", name: "post_comment" },
  ];

  for (const type of notificationTypes) {
    await prisma.notificationType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  const translations = [
    {
      language: "es",
      label: "Te empezó a seguir",
      notificationTypeId: "notif_follow",
    },
    {
      language: "en",
      label: "Started following you",
      notificationTypeId: "notif_follow",
    },
    {
      language: "es",
      label: "Le gustó tu publicación",
      notificationTypeId: "notif_like",
    },
    {
      language: "en",
      label: "Liked your post",
      notificationTypeId: "notif_like",
    },
    {
      language: "es",
      label: "Comentó tu publicación",
      notificationTypeId: "notif_comment",
    },
    {
      language: "en",
      label: "Commented on your post",
      notificationTypeId: "notif_comment",
    },
    {
      language: "es",
      label: "Comentó tu historia",
      notificationTypeId: "notif_story_comment",
    },
    {
      language: "en",
      label: "Commented on your story",
      notificationTypeId: "notif_story_comment",
    },
    {
      language: "es",
      label: "Respondió a tu comentario",
      notificationTypeId: "notif_reply",
    },
    {
      language: "en",
      label: "Replied to your comment",
      notificationTypeId: "notif_reply",
    },
    {
      language: "es",
      label: "Te mencionó en una publicación",
      notificationTypeId: "notif_mention",
    },
    {
      language: "en",
      label: "Mentioned you in a post",
      notificationTypeId: "notif_mention",
    },
    {
      language: "es",
      label: "Compartió tu publicación",
      notificationTypeId: "notif_repost",
    },
    {
      language: "en",
      label: "Reposted your post",
      notificationTypeId: "notif_repost",
    },
    {
      language: "es",
      label: "Le gustó tu comentario",
      notificationTypeId: "notif_comment_like",
    },
    {
      language: "en",
      label: "Liked your comment",
      notificationTypeId: "notif_comment_like",
    },
    {
      language: "es",
      label: "Respondió a tu comentario",
      notificationTypeId: "notif_comment_reply",
    },
    {
      language: "en",
      label: "Replied to your comment",
      notificationTypeId: "notif_comment_reply",
    },
    {
      language: "es",
      label: "Comentó tu publicación",
      notificationTypeId: "notif_post_comment",
    },
    {
      language: "en",
      label: "Commented on your post",
      notificationTypeId: "notif_post_comment",
    },
  ];

  for (const t of translations) {
    const existing = await prisma.notificationTypeTranslation.findFirst({
      where: {
        language: t.language,
        notificationTypeId: t.notificationTypeId,
      },
    });

    if (!existing) {
      await prisma.notificationTypeTranslation.create({
        data: {
          id: uuidv4(),
          ...t,
        },
      });
    }
  }

  console.log(
    "✅ Tipos y traducciones de notificación insertados correctamente."
  );

  const categories = [
    {
      emoji: "📱",
      query: "electronics",
      label_es: "Electrónica",
      label_en: "Electronics",
    },
    {
      emoji: "👟",
      query: "clothing+shoes",
      label_es: "Ropa y Calzado",
      label_en: "Clothing & Shoes",
    },
    {
      emoji: "🏋️‍♂️",
      query: "sports+fitness",
      label_es: "Deportes y Fitness",
      label_en: "Sports & Fitness",
    },
    { emoji: "🍳", query: "kitchen", label_es: "Cocina", label_en: "Kitchen" },
    { emoji: "💄", query: "beauty", label_es: "Belleza", label_en: "Beauty" },
    {
      emoji: "🛋️",
      query: "home+decor",
      label_es: "Hogar",
      label_en: "Home & Decor",
    },
    {
      emoji: "🎮",
      query: "video+games",
      label_es: "Videojuegos",
      label_en: "Video Games",
    },
    { emoji: "📚", query: "books", label_es: "Libros", label_en: "Books" },
    { emoji: "🧸", query: "toys", label_es: "Juguetes", label_en: "Toys" },
    {
      emoji: "💻",
      query: "computers",
      label_es: "Computación",
      label_en: "Computers",
    },
    { emoji: "🎧", query: "headphones", label_es: "Audio", label_en: "Audio" },
    {
      emoji: "🚗",
      query: "automotive",
      label_es: "Automotriz",
      label_en: "Automotive",
    },
    { emoji: "👶", query: "baby", label_es: "Bebés", label_en: "Babies" },
    {
      emoji: "🐶",
      query: "pet+supplies",
      label_es: "Mascotas",
      label_en: "Pet Supplies",
    },
    {
      emoji: "🖼️",
      query: "arts+crafts",
      label_es: "Arte y Manualidades",
      label_en: "Arts & Crafts",
    },
    {
      emoji: "🧼",
      query: "personal+care",
      label_es: "Cuidado Personal",
      label_en: "Personal Care",
    },
    {
      emoji: "⛺",
      query: "outdoor+recreation",
      label_es: "Camping y Outdoor",
      label_en: "Outdoor Recreation",
    },
    {
      emoji: "💡",
      query: "lighting",
      label_es: "Iluminación",
      label_en: "Lighting",
    },
    {
      emoji: "🧳",
      query: "travel+gear",
      label_es: "Viajes",
      label_en: "Travel Gear",
    },
    {
      emoji: "🪑",
      query: "furniture",
      label_es: "Muebles",
      label_en: "Furniture",
    },
    {
      emoji: "🛠️",
      query: "tools+hardware",
      label_es: "Herramientas",
      label_en: "Tools & Hardware",
    },
    {
      emoji: "🏫",
      query: "office+school+supplies",
      label_es: "Escolar y Oficina",
      label_en: "Office & School Supplies",
    },
    {
      emoji: "🕶️",
      query: "fashion+accessories",
      label_es: "Accesorios",
      label_en: "Fashion Accessories",
    },
    {
      emoji: "🧃",
      query: "grocery",
      label_es: "Comida y Bebida",
      label_en: "Grocery",
    },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { query: c.query },
      update: {},
      create: c,
    });
  }

  console.log("✅ Tipos, traducciones y categorías insertados correctamente.");
}

scripts()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
