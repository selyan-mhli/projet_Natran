import { NextRequest, NextResponse } from "next/server";
import { getAll, getRow, runQuery } from "@/lib/db";
import { TaskRecord } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tasks = await getAll<TaskRecord>(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Tasks fetch error:", error);
    return NextResponse.json(
      { error: "Impossible de charger les tâches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, status, priority, due_date } = await req.json();

    await runQuery(
      "INSERT INTO tasks (title, status, priority, due_date) VALUES (?, ?, ?, ?)",
      [title, status || "todo", priority || "medium", due_date]
    );

    const created = await getRow<TaskRecord>(
      "SELECT * FROM tasks ORDER BY created_at DESC LIMIT 1"
    );

    if (!created) {
      return NextResponse.json(
        { error: "Tâche non créée" },
        { status: 500 }
      );
    }

    return NextResponse.json(created);
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json(
      { error: "Impossible de créer la tâche" },
      { status: 500 }
    );
  }
}
