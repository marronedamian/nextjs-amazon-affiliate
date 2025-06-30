import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const page = Math.max(
    1,
    parseInt(req.nextUrl.searchParams.get("page") || "1", 10)
  );
  const take = 10;
  const skip = (page - 1) * take;

  const [notifications, total, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        fromUser: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    }),
    db.notification.count({ where: { userId: session.user.id } }),
    db.notification.count({
      where: { userId: session.user.id, isRead: false },
    }),
  ]);

  const hasNextPage = skip + take < total;

  return Response.json({
    notifications,
    hasNextPage,
    unreadCount,
  });
}
