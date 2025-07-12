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
}

scripts()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
