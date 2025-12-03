import path from "path";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const dbFile = path.join(process.cwd(), "dashboard.db");

const globalForDb = globalThis as typeof globalThis & {
  _natranDb?: sqlite3.Database;
};

if (!globalForDb._natranDb) {
  globalForDb._natranDb = new sqlite3.Database(dbFile);
  initializeDatabase(globalForDb._natranDb);
}

const db = globalForDb._natranDb!;

export default db;

function initializeDatabase(database: sqlite3.Database) {
  database.serialize(() => {
    database.run(`
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

    database.run(`
      CREATE TABLE IF NOT EXISTS reactor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperature REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS flow (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        debit REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    database.run(`
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

    database.run(`
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

    database.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        status TEXT,
        priority TEXT,
        due_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    seedCoreTables(database);
  });
}

function seedCoreTables(database: sqlite3.Database) {
  database.get("SELECT COUNT(*) as count FROM csr_quality", (err, row) => {
    if (err || (row && row.count > 0)) {
      return;
    }

    database.run(
      "INSERT INTO csr_quality (pci, pcs, humidity, granulometry, cendres, carbone, densite) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [18.5, 20.2, 12.4, 45, 8.2, 48.2, 250]
    );
    database.run("INSERT INTO reactor (temperature) VALUES (870)");
    database.run("INSERT INTO flow (debit) VALUES (1.2)");
    database.run(
      "INSERT INTO syngas (H2, CO, CH4, CO2, tars) VALUES (?, ?, ?, ?, ?)",
      [41, 32, 6, 18, 2.1]
    );
  });

  database.get("SELECT COUNT(*) as count FROM csr_batches", (err, row) => {
    if (err || (row && row.count > 0)) {
      return;
    }

    const batches = [
      {
        name: "CSR Industriel",
        batch_ref: "Lot #2023-12-19-A",
        pci: 18.5,
        humidity: 12.4,
        granulometry: 45,
        carbon: 48.2,
        hydrogen: 6.1,
        oxygen: 35.5,
        pollutants: { Cl: 0.4, S: 0.15, Hg: 0.002 }
      },
      {
        name: "CSR Ménager",
        batch_ref: "Lot #2023-12-18-B",
        pci: 17.8,
        humidity: 14.2,
        granulometry: 52,
        carbon: 46.5,
        hydrogen: 5.9,
        oxygen: 36.2,
        pollutants: { Cl: 0.6, S: 0.2, Hg: 0.001 }
      },
      {
        name: "CSR Bois B",
        batch_ref: "Lot #2023-12-15-C",
        pci: 19.2,
        humidity: 10.1,
        granulometry: 38,
        carbon: 50.1,
        hydrogen: 6.4,
        oxygen: 33.8,
        pollutants: { Cl: 0.3, S: 0.1, Hg: 0.003 }
      }
    ];

    const stmt = database.prepare(
      "INSERT INTO csr_batches (name, batch_ref, pci, humidity, granulometry, carbon, hydrogen, oxygen, pollutants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    batches.forEach(batch => {
      stmt.run(
        batch.name,
        batch.batch_ref,
        batch.pci,
        batch.humidity,
        batch.granulometry,
        batch.carbon,
        batch.hydrogen,
        batch.oxygen,
        JSON.stringify(batch.pollutants)
      );
    });

    stmt.finalize();
  });

  database.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
    if (err || (row && row.count > 0)) {
      return;
    }

    const tasks = [
      ["Vérifier le filtre à manches", "todo", "high", "2023-12-20"],
      ["Maintenance préventive broyeur", "doing", "medium", "2023-12-22"],
      ["Commander réactifs labo", "done", "low", "2023-12-18"]
    ];

    const stmt = database.prepare(
      "INSERT INTO tasks (title, status, priority, due_date) VALUES (?, ?, ?, ?)"
    );

    tasks.forEach(task => {
      stmt.run(task[0], task[1], task[2], task[3]);
    });

    stmt.finalize();
  });
}

export function getRow<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T | undefined);
      }
    });
  });
}

export function getAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve((rows as T[]) || []);
      }
    });
  });
}

export function runQuery(sql: string, params: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
