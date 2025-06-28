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

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        include: { user: true },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUser.id
  );

  if (!otherParticipant) {
    return NextResponse.json(
      { error: "Other user not found" },
      { status: 404 }
    );
  }

  const { id, name, image, email } = otherParticipant.user;

  return NextResponse.json({ id, name, image, email });
}
