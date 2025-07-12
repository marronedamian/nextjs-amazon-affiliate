import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("query") || "";

  if (!query.trim()) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const users = await db.user.findMany({
      where: {
        OR: [{ name: { contains: query } }, { username: { contains: query } }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      take: 10,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Error searching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
