import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { conversationId } = await req.json();

  await db.message.updateMany({
    where: {
      conversationId,
      read: false,
      NOT: {
        senderId: session.user.id,
      },
    },
    data: {
      read: true,
    },
  });

  return NextResponse.json({ status: 200 });
}
