import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const post = await db.post.findUnique({
    where: { id: params.postId },
    include: {
      user: true,
      category: true, // <- NUEVO
      images: true,
      gifs: true,
      mentions: true,
      likes: {
        include: { user: true },
      },
      bookmarks: {
        where: { userId },
      },
      comments: {
        include: {
          user: true,
          likes: true,
          replies: {
            include: {
              user: true,
              likes: true,
            },
          },
        },
      },
      reposts: {
        where: { userId },
        select: { userId: true },
      },
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

  if (!post) return new Response("Not found", { status: 404 });

  return Response.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const post = await db.post.findUnique({
    where: { id: params.postId },
    select: { userId: true },
  });

  if (!post) return new Response("Not found", { status: 404 });
  if (post.userId !== session.user.id)
    return new Response("Forbidden", { status: 403 });

  // Borrar relaciones de comentarios y likes en comentarios
  await db.commentLike.deleteMany({
    where: {
      comment: {
        postId: params.postId,
      },
    },
  });

  await db.comment.deleteMany({
    where: {
      postId: params.postId,
    },
  });

  // Borrar relaciones directas al post
  await db.postLike.deleteMany({
    where: {
      postId: params.postId,
    },
  });

  await db.postBookmark.deleteMany({
    where: {
      postId: params.postId,
    },
  });

  await db.postImage.deleteMany({
    where: {
      postId: params.postId,
    },
  });

  await db.postGif.deleteMany({
    where: {
      postId: params.postId,
    },
  });

  await db.notification.deleteMany({
    where: {
      postId: params.postId,
    },
  });

  // Borrar reposts que hacen referencia a este post
  const reposts = await db.post.findMany({
    where: { repostId: params.postId },
    select: { id: true },
  });

  for (const repost of reposts) {
    await db.postLike.deleteMany({ where: { postId: repost.id } });
    await db.postBookmark.deleteMany({ where: { postId: repost.id } });
    await db.notification.deleteMany({ where: { postId: repost.id } });
    await db.post.delete({ where: { id: repost.id } });
  }

  // Finalmente, borrar el post original
  await db.post.delete({
    where: {
      id: params.postId,
    },
  });

  return new Response("Deleted", { status: 200 });
}
