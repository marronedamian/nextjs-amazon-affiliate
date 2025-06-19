import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, image } = await req.json();
    const email = session.user.email;

    const existingUser = await db.users.findUnique({ where: { email } });
    const isFirstTime = !existingUser;

    await db.users.upsert({
      where: { email },
      update: { name, image },
      create: { email, name, image },
    });

    return NextResponse.json(
      { message: "Tracked successfully", firstTime: isFirstTime },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
