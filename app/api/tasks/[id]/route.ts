import { NextRequest, NextResponse } from "next/server";
import { getRow, runQuery } from "@/lib/db";
import { TaskRecord } from "@/types";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const { title, status, priority, due_date } = await req.json();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
    if (priority !== undefined) {
      fields.push("priority = ?");
      values.push(priority);
    }
    if (due_date !== undefined) {
      fields.push("due_date = ?");
      values.push(due_date);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "Aucun champ fourni" }, { status: 400 });
    }

    values.push(id);
    await runQuery(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);

    const updated = await getRow<TaskRecord>("SELECT * FROM tasks WHERE id = ?", [
      id
    ]);

    if (!updated) {
      return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Task update error:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la tâche" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    await runQuery("DELETE FROM tasks WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task deletion error:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la tâche" },
      { status: 500 }
    );
  }
}
