import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ messages: [], count: 0 }, { status: 200 });
  }

  const grouped = await db.message.groupBy({
    by: ["conversationId"],
    where: {
      read: false,
      receiverId: session.user.id,
    },
    _count: {
      conversationId: true,
    },
  });

  const messages = grouped.map((item) => ({
    conversationId: item.conversationId,
    count: item._count.conversationId,
  }));

  const total = messages.reduce((sum, item) => sum + item.count, 0);

  return NextResponse.json({ messages, count: total }, { status: 200 });
}
