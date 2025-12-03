import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/db";

export const runtime = "nodejs";

const VALID_TYPES = new Set(["reactor", "flow", "syngas", "csr_quality"]);

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Number(limitParam) || 20;

  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  try {
    const rows = await getAll(
      `SELECT * FROM ${type} ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );

    return NextResponse.json(rows.reverse());
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Impossible de charger l'historique" },
      { status: 500 }
    );
  }
}
