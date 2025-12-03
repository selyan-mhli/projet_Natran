import AppShell from "@/components/AppShell";

export default function ReacteurPage() {
  const syngasRatios = [
    { label: "H₂", value: 41, color: "#4CAF50" },
    { label: "CO", value: 32, color: "#2196F3" },
    { label: "CH₄", value: 6, color: "#FF9800" },
    { label: "CO₂", value: 18, color: "#F44336" }
  ];

  const alarms = [
    { label: "Température", value: "870°C stable" },
    { label: "Pression", value: "1.2 bar - conforme" },
    { label: "Flux CSR", value: "1.2 t/h - continu" }
  ];

  return (
    <AppShell>
      <header className="topbar">
        <div className="top-left">
          <h2>Réacteur de gazéification 🔥</h2>
          <p>Paramètres critiques suivis en temps réel.</p>
        </div>
        <div className="top-right">
          <div className="live-indicator">
            <span className="live-dot" />
            <span>Temps réel</span>
          </div>
        </div>
      </header>

      <section className="hero">
        <div>
          <h3>Suivi opérationnel</h3>
          <p>
            Température, pression et composition du syngaz sont surveillées
            minute par minute afin de garantir la stabilité du procédé.
          </p>
        </div>
        <button className="icon-btn" aria-label="Commande vocale">
          🎙
        </button>
      </section>

      <section className="grid">
        <article className="card card-large">
          <header className="card-header">
            <h3>Température réacteur</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="connection-status">
                <span>Stable</span>
              </span>
              <span className="pill">Temps réel</span>
            </div>
          </header>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                alignItems: "center"
              }}
            >
              <div className="temp-gauge" style={{ width: 180, height: 180 }}>
                <div
                  className="temp-gauge-bg"
                  style={{
                    background:
                      "conic-gradient(from 180deg,#e74c3c 0deg 60deg,#f1c40f 60deg 120deg,#2ecc71 120deg 240deg,#f1c40f 240deg 300deg,#e74c3c 300deg 360deg)"
                  }}
                >
                  <div className="temp-gauge-inner">
                    <span className="temp-value" style={{ fontSize: "2.5rem" }}>
                      870°C
                    </span>
                    <span className="temp-label">Réacteur</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="data-item" style={{ marginBottom: 10 }}>
                  <div className="data-label">Consigne</div>
                  <div className="data-value" style={{ fontSize: "1.2rem" }}>
                    850–900°C
                  </div>
                </div>
                <div className="data-item" style={{ marginBottom: 10 }}>
                  <div className="data-label">Température minimale</div>
                  <div className="data-value" style={{ color: "#3498db" }}>
                    865°C
                  </div>
                </div>
                <div className="data-item" style={{ marginBottom: 10 }}>
                  <div className="data-label">Température maximale</div>
                  <div className="data-value" style={{ color: "#e74c3c" }}>
                    875°C
                  </div>
                </div>
                <div className="data-item">
                  <div className="data-label">Stabilité thermique</div>
                  <div className="data-value" style={{ color: "#2ecc71" }}>
                    98.5%
                  </div>
                </div>
              </div>
            </div>
            <div className="section-title" style={{ marginTop: 20 }}>
              Historique 24h
            </div>
            <div className="chart-placeholder" style={{ height: 120 }}>
              Courbe à intégrer (Chart.js)
            </div>
          </div>
          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Ajuster consigne
            </button>
            <button className="link-btn" type="button">
              Voir courbes →
            </button>
          </footer>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Pression réacteur</h3>
            <span className="tag good">Normal</span>
          </header>
          <div className="card-body">
            <div className="temp-gauge" style={{ width: 120, height: 120 }}>
              <div
                className="temp-gauge-bg"
                style={{
                  background:
                    "conic-gradient(from 0deg,#3498db 0deg 216deg,#e0e0e0 216deg 360deg)"
                }}
              >
                <div className="temp-gauge-inner">
                  <span className="temp-value">1.2</span>
                  <span className="temp-label">bar</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="kpi-row">
                <span>Consigne</span>
                <strong>1.0-1.5 bar</strong>
              </div>
              <div className="kpi-row">
                <span>Variation</span>
                <strong style={{ color: "#2ecc71" }}>±0.05</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Flux CSR</h3>
            <span className="pill">Moy. 1h</span>
          </header>
          <div className="card-body">
            <div className="kpi-row big">
              <span>Débit instantané</span>
              <strong>1.2 t/h</strong>
            </div>
            <div className="progress-bar" style={{ marginTop: 16 }}>
              <div className="progress-fill" style={{ width: "78%" }} />
            </div>
            <p className="small-text" style={{ marginTop: 8 }}>
              Capacité utilisée: 78%
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Composition syngaz</h3>
            <span className="pill">Analyse</span>
          </header>
          <div className="card-body">
            <div className="syngas-grid">
              {syngasRatios.map(item => (
                <div className="syngas-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value} %</strong>
                  <div className="mini-bar">
                    <div
                      style={{
                        width: `${item.value}%`,
                        background: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Alimentation en air</h3>
            <span className="tag neutral">Mode auto</span>
          </header>
          <div className="card-body">
            <div className="data-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="data-item">
                <div className="data-label">Débit primaire</div>
                <div className="data-value">320 Nm³/h</div>
              </div>
              <div className="data-item">
                <div className="data-label">Débit secondaire</div>
                <div className="data-value">110 Nm³/h</div>
              </div>
            </div>
            <p className="small-text" style={{ marginTop: 12 }}>
              Contrôle automatique en boucle fermée
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Risques &amp; alarmes</h3>
            <span className="connection-status">
              <span>Tout est OK</span>
            </span>
          </header>
          <div className="card-body">
            <ul className="alarms">
              {alarms.map(alarm => (
                <li className="alarm ok" key={alarm.label}>
                  <span className="dot" />
                  <div>
                    <strong>{alarm.label}</strong>
                    <div className="small-text">{alarm.value}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <footer className="card-footer">
            <button className="ghost-btn" type="button">
              Journal des événements
            </button>
          </footer>
        </article>
      </section>
    </AppShell>
  );
}
