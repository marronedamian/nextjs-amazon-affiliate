import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { getIO } from "@/lib/socket";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { userId, action } = await req.json(); // action: "follow" | "unfollow"

  if (!userId || !["follow", "unfollow"].includes(action)) {
    return new Response("Invalid request", { status: 400 });
  }

  if (action === "follow") {
    await db.follower.upsert({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
      update: {},
      create: {
        followerId: session.user.id,
        followingId: userId,
      },
    });

    const type = await db.notificationType.findFirst({
      where: { name: "follow" },
      select: { id: true },
    });

    if (!type)
      return new Response("Notification type not found", { status: 500 });

    const notification = await db.notification.create({
      data: {
        typeId: type.id,
        message: `${session.user.name ?? "Alguien"} comenzó a seguirte.`,
        userId: userId,
        fromUserId: session.user.id,
        metadata: {
          fromUserName: session.user.name,
          fromUserImage: session.user.image,
        },
      },
    });

    const io = getIO();
    io?.to(`user-${userId}`).emit("notification:new", {
      type: "follow",
      message: notification.message,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
    });
  } else {
    await db.follower.deleteMany({
      where: {
        followerId: session.user.id,
        followingId: userId,
      },
    });
  }

  return new Response("OK");
}
