import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  if (!params?.userId) {
    return new Response("Invalid userId", { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const followers = await db.follower.count({
    where: {
      followingId: params.userId,
    },
  });

  const following = await db.follower.count({
    where: {
      followerId: params.userId,
    },
  });

  return Response.json({ followers, following });
}
