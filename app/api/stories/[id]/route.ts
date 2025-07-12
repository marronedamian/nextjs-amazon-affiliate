import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const story = await db.story.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: "asc" } },
      views: { where: { userId: session.user.id } },
      user: true,
    },
  });

  if (!story) {
    return new NextResponse("Not found", { status: 404 });
  }

  const seen: boolean[] = story.images.map((_, i) =>
    story.views.some((view) => view.storyId === story.id)
  );

  return NextResponse.json({
    id: story.id,
    name: story.user.name,
    images: story.images.map((img) => img.url),
    seen,
  });
}
