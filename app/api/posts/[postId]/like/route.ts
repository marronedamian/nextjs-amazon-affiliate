import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";

export async function POST(
  _: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const post = await db.post.findUnique({
    where: { id: params.postId },
    include: { user: true },
  });

  if (!post) return new Response("Post not found", { status: 404 });

  const existingLike = await db.postLike.findFirst({
    where: {
      userId,
      postId: params.postId,
    },
  });

  if (existingLike) return new Response("Already liked", { status: 409 });

  await db.postLike.create({
    data: {
      userId,
      postId: params.postId,
    },
  });

  // Si el autor del post es otro, enviar notificación
  if (post.user.id !== userId) {
    const type = await db.notificationType.findFirst({
      where: { name: "like" },
      select: { id: true },
    });

    if (type) {
      const notification = await db.notification.create({
        data: {
          typeId: type.id,
          userId: post.user.id,
          fromUserId: userId,
          postId: post.id,
          message: `${
            session.user.name ?? "Alguien"
          } le dio like a tu publicación.`,
          metadata: {
            fromUserName: session.user.name,
            fromUserImage: session.user.image,
          },
        },
      });

      const io = getIO();
      io?.to(`user-${notification.userId}`).emit("notification:new", {
        type: "like",
        message: notification.message,
        metadata: {
          postId: post.id,
          fromUserName: session.user.name,
          fromUserImage: session.user.image,
        },
        createdAt: notification.createdAt,
      });
    }
  }

  return new Response("Liked", { status: 201 });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const likeNotification = await db.notification.findFirst({
    where: {
      type: { name: "like" },
      fromUserId: userId,
      postId: params.postId,
    },
  });

  if (likeNotification) {
    await db.notification.delete({
      where: { id: likeNotification.id },
    });

    const io = getIO();
    io?.to(`user-${likeNotification.userId}`).emit("notification:removed", {
      id: likeNotification.id,
      type: "like",
      postId: params.postId,
    });
  }

  await db.postLike.deleteMany({
    where: {
      postId: params.postId,
      userId,
    },
  });

  return new Response("Unliked", { status: 200 });
}
