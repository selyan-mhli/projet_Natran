const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./dashboard.db");

// Données de test réalistes pour un dashboard CSR
const testData = {
  csrQuality: {
    pci: 16.2,        // MJ/kg - Pouvoir Calorifique Inférieur
    pcs: 18.5,        // MJ/kg - Pouvoir Calorifique Supérieur
    humidity: 12.5,   // % - Humidité
    granulometry: 20, // mm - Granulométrie
    cendres: 8.2,     // % - Cendres
    carbone: 45.3,    // % - Carbone
    densite: 320      // kg/m³ - Densité apparente
  },
  reactor: {
    temperature: 870  // °C - Température du réacteur
  },
  flow: {
    debit: 1.2  // t/h - Débit instantané
  },
  syngas: {
    H2: 41,    // % - Hydrogène
    CO: 32,    // % - Monoxyde de carbone
    CH4: 6,    // % - Méthane
    CO2: 18,   // % - Dioxyde de carbone
    tars: 2.1  // g/Nm³ - Tars
  }
};

db.serialize(() => {
  console.log("Création des tables si nécessaire...");

  // Création des tables si elles n'existent pas
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

  console.log("Insertion des données de test...");

  // Insertion qualité CSR
  db.run(
    `INSERT INTO csr_quality (pci, pcs, humidity, granulometry, cendres, carbone, densite) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [testData.csrQuality.pci, testData.csrQuality.pcs, testData.csrQuality.humidity, testData.csrQuality.granulometry, testData.csrQuality.cendres, testData.csrQuality.carbone, testData.csrQuality.densite],
    function(err) {
      if (err) {
        console.error("Erreur insertion csr_quality:", err.message);
      } else {
        console.log(`✓ Qualité CSR insérée (ID: ${this.lastID})`);
      }
    }
  );

  // Insertion température réacteur
  db.run(
    `INSERT INTO reactor (temperature) VALUES (?)`,
    [testData.reactor.temperature],
    function(err) {
      if (err) {
        console.error("Erreur insertion reactor:", err.message);
      } else {
        console.log(`✓ Température réacteur insérée (ID: ${this.lastID})`);
      }
    }
  );

  // Insertion flux CSR
  db.run(
    `INSERT INTO flow (debit) VALUES (?)`,
    [testData.flow.debit],
    function(err) {
      if (err) {
        console.error("Erreur insertion flow:", err.message);
      } else {
        console.log(`✓ Flux CSR inséré (ID: ${this.lastID})`);
      }
    }
  );

  // Insertion syngaz
  db.run(
    `INSERT INTO syngas (H2, CO, CH4, CO2, tars) VALUES (?, ?, ?, ?, ?)`,
    [testData.syngas.H2, testData.syngas.CO, testData.syngas.CH4, testData.syngas.CO2, testData.syngas.tars],
    function(err) {
      if (err) {
        console.error("Erreur insertion syngas:", err.message);
      } else {
        console.log(`✓ Syngaz inséré (ID: ${this.lastID})`);
      }
    }
  );

  // Fermeture de la base après un court délai
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error("Erreur fermeture DB:", err.message);
      } else {
        console.log("\n✅ Données de test insérées avec succès !");
        console.log("Vous pouvez maintenant démarrer le serveur avec: node serveur.js");
      }
    });
  }, 500);
});

