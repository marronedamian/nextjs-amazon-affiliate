import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { categories, priceRangeMin, priceRangeMax } = await req.json();

  const user = await db.users.findUnique({
    where: { email: session.user.email! },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Eliminar categorías previas (si existieran)
  await db.categoryPreference.deleteMany({
    where: {
      preferences: {
        userId: user.id,
      },
    },
  });

  // Upsert de preferencias
  const preferences = await db.preferences.upsert({
    where: { userId: user.id },
    update: {
      priceRangeMin,
      priceRangeMax,
    },
    create: {
      userId: user.id,
      priceRangeMin,
      priceRangeMax,
    },
  });

  // Insertar nuevas categorías
  await db.categoryPreference.createMany({
    data: categories.map((name: string) => ({
      name,
      preferencesId: preferences.id,
    })),
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.users.findUnique({
    where: { email: session.user.email! },
    include: {
      preferences: {
        include: {
          categories: true,
        },
      },
    },
  });

  if (!user?.preferences) {
    return NextResponse.json({ preferences: null }, { status: 200 });
  }

  const { priceRangeMin, priceRangeMax, categories } = user.preferences;
  return NextResponse.json({
    priceRangeMin,
    priceRangeMax,
    categories: categories.map((c) => c.name),
  });
}
