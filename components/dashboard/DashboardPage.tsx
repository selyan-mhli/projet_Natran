'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Link from "next/link";
import { DashboardResponse, SyngasData } from "@/types";

const REFRESH_INTERVAL = 5000;

const days = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi"
];

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];

const syngasItems: Array<{
  key: keyof SyngasData;
  label: string;
  unit: string;
  color: string;
}> = [
  { key: "H2", label: "H₂", unit: " %", color: "#4CAF50" },
  { key: "CO", label: "CO", unit: " %", color: "#2196F3" },
  { key: "CH4", label: "CH₄", unit: " %", color: "#FF9800" },
  { key: "CO2", label: "CO₂", unit: " %", color: "#F44336" },
  { key: "tars", label: "Tars", unit: " g/Nm³", color: "#9E9E9E" }
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  const pieCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<Chart | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempChartRef = useRef<Chart | null>(null);
  const tempHistory = useRef<Array<{ time: string; temp: number }>>([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) {
          throw new Error("Erreur API");
        }
        const payload = (await res.json()) as DashboardResponse;
        if (!isMounted) return;

        setData(payload);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("Impossible de charger les données du dashboard");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const syngas = data?.syngas;
    if (!pieCanvasRef.current || !syngas) return;

    const chartData = {
      labels: ["H₂", "CO", "CH₄", "CO₂", "N₂"],
      datasets: [
        {
          data: [
            syngas.H2 || 0,
            syngas.CO || 0,
            syngas.CH4 || 0,
            syngas.CO2 || 0,
            syngas.N2 ?? 3
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
        }
      ]
    };

    if (pieChartRef.current) {
      pieChartRef.current.data = chartData;
      pieChartRef.current.update();
    } else {
      pieChartRef.current = new Chart(pieCanvasRef.current, {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 8,
                font: {
                  size: 10,
                  family: "system-ui"
                }
              }
            }
          }
        }
      });
    }
  }, [data?.syngas]);

  useEffect(() => {
    const temp = data?.reactor?.temperature;
    if (!tempCanvasRef.current || temp === undefined) return;

    tempHistory.current.push({
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      temp
    });

    if (tempHistory.current.length > 20) {
      tempHistory.current.shift();
    }

    const chartData = {
      labels: tempHistory.current.map(item => item.time),
      datasets: [
        {
          label: "Température (°C)",
          data: tempHistory.current.map(item => item.temp),
          borderColor: "#FF6A3D",
          backgroundColor: "rgba(255, 106, 61, 0.1)",
          tension: 0.4,
          fill: true
        }
      ]
    };

    if (tempChartRef.current) {
      tempChartRef.current.data = chartData;
      tempChartRef.current.update("none");
    } else {
      tempChartRef.current = new Chart(tempCanvasRef.current, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 800,
              max: 950,
              grid: {
                color: "#f0f0f0"
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
  }, [data?.reactor?.temperature]);

  useEffect(() => {
    return () => {
      pieChartRef.current?.destroy();
      tempChartRef.current?.destroy();
    };
  }, []);

  const qualityStatus = useMemo(() => {
    const pci = data?.csrQuality?.pci;

    if (pci && pci > 20) {
      return { label: "Excellente", className: "good" };
    }
    if (pci && pci < 15) {
      return { label: "Moyenne", className: "warn" };
    }
    return { label: "Standard", className: "neutral" };
  }, [data?.csrQuality?.pci]);

  const stability = useMemo(() => {
    const temperature = data?.reactor?.temperature;
    if (!temperature) return "--";
    const target = 875;
    const value = Math.max(0, 100 - Math.abs(temperature - target) * 2);
    return `${value.toFixed(1)} %`;
  }, [data?.reactor?.temperature]);

  const flow = data?.flow?.debit ?? null;
  const flowPercent = flow ? Math.min(100, (flow / 1.6) * 100) : 0;

  const connectionOk = !!data && !error;
  const lastUpdateLabel = lastUpdate
    ? `Mise à jour: ${lastUpdate.toLocaleTimeString("fr-FR")}`
    : "Chargement...";

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
          <div className="date-card">
            <span className="date-day">{now.getDate()}</span>
            <div className="date-info">
              <span className="date-weekday">{days[now.getDay()]}</span>
              <span className="date-month">{months[now.getMonth()]}</span>
            </div>
          </div>

          <Link className="primary-btn" href="/taches">
            Voir mes tâches <span className="arrow">→</span>
          </Link>
        </div>

        <div className="top-right">
          <div
            className={`connection-status${
              connectionOk ? "" : " disconnected"
            }`}
          >
            <span>{connectionOk ? "Connecté" : "Hors ligne"}</span>
          </div>

          <div className="live-indicator">
            <span className="live-dot" />
            <span>{lastUpdateLabel}</span>
          </div>

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

          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              aria-label="Recherche"
            />
          </div>
        </div>
      </header>

      <section className="hero">
        <div>
          <h2>Bienvenue sur votre Dashboard 👋</h2>
          <p>
            Bonjour <strong>Selyan MOUHALI</strong>, voici un aperçu en temps
            réel de votre unité pilote CSR.
          </p>
        </div>

        <button className="icon-btn" aria-label="Commande vocale" title="Commande vocale">
          🎙
        </button>
      </section>

      <section className="grid">
        <article className="card card-large">
          <header className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3>Qualité des CSR entrants</h3>
              <span
                className={`tag quality-tag ${qualityStatus.className}`}
                style={{ fontSize: "0.7rem", padding: "2px 8px" }}
              >
                {qualityStatus.label}
              </span>
            </div>
            <select className="card-select" aria-label="Sélection du lot">
              <option>Lot #2023-12-19-A</option>
              <option>Lot #2023-12-18-B</option>
              <option>Lot #2023-12-15-C</option>
            </select>
          </header>

          <div className="card-body">
            <div className="dashboard-kpi-grid">
              <div className="dashboard-kpi-box">
                <span className="label">PCI</span>
                <span className="value">
                  {data?.csrQuality?.pci
                    ? `${data.csrQuality.pci.toFixed(1)} MJ/kg`
                    : "-- MJ/kg"}
                </span>
              </div>
              <div className="dashboard-kpi-box">
                <span className="label">Humidité</span>
                <span className="value">
                  {data?.csrQuality?.humidity
                    ? `${data.csrQuality.humidity.toFixed(1)} %`
                    : "-- %"}
                </span>
              </div>
              <div className="dashboard-kpi-box">
                <span className="label">Granulo.</span>
                <span className="value">
                  {data?.csrQuality?.granulometry
                    ? `${data.csrQuality.granulometry} mm`
                    : "-- mm"}
                </span>
              </div>
            </div>

            <div className="section-title" style={{ marginTop: 16 }}>
              Paramètres additionnels
            </div>
            <div className="data-grid">
              <div className="data-item">
                <div className="data-label">PCS</div>
                <div className="data-value">
                  {data?.csrQuality?.pcs
                    ? `${data.csrQuality.pcs.toFixed(1)} MJ/kg`
                    : "--"}
                </div>
              </div>
              <div className="data-item">
                <div className="data-label">Cendres</div>
                <div className="data-value">
                  {data?.csrQuality?.cendres
                    ? `${data.csrQuality.cendres.toFixed(1)} %`
                    : "--"}
                </div>
              </div>
              <div className="data-item">
                <div className="data-label">Carbone</div>
                <div className="data-value">
                  {data?.csrQuality?.carbone
                    ? `${data.csrQuality.carbone.toFixed(1)} %`
                    : "--"}
                </div>
              </div>
              <div className="data-item">
                <div className="data-label">Densité</div>
                <div className="data-value">
                  {data?.csrQuality?.densite
                    ? `${data.csrQuality.densite.toFixed(0)} kg/m³`
                    : "--"}
                </div>
              </div>
            </div>

            <div
              className="tags-col"
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px"
              }}
            >
              <span className="tag good">Cl &lt; 0,5 %</span>
              <span className="tag warn">S proche limite</span>
              <span className="tag neutral">Métaux : OK</span>
            </div>
          </div>

          <footer className="card-footer">
            <Link className="ghost-btn" href="/fiches-csr">
              Voir détails
            </Link>
            <button className="link-btn" type="button">
              Historique →
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Température réacteur</h3>
            <span className="pill">Temps réel</span>
          </header>

          <div className="card-body">
            <div className="temp-gauge">
              <div className="temp-gauge-bg">
                <div className="temp-gauge-inner">
                  <span className="temp-value">
                    {data?.reactor?.temperature
                      ? `${data.reactor.temperature.toFixed(0)}°C`
                      : "--°C"}
                  </span>
                  <span className="temp-label">Réacteur</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <p className="small-text">Consigne: 850–900°C</p>
              <p className="small-text">
                Stabilité: <strong>{stability}</strong>
              </p>
            </div>
            <div style={{ height: 140, marginTop: 12 }}>
              <canvas ref={tempCanvasRef} />
            </div>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Composition du syngaz</h3>
            <select className="card-select" aria-label="Intervalle de temps">
              <option>5 minutes</option>
              <option>1 heure</option>
            </select>
          </header>

          <div className="card-body syngas-grid">
            {syngasItems.map(item => {
              const value = data?.syngas?.[item.key] ?? null;
              return (
                <div className="syngas-item" key={item.key}>
                  <span>{item.label}</span>
                  <strong>
                    {value !== null ? `${value}${item.unit}` : `--${item.unit}`}
                  </strong>
                  <div className="mini-bar">
                    <div
                      style={{
                        width: value ? `${Math.min(100, value * 2)}%` : "0%",
                        background: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Voir graphique
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Disponibilité unité pilote</h3>
          </header>

          <div
            className="card-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div className="donut">
              <div className="donut-inner">
                <span className="donut-value">96%</span>
                <span className="donut-label">Disponibilité</span>
              </div>
            </div>
            <p className="small-text" style={{ marginTop: 12 }}>
              Sur 30 jours
            </p>
          </div>
        </article>

        <article className="card card-wide">
          <header className="card-header">
            <h3>Flux CSR traités</h3>
            <select className="card-select" aria-label="Période">
              <option>Aujourd&apos;hui</option>
              <option>Semaine</option>
              <option>Mois</option>
            </select>
          </header>

          <div className="card-body">
            <div className="kpi-row big">
              <span>Débit instantané</span>
              <strong>
                {flow !== null ? `${flow.toFixed(1)} t/h` : "-- t/h"}
              </strong>
            </div>

            <div className="progress-bar" style={{ marginTop: 16 }}>
              <div
                className="progress-fill"
                style={{ width: `${flowPercent}%` }}
              />
            </div>
            <p className="small-text" style={{ marginTop: 8 }}>
              Capacité utilisée: {flowPercent.toFixed(0)}%
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Répartition syngaz</h3>
            <span className="pill">Composition</span>
          </header>

          <div className="card-body">
            <div className="chart-container" style={{ height: 200, padding: 0 }}>
              <canvas ref={pieCanvasRef} />
            </div>
          </div>

          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Analyse détaillée
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Risques &amp; alarmes</h3>
            <span className="connection-status">
              <span>Système OK</span>
            </span>
          </header>

          <div className="card-body">
            <ul className="alarms">
              <li className="alarm ok">
                <span className="dot" /> Aucune alarme active
              </li>
              <li className="alarm ok">
                <span className="dot" /> Température stable
              </li>
              <li className="alarm ok">
                <span className="dot" /> Pression normale
              </li>
            </ul>
          </div>

          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Journal des événements
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Impact environnemental</h3>
            <span className="tag good">🌱 Positif</span>
          </header>

          <div className="card-body">
            <div className="data-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="data-item">
                <div className="data-label">CO₂ évité</div>
                <div className="data-value">2.3 t/j</div>
                <div className="data-trend trend-up">↑ +5% vs hier</div>
              </div>
              <div className="data-item">
                <div className="data-label">Traitement fumées</div>
                <div className="data-value">98.5 %</div>
                <div className="data-trend trend-up">↑ Conforme</div>
              </div>
            </div>

            <p className="small-text" style={{ marginTop: 12 }}>
              Estimations basées sur les relevés en temps réel
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
