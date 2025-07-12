import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";
import { z } from "zod";

const replySchema = z.object({
  content: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid data", { status: 400 });

  const { content } = parsed.data;

  const parent = await db.comment.findUnique({
    where: { id: params.commentId },
    include: { user: true, post: true },
  });

  if (!parent) return new Response("Parent comment not found", { status: 404 });

  const reply = await db.comment.create({
    data: {
      userId: session.user.id,
      postId: parent.postId,
      parentId: parent.id,
      content,
    },
    include: {
      user: true,
      likes: true,
      replies: true,
    },
  });

  // Notificación solo si el autor original es otro
  if (parent.user.id !== session.user.id) {
    const type = await db.notificationType.findFirst({
      where: { name: "comment_reply" },
      select: { id: true },
    });

    if (type) {
      const notification = await db.notification.create({
        data: {
          typeId: type.id,
          userId: parent.user.id,
          fromUserId: session.user.id,
          postId: parent.postId,
          commentId: parent.id,
          message: `${
            session.user.name ?? "Alguien"
          } respondió a tu comentario.`,
          metadata: {
            fromUserName: session.user.name,
            fromUserImage: session.user.image,
            postId: parent.postId,
            commentId: parent.id,
            message: content,
          },
        },
      });

      const io = getIO();
      io?.to(`user-${notification.userId}`).emit("notification:new", {
        type: "comment_reply",
        message: notification.message,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
      });
    }
  }

  return Response.json(reply);
}
