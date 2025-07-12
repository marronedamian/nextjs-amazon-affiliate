import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";

export async function POST(
  _: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const comment = await db.comment.findUnique({
    where: { id: params.commentId },
    include: { user: true, post: true },
  });

  if (!comment) return new Response("Comment not found", { status: 404 });

  const existingLike = await db.commentLike.findFirst({
    where: {
      userId,
      commentId: params.commentId,
    },
  });

  if (existingLike) return new Response("Already liked", { status: 409 });

  await db.commentLike.create({
    data: {
      userId,
      commentId: params.commentId,
    },
  });

  if (comment.user.id !== userId) {
    const type = await db.notificationType.findFirst({
      where: { name: "comment_like" },
      select: { id: true },
    });

    if (type) {
      const notification = await db.notification.create({
        data: {
          typeId: type.id,
          userId: comment.user.id,
          fromUserId: userId,
          postId: comment.postId,
          commentId: comment.id,
          message: `${
            session.user.name ?? "Alguien"
          } le dio like a tu comentario.`,
          metadata: {
            fromUserName: session.user.name,
            fromUserImage: session.user.image,
            message: comment.content,
            postId: comment.postId,
            commentId: comment.id,
          },
        },
      });

      const io = getIO();
      io?.to(`user-${notification.userId}`).emit("notification:new", {
        type: "comment_like",
        message: notification.message,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
      });
    }
  }

  return new Response("Liked", { status: 201 });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const likeNotification = await db.notification.findFirst({
    where: {
      type: { name: "comment_like" },
      fromUserId: userId,
      commentId: params.commentId,
    },
  });

  if (likeNotification) {
    await db.notification.delete({
      where: { id: likeNotification.id },
    });

    const io = getIO();
    io?.to(`user-${likeNotification.userId}`).emit("notification:removed", {
      id: likeNotification.id,
      type: "comment_like",
      commentId: params.commentId,
    });
  }

  await db.commentLike.deleteMany({
    where: {
      commentId: params.commentId,
      userId,
    },
  });

  return new Response("Unliked", { status: 200 });
}
