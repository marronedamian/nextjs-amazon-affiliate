import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await db.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return Response.json({ success: true });
}
