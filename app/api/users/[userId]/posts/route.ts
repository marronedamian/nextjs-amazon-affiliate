import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const page = Math.max(
    1,
    parseInt(req.nextUrl.searchParams.get("page") || "1", 10)
  );
  const take = 10;
  const skip = (page - 1) * take;

  const posts = await db.post.findMany({
    where: { userId: params.userId },
    include: {
      images: true,
      gifs: true,
      mentions: true,
      likes: true,
      bookmarks: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return Response.json(posts);
}
