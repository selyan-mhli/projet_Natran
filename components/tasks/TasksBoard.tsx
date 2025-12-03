'use client';

import { useEffect, useMemo, useState } from "react";
import { TaskPriority, TaskRecord, TaskStatus } from "@/types";

interface FormState {
  id?: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
}

const defaultForm = (): FormState => ({
  title: "",
  priority: "medium",
  status: "todo",
  due_date: new Date().toISOString().split("T")[0]
});

export default function TasksBoard() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [error, setError] = useState<string | null>(null);

  const columns: Array<{ key: TaskStatus; label: string; color: string }> = [
    { key: "todo", label: "À faire", color: "#e74c3c" },
    { key: "doing", label: "En cours", color: "#f1c40f" },
    { key: "done", label: "Terminé", color: "#2ecc71" }
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?t=${Date.now()}`);
      if (!res.ok) throw new Error("Erreur API");
      const payload = (await res.json()) as TaskRecord[];
      setTasks(payload);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les tâches.");
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    return columns.reduce<Record<TaskStatus, TaskRecord[]>>((acc, column) => {
      acc[column.key] = tasks.filter(task => task.status === column.key);
      return acc;
    }, { todo: [], doing: [], done: [] });
  }, [tasks]);

  const openModal = (task?: TaskRecord) => {
    if (task) {
      setForm({
        id: task.id,
        title: task.title,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date
          ? task.due_date.split("T")[0]
          : new Date().toISOString().split("T")[0]
      });
    } else {
      setForm(defaultForm());
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(defaultForm());
  };

  const handleDelete = async (task: TaskRecord) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    try {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer la tâche.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      priority: form.priority,
      status: form.status,
      due_date: form.due_date
    };

    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `/api/tasks/${form.id}` : "/api/tasks";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      closeModal();
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer la tâche.");
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}

      {error && <div className="error-toast">{error}</div>}

      <header className="topbar">
        <div className="top-left">
          <h2>Mes Tâches</h2>
        </div>
        <div className="top-right">
          <div className="user">
            <img
              src="https://upload.wikimedia.org/wikipedia/fr/thumb/3/36/Logo_NaTran.svg/langfr-560px-Logo_NaTran.svg.png"
              alt="Logo Natran"
              className="user-avatar"
            />
            <div>
              <div className="user-name">Selyan MOUHALI</div>
              <div className="user-role">Opérateur unité pilote</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ marginBottom: 20, textAlign: "right" }}>
        <button className="primary-btn small" type="button" onClick={() => openModal()}>
          + Nouvelle Tâche
        </button>
      </div>

      <div className="tasks-container">
        {columns.map(column => (
          <div className="task-column" id={`col-${column.key}`} key={column.key}>
            <div className="column-header">
              <div className="column-title">
                <span style={{ color: column.color }}>●</span> {column.label}
              </div>
              <span className="count-badge">{grouped[column.key].length}</span>
            </div>

            {grouped[column.key].map(task => (
              <div className={`task-card ${task.priority}`} key={task.id}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {task.title}
                </div>
                <div className="task-meta">
                  <span>
                    📅{" "}
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("fr-FR")
                      : "Non défini"}
                  </span>
                  <span className="priority-tag">{task.priority}</span>
                </div>
                <div className="task-actions">
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() => openModal(task)}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() => handleDelete(task)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{form.id ? "Modifier la tâche" : "Nouvelle tâche"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.title}
                  required
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Priorité</label>
                <select
                  className="form-input"
                  value={form.priority}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      priority: e.target.value as TaskPriority
                    }))
                  }
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      status: e.target.value as TaskStatus
                    }))
                  }
                >
                  <option value="todo">À faire</option>
                  <option value="doing">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date d&apos;échéance</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.due_date}
                  onChange={e =>
                    setForm(prev => ({ ...prev, due_date: e.target.value }))
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button className="primary-btn small" type="submit">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
