import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  try {
    await db.postBookmark.create({
      data: {
        userId: session.user.id,
        postId: params.postId,
      },
    });
    return new Response("Bookmarked", { status: 201 });
  } catch {
    return new Response("Already bookmarked or error", { status: 400 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await db.postBookmark.deleteMany({
    where: {
      postId: params.postId,
      userId: session.user.id,
    },
  });

  return new Response("Unbookmarked", { status: 200 });
}
