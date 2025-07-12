import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { storyId, imageUrl } = await req.json();
  const userId = session.user.id;

  if (!storyId || !imageUrl) {
    return new Response("Missing data", { status: 400 });
  }

  try {
    await db.storyImageView.upsert({
      where: {
        userId_storyId_imageUrl: {
          userId,
          storyId,
          imageUrl,
        },
      },
      update: {},
      create: {
        userId,
        storyId,
        imageUrl,
      },
    });

    return new Response("Image view recorded", { status: 200 });
  } catch (error) {
    console.error("Error saving image view:", error);
    return new Response("Server error", { status: 500 });
  }
}
