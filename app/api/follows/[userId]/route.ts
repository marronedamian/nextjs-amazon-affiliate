import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const isFollowing = await db.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: params.userId,
      },
    },
  });

  return Response.json({ isFollowing: !!isFollowing });
}
