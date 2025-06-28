import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingConversation = await db.conversation.findFirst({
    where: {
      participants: {
        every: {
          OR: [{ userId: currentUser.id }, { userId: targetUserId }],
        },
      },
    },
    include: {
      participants: true,
    },
  });

  if (existingConversation) {
    return NextResponse.json({ conversationId: existingConversation.id });
  }

  const conversation = await db.conversation.create({
    data: {
      participants: {
        create: [{ userId: currentUser.id }, { userId: targetUserId }],
      },
    },
  });

  return NextResponse.json({ conversationId: conversation.id });
}
