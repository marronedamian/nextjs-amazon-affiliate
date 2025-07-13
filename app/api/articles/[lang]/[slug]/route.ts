import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { lang: string; slug: string } }
) {
  const { lang, slug } = params;

  try {
    const post = await db.article.findFirst({
      where: {
        slug,
        language: lang,
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
