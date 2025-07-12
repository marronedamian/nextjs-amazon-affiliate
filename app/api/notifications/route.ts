import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const lang = req.headers.get("x-lang") || "es";

  const page = Math.max(
    1,
    parseInt(req.nextUrl.searchParams.get("page") || "1", 10)
  );
  const take = 10;
  const skip = (page - 1) * take;

  const [notifications, total, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        fromUser: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        type: {
          include: {
            translations: {
              where: { language: lang },
              take: 1,
            },
          },
        },
        story: {
          select: {
            id: true,
            images: {
              take: 1,
              orderBy: { id: "asc" },
              select: { url: true },
            },
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            images: {
              take: 1,
              select: { url: true },
            },
            gifs: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    }),
    db.notification.count({ where: { userId: session.user.id } }),
    db.notification.count({
      where: { userId: session.user.id, isRead: false },
    }),
  ]);

  const extractComment = (metadata: unknown): string | null => {
    if (
      typeof metadata === "object" &&
      metadata !== null &&
      "message" in metadata &&
      typeof (metadata as any).message === "string"
    ) {
      return (metadata as any).message;
    }
    return null;
  };

  const formattedNotifications = notifications.map((n) => ({
    id: n.id,
    type: {
      name: n.type.name,
      label: n.type.translations[0]?.label || n.type.name,
    },
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt,
    fromUser: {
      name: n.fromUser.name,
      username: n.fromUser.username,
      image: n.fromUser.image,
    },
    story: n.story
      ? {
          id: n.story.id,
          previewUrl: n.story.images?.[0]?.url ?? null,
        }
      : null,
    post: n.post
      ? {
          id: n.post.id,
          content: n.post.content,
          previewUrl: n.post.images?.[0]?.url || n.post.gifs?.[0]?.url || null,
        }
      : null,
    comment: extractComment(n.metadata),
  }));

  return Response.json({
    notifications: formattedNotifications,
    pagination: {
      page,
      hasNextPage: skip + take < total,
      total,
      unreadCount,
    },
  });
}
