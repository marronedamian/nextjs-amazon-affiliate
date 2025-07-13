import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // ✅ Si NO hay sesión, solo historias globales sin datos de vistos
  if (!session?.user?.id) {
    const stories = await db.story.findMany({
      where: {
        isGlobal: true,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        images: {
          orderBy: { order: "asc" },
          select: { url: true },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const userStoriesMap = new Map<
      string,
      {
        id: string;
        name: string;
        username: string;
        avatarUrl: string;
        stories: {
          storyId: string;
          images: string[];
          seen: boolean[]; // todos en false
          fullySeen: boolean; // siempre false
          description: string;
          createdAt: Date;
        }[];
      }
    >();

    for (const story of stories) {
      const userKey = story.user.id;
      const images = story.images.map((img) => img.url);
      const seen = images.map(() => false);

      const storyItem = {
        storyId: story.id,
        images,
        seen,
        description: story.description,
        createdAt: story.createdAt,
        fullySeen: false,
      };

      if (!userStoriesMap.has(userKey)) {
        userStoriesMap.set(userKey, {
          id: userKey,
          name: story.user.name || "",
          username: story.user.username || "",
          avatarUrl: story.user.image || "",
          stories: [storyItem],
        });
      } else {
        userStoriesMap.get(userKey)!.stories.push(storyItem);
      }
    }

    const groupedStories = Array.from(userStoriesMap.values());
    return NextResponse.json(groupedStories);
  }

  // ✅ Si hay sesión, sigue lógica original (historias propias, de seguidos y globales)
  const userId = session.user.id;

  const following = await db.follower.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  const stories = await db.story.findMany({
    where: {
      createdAt: {
        gte: twentyFourHoursAgo,
      },
      OR: [{ isGlobal: true }, { userId: { in: followingIds } }, { userId }],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      images: {
        orderBy: { order: "asc" },
        select: { url: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const imageViews = await db.storyImageView.findMany({
    where: { userId },
    select: { storyId: true, imageUrl: true },
  });

  const imageViewSet = new Set(
    imageViews.map((v) => `${v.storyId}:${v.imageUrl}`)
  );

  const storyViews = await db.storyView.findMany({
    where: { userId },
    select: { storyId: true },
  });

  const storyViewSet = new Set(storyViews.map((v) => v.storyId));

  const userStoriesMap = new Map<
    string,
    {
      id: string;
      name: string;
      username: string;
      avatarUrl: string;
      stories: {
        storyId: string;
        images: string[];
        seen: boolean[];
        fullySeen: boolean;
        description: string;
        createdAt: Date;
      }[];
    }
  >();

  for (const story of stories) {
    const userKey = story.user.id;

    const images = story.images.map((img) => img.url);
    const seen = images.map((imgUrl) =>
      imageViewSet.has(`${story.id}:${imgUrl}`)
    );

    const storyItem = {
      storyId: story.id,
      images,
      seen,
      description: story.description,
      createdAt: story.createdAt,
      fullySeen: storyViewSet.has(story.id),
    };

    if (!userStoriesMap.has(userKey)) {
      userStoriesMap.set(userKey, {
        id: userKey,
        name: story.user.name || "",
        username: story.user.username || "",
        avatarUrl: story.user.image || "",
        stories: [storyItem],
      });
    } else {
      userStoriesMap.get(userKey)!.stories.push(storyItem);
    }
  }

  const groupedStories = Array.from(userStoriesMap.values());

  groupedStories.sort((a, b) => {
    const aHasUnseen = a.stories.some((s) => s.seen.includes(false));
    const bHasUnseen = b.stories.some((s) => s.seen.includes(false));
    return Number(aHasUnseen) === Number(bHasUnseen) ? 0 : aHasUnseen ? -1 : 1;
  });

  return NextResponse.json(groupedStories);
}
