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

  const original = await db.post.findUnique({
    where: { id: params.postId },
    include: { user: true },
  });

  if (!original)
    return new Response("Original post not found", { status: 404 });

  if (original.user.id === userId)
    return new Response("Cannot repost your own post", { status: 400 });

  const existingRepost = await db.post.findFirst({
    where: {
      userId,
      repostId: params.postId,
    },
  });

  if (existingRepost) return new Response("Already reposted", { status: 409 });

  const repost = await db.post.create({
    data: {
      userId,
      content: "",
      isRepost: true,
      repostId: params.postId,
    },
  });

  const type = await db.notificationType.findFirst({
    where: { name: "repost" },
    select: { id: true },
  });

  if (type && original.user.id !== userId) {
    const notification = await db.notification.create({
      data: {
        typeId: type.id,
        userId: original.user.id,
        fromUserId: userId,
        postId: original.id,
        message: `${session.user.name ?? "Alguien"} compartió tu publicación.`,
        metadata: {
          fromUserName: session.user.name,
          fromUserImage: session.user.image,
        },
      },
    });

    const io = getIO();
    io?.to(`user-${notification.userId}`).emit("notification:new", {
      type: "repost",
      message: notification.message,
      metadata: {
        postId: original.id,
        fromUserName: session.user.name,
        fromUserImage: session.user.image,
      },
      createdAt: notification.createdAt,
    });
  }

  return Response.json(repost);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const repost = await db.post.findFirst({
    where: {
      userId,
      repostId: params.postId,
    },
  });

  if (!repost) return new Response("Repost not found", { status: 404 });

  // Buscar notificación asociada
  const repostNotification = await db.notification.findFirst({
    where: {
      type: { name: "repost" },
      fromUserId: userId,
      postId: params.postId,
    },
  });

  if (repostNotification) {
    await db.notification.delete({
      where: { id: repostNotification.id },
    });

    const io = getIO();
    io?.to(`user-${repostNotification.userId}`).emit("notification:removed", {
      id: repostNotification.id,
      type: "repost",
      postId: params.postId,
    });
  }

  await db.post.delete({
    where: { id: repost.id },
  });

  return new Response("Repost removed", { status: 200 });
}
