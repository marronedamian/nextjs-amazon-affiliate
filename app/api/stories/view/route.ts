import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { storyId } = await req.json();
  const userId = session.user.id;

  try {
    const story = await db.story.findUnique({
      where: { id: storyId },
      select: { id: true },
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    const storyImages = await db.storyImage.findMany({
      where: { storyId },
      select: { url: true },
    });

    if (storyImages.length === 0) {
      return new NextResponse("No images in story", { status: 400 });
    }

    const viewedImages = await db.storyImageView.findMany({
      where: {
        storyId,
        userId,
      },
      select: { imageUrl: true },
    });

    const viewedSet = new Set(viewedImages.map((v) => v.imageUrl));
    const allViewed = storyImages.every((img) => viewedSet.has(img.url));

    if (!allViewed) {
      return new NextResponse("Not all images viewed", { status: 200 });
    }

    await db.storyView.upsert({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
      update: {},
      create: {
        userId,
        storyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving story view:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
