import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { getIO } from "@/lib/socket";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const { storyId, message } = await req.json();
  const fromUserId = session.user.id;

  if (!storyId || !message?.trim()) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  const story = await db.story.findUnique({
    where: { id: storyId },
    select: { userId: true },
  });

  if (!story) return new NextResponse("Story not found", { status: 404 });

  if (story.userId === fromUserId) {
    return new NextResponse("No notification for own story", { status: 200 });
  }

  const type = await db.notificationType.findFirst({
    where: { name: "story_comment" },
    select: { id: true },
  });

  if (!type)
    return new NextResponse("Notification type missing", { status: 500 });

  const notification = await db.notification.create({
    data: {
      typeId: type.id,
      userId: story.userId,
      fromUserId,
      message: `${session.user.name ?? "Alguien"} comentó tu historia.`,
      storyId: storyId,
      metadata: {
        fromUserName: session.user.name,
        fromUserImage: session.user.image,
        storyId,
        message,
      },
    },
  });

  const io = getIO();
  io?.to(`user-${story.userId}`).emit("notification:new", {
    type: "story_comment",
    message: notification.message,
    metadata: notification.metadata,
    createdAt: notification.createdAt,
  });

  return NextResponse.json({ ok: true });
}
