import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = user.id;

  const userConversations = await db.userOnConversation.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          participants: {
            where: { NOT: { userId } },
            include: { user: true },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  const conversations = userConversations.map(({ conversation }) => ({
    conversationId: conversation.id,
    participant: conversation.participants[0]?.user ?? null,
    lastMessage: conversation.messages[0] ?? null,
  }));

  return NextResponse.json(conversations);
}
