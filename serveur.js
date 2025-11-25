const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// ------------------ CONFIG EXPRESS ------------------
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// ------------------ BASE SQLITE ------------------
const db = new sqlite3.Database("./dashboard.db");

// Création propre des tables
db.serialize(() => {

  // TABLE csr_quality
  db.run(`
    CREATE TABLE IF NOT EXISTS csr_quality (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pci REAL,
      pcs REAL,
      humidity REAL,
      granulometry REAL,
      cendres REAL,
      carbone REAL,
      densite REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // TABLE reactor
  db.run(`
    CREATE TABLE IF NOT EXISTS reactor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // TABLE flow
  db.run(`
    CREATE TABLE IF NOT EXISTS flow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      debit REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // TABLE syngas
  db.run(`
    CREATE TABLE IF NOT EXISTS syngas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      H2 REAL,
      CO REAL,
      CH4 REAL,
      CO2 REAL,
      tars REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // TABLE csr_batches
  db.run(`
    CREATE TABLE IF NOT EXISTS csr_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      batch_ref TEXT,
      pci REAL,
      humidity REAL,
      granulometry REAL,
      carbon REAL,
      hydrogen REAL,
      oxygen REAL,
      pollutants TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // TABLE tasks
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      status TEXT,
      priority TEXT,
      due_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ------------------ INSERTIONS INITIALES ------------------
  db.get("SELECT COUNT(*) as count FROM csr_quality", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO csr_quality (pci, humidity, granulometry, cendres, carbone, densite) VALUES (18.5, 12.4, 45, 8.2, 48.2, 250)");
      db.run("INSERT INTO reactor (temperature) VALUES (854)");
      db.run("INSERT INTO flow (debit) VALUES (1.2)");
      db.run("INSERT INTO syngas (H2, CO, CH4, CO2, tars) VALUES (12.5, 18.2, 4.1, 10.5, 2.1)");
      console.log("✔ Données de test insérées (csr, reactor, flow, syngas)");
    }
  });

  db.get("SELECT COUNT(*) as count FROM csr_batches", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO csr_batches (name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen, pollutants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run("CSR Industriel", "Lot #2023-12-19-A", 18.5, 12.4, 45, 48.2, 6.1, 35.5, JSON.stringify({ Cl: 0.4, S: 0.15, Hg: 0.002 }));
      stmt.run("CSR Ménager", "Lot #2023-12-18-B", 17.8, 14.2, 52, 46.5, 5.9, 36.2, JSON.stringify({ Cl: 0.6, S: 0.2, Hg: 0.001 }));
      stmt.run("CSR Bois B", "Lot #2023-12-15-C", 19.2, 10.1, 38, 50.1, 6.4, 33.8, JSON.stringify({ Cl: 0.3, S: 0.1, Hg: 0.003 }));
      stmt.finalize();
      console.log("✔ Données de test insérées dans csr_batches");
    }
  });

  db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO tasks (title, status, priority, due_date) VALUES (?, ?, ?, ?)");
      stmt.run("Vérifier le filtre à manches", "todo", "high", "2023-12-20");
      stmt.run("Maintenance préventive broyeur", "doing", "medium", "2023-12-22");
      stmt.run("Commander réactifs labo", "done", "low", "2023-12-18");
      stmt.finalize();
      console.log("✔ Données de test insérées dans tasks");
    }
  });

});

// ------------------ ROUTES API ------------------

// GET ALL TASKS
app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, status, priority, due_date } = req.body;
  const stmt = db.prepare("INSERT INTO tasks (title, status, priority, due_date) VALUES (?, ?, ?, ?)");
  stmt.run(title, status || 'todo', priority || 'medium', due_date, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...req.body });
  });
  stmt.finalize();
});

app.put("/api/tasks/:id", (req, res) => {
  const { title, status, priority, due_date } = req.body;
  const { id } = req.params;

  // Construit la requête dynamiquement selon les champs présents
  let fields = [];
  let values = [];

  if (title) { fields.push("title = ?"); values.push(title); }
  if (status) { fields.push("status = ?"); values.push(status); }
  if (priority) { fields.push("priority = ?"); values.push(priority); }
  if (due_date) { fields.push("due_date = ?"); values.push(due_date); }

  values.push(id);

  const sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task updated", changes: this.changes });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task deleted", changes: this.changes });
  });
});

// BATCHES
app.get("/api/batches", (req, res) => {
  db.all("SELECT * FROM csr_batches ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map(r => ({
      ...r,
      pollutants: JSON.parse(r.pollutants || "{}")
    }));

    res.json(formatted);
  });
});

// DASHBOARD MAIN
app.get("/api/dashboard", (req, res) => {
  db.get("SELECT * FROM csr_quality ORDER BY created_at DESC LIMIT 1", (err, csr) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get("SELECT * FROM reactor ORDER BY created_at DESC LIMIT 1", (err2, reactor) => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.get("SELECT * FROM flow ORDER BY created_at DESC LIMIT 1", (err3, flow) => {
        if (err3) return res.status(500).json({ error: err3.message });

        db.get("SELECT * FROM syngas ORDER BY created_at DESC LIMIT 1", (err4, syngas) => {
          if (err4) return res.status(500).json({ error: err4.message });

          res.json({
            csrQuality: csr || {},
            reactor: reactor || {},
            flow: flow || {},
            syngas: syngas || {}
          });
        });
      });
    });
  });
});

// ------------------ DEMARRAGE SERVEUR ------------------
app.listen(PORT, () => {
  console.log(`🚀 Serveur opérationnel sur http://localhost:${PORT}`);
});
