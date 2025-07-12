import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIO } from "@/lib/socket";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { images, description, isGlobal } = await req.json();

    if (
      !Array.isArray(images) ||
      images.length === 0 ||
      typeof description !== "string"
    ) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const story = await db.story.create({
      data: {
        userId: session.user.id,
        description,
        isGlobal: Boolean(isGlobal),
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      },
    });

    // Emitimos el evento "new-story"
    const io = getIO();
    if (io) {
      io.emit("new-story", {
        storyId: story.id,
        authorId: session.user.id,
      });
      console.log("📢 Emitiendo nueva historia desde POST:", story.id);
    } else {
      console.warn("⚠️ Socket.IO no está inicializado");
    }

    return NextResponse.json({ success: true, storyId: story.id });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
