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

    const existingUser = await db.user.findUnique({ where: { email } });
    let isFirstTime = false;

    if (!existingUser) {
      // Generar username único basado en el correo
      const base = email.split("@")[0];
      let username = base;
      let count = 1;

      while (await db.user.findUnique({ where: { username } })) {
        username = `${base}${count++}`;
      }

      await db.user.create({
        data: {
          email,
          name,
          image,
          username,
        },
      });

      isFirstTime = true;
    } else {
      await db.user.update({
        where: { email },
        data: { name, image },
      });
    }

    return NextResponse.json(
      { message: "Tracked successfully", firstTime: isFirstTime },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
