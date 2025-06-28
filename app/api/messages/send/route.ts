import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(2000),
  senderId: z.string().min(1),
  receiverId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error("❌ Error parseando JSON:", err);
    return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { conversationId, content, senderId, receiverId } = parsed.data;

  try {
    const message = await db.message.create({
      data: {
        content,
        senderId,
        receiverId,
        conversationId,
      },
    });

    const sender = await db.user.findUnique({
      where: { id: senderId },
      select: { image: true },
    });

    const formatted = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      conversationId: message.conversationId,
      createdAt: message.createdAt,
      senderImage: sender?.image ?? null,
    };

    const io = getIO();
    if (io) {
      console.log(`📤 Emitiendo receive-message a sala: ${conversationId}`);
      io.to(conversationId).emit("receive-message", formatted);

      console.log(`📤 Emitiendo new-message a user-${receiverId}`);
      io.to(`user-${receiverId}`).emit("new-message", formatted);
    }

    return NextResponse.json({ message: formatted });
  } catch (err) {
    console.error("❌ Error guardando mensaje:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
