// URL de l'API backend
const API_URL = "/api/dashboard";
const REFRESH_INTERVAL = 5000; // 5 secondes

// Variables globales pour les graphiques
let syngasPieChart = null;
let temperatureLineChart = null;
let flowChart = null;

// --- ÉTAT DE L'APPLICATION ---
const appState = {
  isLoading: false,
  lastUpdate: null,
  error: null
};

// --- UTILITAIRES DOM ---
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    // Animation de changement de valeur
    el.style.opacity = '0.5';
    setTimeout(() => {
      el.textContent = value;
      el.style.opacity = '1';
    }, 150);
  }
}

function showLoading(state) {
  document.body.classList.toggle("loading", state);
  appState.isLoading = state;
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-toast';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.classList.add('fade-out');
    setTimeout(() => errorDiv.remove(), 300);
  }, 3000);
}

// --- RÉCUPÉRATION DES DONNÉES ---
async function fetchDashboardData() {
  if (appState.isLoading) return;

  showLoading(true);
  try {
    const res = await fetch(API_URL + `?t=${Date.now()}`);
    if (!res.ok) throw new Error("Erreur API " + res.status);

    const data = await res.json();
    appState.lastUpdate = new Date();
    appState.error = null;

    updateUI(data);
    updateLastUpdateTime();
  } catch (err) {
    console.error("Erreur de chargement des données :", err);
    appState.error = err.message;
    showError("Impossible de charger les données du dashboard");
  } finally {
    showLoading(false);
  }
}

// --- MISE À JOUR DE L'INTERFACE ---
function updateUI(data) {
  // Qualité CSR
  updateCSRQuality(data.csrQuality);

  // Réacteur
  updateReactor(data.reactor);

  // Flux CSR
  updateFlow(data.flow);

  // Syngaz
  updateSyngas(data.syngas);

  // Graphiques
  updatePieChart(data.syngas);
  updateTemperatureChart(data.reactor);
}

function updateCSRQuality(csrQuality) {
  if (!csrQuality) return;

  if (csrQuality.pci !== undefined) {
    setText("kpi-pci", `${csrQuality.pci.toFixed(1)} MJ/kg`);
    updateQualityTag(csrQuality.pci);
  }

  if (csrQuality.pcs !== undefined) {
    setText("kpi-pcs", `${csrQuality.pcs.toFixed(1)} MJ/kg`);
  }

  if (csrQuality.humidity !== undefined) {
    setText("kpi-humidity", `${csrQuality.humidity.toFixed(1)} %`);
  }

  if (csrQuality.granulometry !== undefined) {
    setText("kpi-granulo", `${csrQuality.granulometry} mm`);
  }

  if (csrQuality.cendres !== undefined) {
    setText("kpi-cendres", `${csrQuality.cendres.toFixed(1)} %`);
  }

  if (csrQuality.carbone !== undefined) {
    setText("kpi-carbone", `${csrQuality.carbone.toFixed(1)} %`);
  }

  if (csrQuality.densite !== undefined) {
    setText("kpi-densite", `${csrQuality.densite.toFixed(0)} kg/m³`);
  }
}

function updateQualityTag(pci) {
  // Détermine la qualité basée sur le PCI
  let qualityClass = 'neutral';
  let qualityText = 'Standard';

  if (pci > 20) {
    qualityClass = 'good';
    qualityText = 'Excellente';
  } else if (pci < 15) {
    qualityClass = 'warn';
    qualityText = 'Moyenne';
  }

  // Cherche tous les tags de qualité et les met à jour
  document.querySelectorAll('.quality-tag').forEach(tag => {
    tag.className = `tag quality-tag ${qualityClass}`;
    tag.textContent = qualityText;
  });
}

function updateReactor(reactor) {
  if (!reactor || reactor.temperature === undefined) return;

  setText("kpi-temp-reactor", `${reactor.temperature}°C`);

  // Calcul de stabilité (simulé)
  const targetTemp = 875;
  const deviation = Math.abs(reactor.temperature - targetTemp);
  const stability = Math.max(0, 100 - (deviation * 2));

  const stabilityEl = document.getElementById("temp-stability");
  if (stabilityEl) {
    setText("temp-stability", `${stability.toFixed(1)} %`);
  }

  // Indicateur visuel de température
  updateTemperatureIndicator(reactor.temperature);
}

function updateTemperatureIndicator(temp) {
  const indicator = document.querySelector('.circle-kpi');
  if (!indicator) return;

  // Changement de couleur selon la température
  if (temp >= 850 && temp <= 900) {
    indicator.style.background = 'rgba(46, 204, 113, 0.15)';
  } else if (temp >= 840 && temp <= 910) {
    indicator.style.background = 'rgba(241, 196, 15, 0.15)';
  } else {
    indicator.style.background = 'rgba(231, 76, 60, 0.15)';
  }
}

function updateFlow(flow) {
  if (!flow || flow.debit === undefined) return;

  setText("kpi-debit", `${flow.debit.toFixed(1)} t/h`);
}

function updateSyngas(syngasData) {
  if (!syngasData) return;

  if (syngasData.H2 !== undefined) {
    setText("kpi-h2", `${syngasData.H2} %`);
  }

  if (syngasData.CO !== undefined) {
    setText("kpi-co", `${syngasData.CO} %`);
  }

  if (syngasData.CH4 !== undefined) {
    setText("kpi-ch4", `${syngasData.CH4} %`);
  }

  if (syngasData.CO2 !== undefined) {
    setText("kpi-co2", `${syngasData.CO2} %`);
  }

  if (syngasData.tars !== undefined) {
    setText("kpi-tars", `${syngasData.tars} g/Nm³`);
  }
}

// --- GRAPHIQUES ---
function updatePieChart(syngasData) {
  const ctx = document.getElementById("syngas-pie-chart");
  if (!ctx) return;

  const defaultData = {
    H2: 0,
    CO: 0,
    CH4: 0,
    CO2: 0,
    N2: 3
  };

  const data = syngasData || defaultData;

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
        "#4CAF50",
        "#2196F3",
        "#FF9800",
        "#F44336",
        "#9E9E9E"
      ],
      borderWidth: 3,
      borderColor: "#ffffff"
    }]
  };

  if (syngasPieChart) {
    // Animation de transition
    syngasPieChart.data = chartData;
    syngasPieChart.update('active');
  } else {
    syngasPieChart = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 8,
              font: {
                size: 10,
                family: 'system-ui'
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
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8
          }
        }
      }
    });
  }
}

function updateTemperatureChart(reactor) {
  // Graphique temporel de température (à ajouter dans index.html)
  const ctx = document.getElementById("temp-line-chart");
  if (!ctx) return;

  // Stockage de l'historique (simplifié)
  if (!window.tempHistory) {
    window.tempHistory = [];
  }

  window.tempHistory.push({
    time: new Date().toLocaleTimeString(),
    temp: reactor.temperature
  });

  // Garder seulement les 20 dernières valeurs
  if (window.tempHistory.length > 20) {
    window.tempHistory.shift();
  }

  const chartData = {
    labels: window.tempHistory.map(h => h.time),
    datasets: [{
      label: 'Température (°C)',
      data: window.tempHistory.map(h => h.temp),
      borderColor: '#FF6A3D',
      backgroundColor: 'rgba(255, 106, 61, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  if (temperatureLineChart) {
    temperatureLineChart.data = chartData;
    temperatureLineChart.update('none'); // Pas d'animation pour les mises à jour fréquentes
  } else {
    temperatureLineChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 800,
            max: 950,
            grid: {
              color: '#f0f0f0'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

// --- HEURE DE DERNIÈRE MISE À JOUR ---
function updateLastUpdateTime() {
  const timeEl = document.getElementById('last-update-time');
  if (timeEl && appState.lastUpdate) {
    timeEl.textContent = `Mise à jour: ${appState.lastUpdate.toLocaleTimeString()}`;
  }
}

// --- INITIALISATION ---
document.addEventListener("DOMContentLoaded", () => {
  // Synchroniser le nom dans le héro
  const userNameEl = document.querySelector(".user-name");
  const heroUserNameEl = document.getElementById("hero-user-name");
  if (userNameEl && heroUserNameEl) {
    heroUserNameEl.textContent = userNameEl.textContent;
  }

  // Chargement initial
  fetchDashboardData();

  // Actualisation automatique
  setInterval(fetchDashboardData, REFRESH_INTERVAL);

  // Afficher l'indicateur de mise à jour
  setInterval(updateLastUpdateTime, 1000);
});

// --- GESTION DES ERREURS GLOBALES ---
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  showError('Une erreur est survenue');
});