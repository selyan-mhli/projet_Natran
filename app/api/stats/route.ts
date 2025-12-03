import { NextResponse } from "next/server";
import { getRow } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const temperature = await getRow<{
      avg_temp: number;
      min_temp: number;
      max_temp: number;
    }>(
      "SELECT AVG(temperature) as avg_temp, MIN(temperature) as min_temp, MAX(temperature) as max_temp FROM reactor WHERE created_at > datetime('now', '-1 day')"
    );

    const flow = await getRow<{ avg_flow: number }>(
      "SELECT AVG(debit) as avg_flow FROM flow WHERE created_at > datetime('now', '-1 day')"
    );

    return NextResponse.json({
      temperature: temperature || {},
      flow: flow || {}
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Impossible de charger les statistiques" },
      { status: 500 }
    );
  }
}
