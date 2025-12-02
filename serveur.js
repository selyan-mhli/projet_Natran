const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Configuration Express
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Base de données SQLite
const db = new sqlite3.Database("./dashboard.db");

// Création des tables
db.serialize(() => {
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

  db.run(`
    CREATE TABLE IF NOT EXISTS reactor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS flow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      debit REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

  // Insertion de données de test
  db.get("SELECT COUNT(*) as count FROM csr_quality", (err, row) => {
    if (row.count === 0) {
      console.log("📝 Insertion des données de test...");

      db.run("INSERT INTO csr_quality (pci, pcs, humidity, granulometry, cendres, carbone, densite) VALUES (18.5, 20.2, 12.4, 45, 8.2, 48.2, 250)");
      db.run("INSERT INTO reactor (temperature) VALUES (870)");
      db.run("INSERT INTO flow (debit) VALUES (1.2)");
      db.run("INSERT INTO syngas (H2, CO, CH4, CO2, tars) VALUES (41, 32, 6, 18, 2.1)");

      const stmt = db.prepare("INSERT INTO csr_batches (name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen, pollutants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run("CSR Industriel", "Lot #2023-12-19-A", 18.5, 12.4, 45, 48.2, 6.1, 35.5, JSON.stringify({ Cl: 0.4, S: 0.15, Hg: 0.002 }));
      stmt.run("CSR Ménager", "Lot #2023-12-18-B", 17.8, 14.2, 52, 46.5, 5.9, 36.2, JSON.stringify({ Cl: 0.6, S: 0.2, Hg: 0.001 }));
      stmt.run("CSR Bois B", "Lot #2023-12-15-C", 19.2, 10.1, 38, 50.1, 6.4, 33.8, JSON.stringify({ Cl: 0.3, S: 0.1, Hg: 0.003 }));
      stmt.finalize();

      const taskStmt = db.prepare("INSERT INTO tasks (title, status, priority, due_date) VALUES (?, ?, ?, ?)");
      taskStmt.run("Vérifier le filtre à manches", "todo", "high", "2023-12-20");
      taskStmt.run("Maintenance préventive broyeur", "doing", "medium", "2023-12-22");
      taskStmt.run("Commander réactifs labo", "done", "low", "2023-12-18");
      taskStmt.finalize();

      console.log("✔ Données de test insérées");
    }
  });
});

// ============ ROUTES API ============

// Dashboard principal
app.get("/api/dashboard", (req, res) => {
  const queries = {
    csrQuality: "SELECT * FROM csr_quality ORDER BY created_at DESC LIMIT 1",
    reactor: "SELECT * FROM reactor ORDER BY created_at DESC LIMIT 1",
    flow: "SELECT * FROM flow ORDER BY created_at DESC LIMIT 1",
    syngas: "SELECT * FROM syngas ORDER BY created_at DESC LIMIT 1"
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, row) => {
      if (err) {
        console.error(`Erreur ${key}:`, err);
        results[key] = {};
      } else {
        results[key] = row || {};
      }

      completed++;
      if (completed === total) {
        res.json(results);
      }
    });
  });
});

// Historique des données (pour graphiques temporels)
app.get("/api/history/:type", (req, res) => {
  const { type } = req.params;
  const limit = parseInt(req.query.limit) || 20;

  const validTypes = ['reactor', 'flow', 'syngas', 'csr_quality'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Type invalide' });
  }

  db.all(
    `SELECT * FROM ${type} ORDER BY created_at DESC LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows.reverse()); // Ordre chronologique
    }
  );
});

// Statistiques
app.get("/api/stats", (req, res) => {
  const stats = {};

  // Moyenne température sur 24h
  db.get(
    "SELECT AVG(temperature) as avg_temp, MIN(temperature) as min_temp, MAX(temperature) as max_temp FROM reactor WHERE created_at > datetime('now', '-1 day')",
    (err, tempStats) => {
      stats.temperature = tempStats || {};

      // Débit moyen
      db.get(
        "SELECT AVG(debit) as avg_flow FROM flow WHERE created_at > datetime('now', '-1 day')",
        (err, flowStats) => {
          stats.flow = flowStats || {};

          res.json(stats);
        }
      );
    }
  );
});

// Batches
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

// Ajouter un batch
app.post("/api/batches", (req, res) => {
  const { name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen, pollutants } = req.body;

  const stmt = db.prepare(
    "INSERT INTO csr_batches (name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen, pollutants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  stmt.run(
    name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen,
    JSON.stringify(pollutants),
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, ...req.body });
    }
  );

  stmt.finalize();
});

// Tasks CRUD
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

// ============ SIMULATION DE DONNÉES EN TEMPS RÉEL ============
// Simule des variations de température et autres paramètres
function simulateDataUpdates() {
  setInterval(() => {
    // Température réacteur avec variations réalistes
    const baseTemp = 870;
    const variation = (Math.random() - 0.5) * 10;
    const newTemp = baseTemp + variation;

    db.run("INSERT INTO reactor (temperature) VALUES (?)", [newTemp]);

    // Débit avec variations
    const baseFlow = 1.2;
    const flowVariation = (Math.random() - 0.5) * 0.2;
    const newFlow = baseFlow + flowVariation;

    db.run("INSERT INTO flow (debit) VALUES (?)", [newFlow]);

    console.log(`🔄 Données simulées: T=${newTemp.toFixed(1)}°C, Flow=${newFlow.toFixed(2)}t/h`);
  }, 10000); // Toutes les 10 secondes
}

// Activer la simulation
simulateDataUpdates();

// ============ DÉMARRAGE DU SERVEUR ============
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Serveur CSR Dashboard démarré    ║
╠═══════════════════════════════════════╣
║   URL: http://localhost:${PORT}      ║
║   Status: ✅ Opérationnel             ║
║   DB: ✅ SQLite connectée             ║
║   Simulation: ✅ Active               ║
╚═══════════════════════════════════════╝
  `);
});

// Gestion de la fermeture propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  db.close((err) => {
    if (err) console.error(err);
    console.log('✔ Base de données fermée');
    process.exit(0);
  });
});