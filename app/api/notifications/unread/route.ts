import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const count = await db.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return Response.json({ count });
}
