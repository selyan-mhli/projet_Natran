import { NextResponse } from "next/server";
import "@/lib/simulator";
import { getRow } from "@/lib/db";
import { DashboardResponse } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [csrQuality, reactor, flow, syngas] = await Promise.all([
      getRow("SELECT * FROM csr_quality ORDER BY created_at DESC LIMIT 1"),
      getRow("SELECT * FROM reactor ORDER BY created_at DESC LIMIT 1"),
      getRow("SELECT * FROM flow ORDER BY created_at DESC LIMIT 1"),
      getRow("SELECT * FROM syngas ORDER BY created_at DESC LIMIT 1")
    ]);

    const payload: DashboardResponse = {
      csrQuality: csrQuality || null,
      reactor: reactor || null,
      flow: flow || null,
      syngas: syngas || null
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Impossible de charger les données du dashboard" },
      { status: 500 }
    );
  }
}
