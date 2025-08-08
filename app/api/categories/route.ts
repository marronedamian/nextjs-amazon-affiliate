// app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const lang = req.headers.get("x-lang") || "es";

  try {
    const categories = await db.category.findMany({
      orderBy: { label_es: "asc" },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      emoji: c.emoji,
      label: lang === "en" ? c.label_en : c.label_es,
      query: c.query,
    }));

    return NextResponse.json({ categories: formatted }); 
  } catch (error) {
    console.error("[CATEGORIES_GET_ERROR]", error);
    return new NextResponse("Error fetching categories", { status: 500 });
  }
}
