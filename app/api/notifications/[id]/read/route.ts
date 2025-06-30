import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await db.notification.updateMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      isRead: true,
    },
  });

  return Response.json({ success: true });
}
