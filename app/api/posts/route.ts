import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";
import { z } from "zod";

const postSchema = z.object({
  content: z.string().min(1),
  imageUrls: z.array(z.string().url()).optional().default([]),
  gifUrls: z.array(z.string().url()).optional().default([]),
  mentionIds: z.array(z.string()).optional().default([]),
  repostId: z.string().optional(),
  categoryId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid data", { status: 400 });
  }

  const {
    content,
    imageUrls,
    gifUrls,
    mentionIds,
    repostId,
    categoryId,
  } = parsed.data;

  const post = await db.post.create({
    data: {
      userId: session.user.id,
      content,
      isRepost: !!repostId,
      repostId,
      // si viene null, lo convertimos en undefined (no setea la FK)
      categoryId: categoryId ?? undefined,
      images: {
        create: imageUrls.map((url) => ({ url })),
      },
      gifs: {
        create: gifUrls.map((url) => ({ url })),
      },
      mentions: {
        connect: mentionIds.map((id) => ({ id })),
      },
    },
    include: {
      images: true,
      gifs: true,
      mentions: true,
      category: true,
    },
  });

  // Emitir evento por socket
  const io = getIO();
  io?.emit("post:new", {
    id: post.id,
    type: repostId ? "repost" : "original",
    createdAt: post.createdAt,
    content: post.content,
    user: {
      id: session.user.id,
      name: session.user.name,
      username: session.user.username,
      image: session.user.image,
    },
  });

  // Notificar menciones
  if (mentionIds.length > 0) {
    const type = await db.notificationType.findFirst({
      where: { name: "mention" },
      select: { id: true },
    });

    if (type) {
      const notifications = await Promise.all(
        mentionIds
          .filter((userId) => userId !== session.user.id)
          .map((userId) =>
            db.notification.create({
              data: {
                typeId: type.id,
                userId,
                fromUserId: session.user.id!,
                postId: post.id,
                message: `${session.user.name ?? "Alguien"} te mencionó en una publicación.`,
                metadata: {
                  fromUserName: session.user.name,
                  fromUserImage: session.user.image,
                },
              },
            })
          )
      );

      notifications.forEach((notif) => {
        if (notif.userId !== session.user.id) {
          io?.to(`user-${notif.userId}`).emit("notification:new", {
            type: "mention",
            message: notif.message,
            metadata: {
              postId: post.id,
              fromUserName: session.user.name,
              fromUserImage: session.user.image,
            },
            createdAt: notif.createdAt,
          });
        }
      });
    }
  }

  return Response.json(post);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  const searchParams = req.nextUrl.searchParams;
  const categoryQuery = searchParams.get("category") || undefined;

  const posts = await db.post.findMany({
    where: categoryQuery
      ? {
          category: {
            query: decodeURIComponent(categoryQuery),
          },
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      category: true,
      images: true,
      gifs: true,
      likes: {
        include: { user: true },
      },
      bookmarks: userId
        ? {
            where: { userId },
          }
        : undefined,
      comments: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          user: true,
          likes: {
            include: { user: true },
          },
        },
      },
      reposts: userId
        ? {
            where: { userId },
            select: { userId: true },
          }
        : undefined,
      repost: {
        include: {
          user: true,
          category: true,
          images: true,
          gifs: true,
          likes: {
            include: { user: true },
          },
          reposts: {
            select: { userId: true },
          },
          _count: {
            select: {
              likes: true,
              reposts: true,
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          reposts: true,
          comments: true,
        },
      },
    },
  });

  return Response.json(posts);
}
