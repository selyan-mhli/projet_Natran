import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function PreTraitementPage() {
  const qualityMetrics = [
    { label: "PCI moyen", value: "16.2 MJ/kg", trend: "↑ +2.1%" },
    { label: "Humidité", value: "12.5 %", trend: "↓ Optimal" },
    { label: "Granulométrie", value: "20 mm", trend: "→ Stable" },
    { label: "Cendres", value: "8.2 %", trend: "✓ Normal" }
  ];

  const separationData = [
    { label: "⚙️ Métaux", value: "2.3 kg" },
    { label: "🧴 Plastiques", value: "1.8 kg" },
    { label: "🪨 Inertes", value: "0.9 kg" }
  ];

  const equipment = [
    { name: "Broyeur", status: "Opérationnel - 98% efficacité" },
    { name: "Sécheur", status: "Opérationnel - T° 105°C" },
    { name: "Séparateur", status: "Opérationnel - Tri actif" }
  ];

  return (
    <AppShell>
      <header className="topbar">
        <div className="top-left">
          <h2>Pré-traitement des CSR ⚙️</h2>
          <p>Suivez le processus de préparation des CSR avant gazéification.</p>
        </div>
        <div className="top-right">
          <Link className="primary-btn" href="/taches">
            Voir mes tâches <span className="arrow">→</span>
          </Link>
        </div>
      </header>

      <section className="hero">
        <div>
          <h3>Chaîne de préparation</h3>
          <p>
            Broyage, séchage, tri et stockage sont surveillés en continu pour
            garantir une alimentation stable du réacteur.
          </p>
        </div>
        <button className="icon-btn" aria-label="Commande vocale">
          🎙
        </button>
      </section>

      <section className="grid">
        <article className="card card-large">
          <header className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3>Qualité des CSR entrants</h3>
              <span className="tag good">✓ Conforme</span>
            </div>
            <select className="card-select" aria-label="Sélection du lot">
              <option>Lot #2023-12-19-A</option>
              <option>Lot #2023-12-18-B</option>
              <option>Lot #2023-12-15-C</option>
            </select>
          </header>

          <div className="card-body">
            <div className="data-grid">
              {qualityMetrics.map(metric => (
                <div className="data-item" key={metric.label}>
                  <div className="data-label">{metric.label}</div>
                  <div className="data-value">{metric.value}</div>
                  <div
                    className={`data-trend ${
                      metric.trend.includes("↑") ? "trend-up" : ""
                    }`}
                  >
                    {metric.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: 16 }}>
              Polluants &amp; contaminants
            </div>
            <div
              className="tags-col"
              style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
            >
              <span className="tag good">Cl &lt; 0.5 %</span>
              <span className="tag warn">S = 0.18 % ⚠️</span>
              <span className="tag good">Métaux lourds : OK</span>
              <span className="tag good">Azote : Normal</span>
            </div>
          </div>

          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Analyse détaillée
            </button>
            <button className="link-btn" type="button">
              Voir historique →
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Broyage</h3>
            <span className="connection-status">
              <span>Actif</span>
            </span>
          </header>
          <div className="card-body">
            <div className="temp-gauge" style={{ width: 110, height: 110 }}>
              <div
                className="temp-gauge-bg"
                style={{
                  background:
                    "conic-gradient(from 0deg, #2ecc71 0deg 270deg, #e0e0e0 270deg 360deg)"
                }}
              >
                <div className="temp-gauge-inner">
                  <span className="temp-value" style={{ fontSize: "1.3rem" }}>
                    20mm
                  </span>
                  <span className="temp-label">Actuel</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="kpi-row">
                <span>Cible</span>
                <strong>15-25 mm</strong>
              </div>
              <div className="progress-bar" style={{ marginTop: 8 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: "75%",
                    background: "linear-gradient(90deg, #2ecc71, #27ae60)"
                  }}
                />
              </div>
              <p className="small-text" style={{ marginTop: 6 }}>
                ✓ Conforme aux spécifications
              </p>
            </div>
          </div>
          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Paramètres
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Séchage</h3>
            <span className="pill">En cours</span>
          </header>
          <div className="card-body">
            <div className="data-item" style={{ marginBottom: 12 }}>
              <div className="data-label">Humidité actuelle</div>
              <div
                className="data-value"
                style={{ fontSize: "1.8rem", color: "#2ecc71" }}
              >
                12.5 %
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: "83%",
                  background: "linear-gradient(90deg, #3498db, #2980b9)"
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: "0.7rem",
                color: "var(--text-muted)"
              }}
            >
              <span>0%</span>
              <span>Cible: &lt;15%</span>
              <span>20%</span>
            </div>
            <p
              className="small-text"
              style={{ marginTop: 12, color: "#2ecc71", fontWeight: 600 }}
            >
              ✓ Objectif atteint
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Tri et séparation</h3>
            <span className="tag neutral">Automatique</span>
          </header>
          <div className="card-body">
            <div className="section-title">Matériaux retirés (Lot actuel)</div>
            <div className="data-grid" style={{ gridTemplateColumns: "1fr" }}>
              {separationData.map(item => (
                <div className="data-item" key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "0.8rem" }}>{item.label}</span>
                    <strong style={{ fontSize: "1.1rem" }}>{item.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <footer className="card-footer">
            <button className="link-btn" type="button">
              Détails →
            </button>
          </footer>
        </article>

        <article className="card card-wide">
          <header className="card-header">
            <h3>Stockage CSR préparés</h3>
            <select className="card-select" aria-label="Période">
              <option>Aujourd&apos;hui</option>
              <option>Cette semaine</option>
              <option>Ce mois</option>
            </select>
          </header>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16
              }}
            >
              <div className="data-item">
                <div className="data-label">Stock disponible</div>
                <div
                  className="data-value"
                  style={{ fontSize: "2rem", color: "var(--accent)" }}
                >
                  45.2 t
                </div>
                <div className="data-trend trend-up">↑ +3.2 t vs hier</div>
              </div>
              <div className="data-item">
                <div className="data-label">Capacité maximale</div>
                <div className="data-value" style={{ fontSize: "2rem" }}>
                  60 t
                </div>
                <div className="data-trend">→ 75% utilisé</div>
              </div>
            </div>

            <div className="progress-bar" style={{ marginTop: 16, height: 12 }}>
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
            <p className="small-text" style={{ marginTop: 8 }}>
              Capacité de stockage : 75% utilisée
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Débit de traitement</h3>
            <span className="live-indicator">
              <span className="live-dot" />
              <span>Temps réel</span>
            </span>
          </header>
          <div className="card-body">
            <div className="temp-gauge" style={{ width: 120, height: 120 }}>
              <div
                className="temp-gauge-bg"
                style={{
                  background:
                    "conic-gradient(from 0deg, var(--accent) 0deg 180deg, #e0e0e0 180deg 360deg)"
                }}
              >
                <div className="temp-gauge-inner">
                  <span className="temp-value">1.2</span>
                  <span className="temp-label">t/h</span>
                </div>
              </div>
            </div>
            <p className="small-text" style={{ textAlign: "center", marginTop: 12 }}>
              Moyenne sur 24h
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Statut équipements</h3>
            <span className="connection-status">
              <span>Tous opérationnels</span>
            </span>
          </header>
          <div className="card-body">
            <ul className="alarms">
              {equipment.map(item => (
                <li className="alarm ok" key={item.name}>
                  <span className="dot" />
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <div className="small-text">{item.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Maintenance
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Efficacité globale</h3>
            <span className="tag good">Excellente</span>
          </header>
          <div className="card-body">
            <div className="donut" style={{ margin: "0 auto" }}>
              <div className="donut-inner">
                <span className="donut-value">94%</span>
                <span className="donut-label">Efficacité</span>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="kpi-row">
                <span>Pertes</span>
                <strong style={{ color: "#2ecc71" }}>6%</strong>
              </div>
              <div className="kpi-row">
                <span>Uptime</span>
                <strong style={{ color: "#2ecc71" }}>99.2%</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Production journalière</h3>
            <span className="pill">Aujourd&apos;hui</span>
          </header>
          <div className="card-body">
            <div className="data-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="data-item">
                <div className="data-label">CSR traités</div>
                <div className="data-value">28.8 t</div>
                <div className="data-trend trend-up">↑ +5% vs hier</div>
              </div>
              <div className="data-item">
                <div className="data-label">Temps d&apos;opération</div>
                <div className="data-value">23.8 h</div>
                <div className="data-trend trend-up">↑ 99% uptime</div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
