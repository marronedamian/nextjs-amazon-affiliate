import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { conversationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = params.conversationId;

  if (!conversationId) {
    return NextResponse.json(
      { error: "Missing conversationId" },
      { status: 400 }
    );
  }

  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          image: true,
        },
      },
    },
  });

  const formatted = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    createdAt: msg.createdAt,
    senderImage: msg.sender?.image ?? null,
  }));

  return NextResponse.json({ messages: formatted });
}
