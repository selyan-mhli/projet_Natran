import { NextRequest, NextResponse } from "next/server";
import { getAll, runQuery, getRow } from "@/lib/db";
import { BatchRecord } from "@/types";

export const runtime = "nodejs";

interface BatchPayload {
  name: string;
  batch_ref: string;
  pci: number;
  humidity: number;
  granulometry: number;
  carbon: number;
  hydrogen: number;
  oxygen: number;
  pollutants: Record<string, number>;
}

export async function GET() {
  try {
    const rows = await getAll<
      Omit<BatchRecord, "pollutants"> & { pollutants: string }
    >("SELECT * FROM csr_batches ORDER BY created_at DESC");

    const formatted = rows.map(row => ({
      ...row,
      pollutants: JSON.parse(row.pollutants || "{}")
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Batches API error:", error);
    return NextResponse.json(
      { error: "Impossible de charger les fiches CSR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as BatchPayload;

    await runQuery(
      "INSERT INTO csr_batches (name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen, pollutants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        payload.name,
        payload.batch_ref,
        payload.pci,
        payload.humidity,
        payload.granulometry,
        payload.carbon,
        payload.hydrogen,
        payload.oxygen,
        JSON.stringify(payload.pollutants || {})
      ]
    );

    const created = await getRow<
      Omit<BatchRecord, "pollutants"> & { pollutants: string }
    >("SELECT * FROM csr_batches ORDER BY created_at DESC LIMIT 1");

    if (!created) {
      return NextResponse.json(
        { error: "Fiche non créée" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...created,
      pollutants: JSON.parse(created.pollutants || "{}")
    });
  } catch (error) {
    console.error("Batch creation error:", error);
    return NextResponse.json(
      { error: "Impossible de créer la fiche CSR" },
      { status: 500 }
    );
  }
}
