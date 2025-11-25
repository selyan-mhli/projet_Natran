// URL de ton API backend (relative pour fonctionner sur le même port)
const API_URL = "/api/dashboard";

// Variable globale pour le graphique camembert
let syngasPieChart = null;

// --- UTILITAIRES DOM ---

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Simule un mini "loader" si tu veux
function showLoading(state) {
  document.body.classList.toggle("loading", state);
}

// --- RÉCUPÉRATION DES DONNÉES ---

async function fetchDashboardData() {
  showLoading(true);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erreur API " + res.status);
    const data = await res.json();
    updateUI(data);
  } catch (err) {
    console.error("Erreur de chargement des données :", err);
    alert("Impossible de charger les données du dashboard.");
  } finally {
    showLoading(false);
  }
}

// --- MISE À JOUR DU DASHBOARD ---

function updateUI(data) {
  // Qualité CSR
  if (data.csrQuality && data.csrQuality.pci !== undefined) {
    setText("kpi-pci", `${data.csrQuality.pci.toFixed(1)} MJ/kg`);
  } else {
    setText("kpi-pci", "-- MJ/kg");
  }

  if (data.csrQuality && data.csrQuality.pcs !== undefined) {
    setText("kpi-pcs", `${data.csrQuality.pcs.toFixed(1)} MJ/kg`);
  } else {
    setText("kpi-pcs", "-- MJ/kg");
  }

  if (data.csrQuality && data.csrQuality.humidity !== undefined) {
    setText("kpi-humidity", `${data.csrQuality.humidity.toFixed(1)} %`);
  } else {
    setText("kpi-humidity", "-- %");
  }

  if (data.csrQuality && data.csrQuality.granulometry !== undefined) {
    setText("kpi-granulo", `${data.csrQuality.granulometry} mm`);
  } else {
    setText("kpi-granulo", "-- mm");
  }

  if (data.csrQuality && data.csrQuality.cendres !== undefined) {
    setText("kpi-cendres", `${data.csrQuality.cendres.toFixed(1)} %`);
  } else {
    setText("kpi-cendres", "-- %");
  }

  if (data.csrQuality && data.csrQuality.carbone !== undefined) {
    setText("kpi-carbone", `${data.csrQuality.carbone.toFixed(1)} %`);
  } else {
    setText("kpi-carbone", "-- %");
  }

  if (data.csrQuality && data.csrQuality.densite !== undefined) {
    setText("kpi-densite", `${data.csrQuality.densite.toFixed(0)} kg/m³`);
  } else {
    setText("kpi-densite", "-- kg/m³");
  }

  // Réacteur
  if (data.reactor && data.reactor.temperature !== undefined) {
    setText("kpi-temp-reactor", `${data.reactor.temperature}°C`);
  } else {
    setText("kpi-temp-reactor", "--°C");
  }

  // Flux CSR
  if (data.flow && data.flow.debit !== undefined) {
    setText("kpi-debit", `${data.flow.debit.toFixed(1)} t/h`);
  } else {
    setText("kpi-debit", "-- t/h");
  }

  // Syngaz
  if (data.syngas && data.syngas.H2 !== undefined) {
    setText("kpi-h2", `${data.syngas.H2} %`);
  } else {
    setText("kpi-h2", "-- %");
  }

  if (data.syngas && data.syngas.CO !== undefined) {
    setText("kpi-co", `${data.syngas.CO} %`);
  } else {
    setText("kpi-co", "-- %");
  }

  if (data.syngas && data.syngas.CH4 !== undefined) {
    setText("kpi-ch4", `${data.syngas.CH4} %`);
  } else {
    setText("kpi-ch4", "-- %");
  }

  if (data.syngas && data.syngas.CO2 !== undefined) {
    setText("kpi-co2", `${data.syngas.CO2} %`);
  } else {
    setText("kpi-co2", "-- %");
  }

  if (data.syngas && data.syngas.tars !== undefined) {
    setText("kpi-tars", `${data.syngas.tars} g/Nm³`);
  } else {
    setText("kpi-tars", "-- g/Nm³");
  }

  // Mise à jour du graphique camembert
  updatePieChart(data.syngas);
}

// --- GRAPHIQUE CAMEMBERT ---

function updatePieChart(syngasData) {
  const ctx = document.getElementById("syngas-pie-chart");
  if (!ctx) return;

  // Données par défaut si pas de données
  const defaultData = {
    H2: 0,
    CO: 0,
    CH4: 0,
    CO2: 0,
    N2: 3 // Azote généralement présent
  };

  const data = syngasData || defaultData;

  // Préparer les données pour le graphique (seulement les gaz principaux)
  const chartData = {
    labels: ["H₂", "CO", "CH₄", "CO₂", "N₂"],
    datasets: [{
      data: [
        data.H2 || 0,
        data.CO || 0,
        data.CH4 || 0,
        data.CO2 || 0,
        data.N2 || 3
      ],
      backgroundColor: [
        "#4CAF50",  // Vert pour H2
        "#2196F3",  // Bleu pour CO
        "#FF9800",  // Orange pour CH4
        "#F44336",  // Rouge pour CO2
        "#9E9E9E"   // Gris pour N2
      ],
      borderWidth: 2,
      borderColor: "#ffffff"
    }]
  };

  // Créer ou mettre à jour le graphique
  if (syngasPieChart) {
    syngasPieChart.data = chartData;
    syngasPieChart.update();
  } else {
    syngasPieChart = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 8,
              font: {
                size: 10
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                return `${label}: ${value.toFixed(1)}%`;
              }
            }
          }
        }
      }
    });
  }
}

// --- INITIALISATION ---

document.addEventListener("DOMContentLoaded", () => {
  // Synchroniser le nom dans le héro avec celui de l'utilisateur
  const userNameEl = document.querySelector(".user-name");
  const heroUserNameEl = document.getElementById("hero-user-name");
  if (userNameEl && heroUserNameEl) {
    heroUserNameEl.textContent = userNameEl.textContent;
  }

  fetchDashboardData();
  // refresh automatique toutes les 30 secondes
  setInterval(fetchDashboardData, 30000);
});
