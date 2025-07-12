import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid data", { status: 400 });

  const { content } = parsed.data;

  const post = await db.post.findUnique({
    where: { id: params.postId },
    include: { user: true },
  });

  if (!post) return new Response("Post not found", { status: 404 });

  const comment = await db.comment.create({
    data: {
      userId: session.user.id,
      postId: params.postId,
      content,
    },
    include: {
      user: true,
      likes: {
        include: {
          user: true,
        },
      },
      replies: {
        include: {
          user: true,
          likes: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  // Enviar notificación si el autor del comentario no es el autor del post
  if (post.user.id !== session.user.id) {
    const type = await db.notificationType.findFirst({
      where: { name: "post_comment" },
      select: { id: true },
    });

    if (type) {
      const notification = await db.notification.create({
        data: {
          typeId: type.id,
          userId: post.user.id,
          fromUserId: session.user.id,
          postId: post.id,
          commentId: comment.id,
          message: `${session.user.name ?? "Alguien"} comentó tu publicación.`,
          metadata: {
            fromUserName: session.user.name,
            fromUserImage: session.user.image,
            postId: post.id,
            commentId: comment.id,
            message: content,
          },
        },
      });

      const io = getIO();
      io?.to(`user-${notification.userId}`).emit("notification:new", {
        type: "post_comment",
        message: notification.message,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
      });
    }
  }

  return Response.json(comment);
}

export async function GET(
  _: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const comments = await db.comment.findMany({
    where: {
      postId: params.postId,
      parentId: null,
    },
    include: {
      user: true,
      likes: {
        include: {
          user: true,
        },
      },
      replies: {
        include: {
          user: true,
          likes: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(comments);
}
