import AppShell from "@/components/AppShell";

const emissions = [
  { label: "NOₓ", value: "145 mg/Nm³", limit: "Limite: 180", status: "good" },
  { label: "SO₂", value: "52 mg/Nm³", limit: "Limite: 80", status: "good" },
  { label: "CO", value: "38 mg/Nm³", limit: "Limite: 50", status: "neutral" },
  { label: "Poussières", value: "4 mg/Nm³", limit: "Limite: 10", status: "good" }
];

const scrubberStages = [
  { title: "Cyclone primaire", status: "Opérationnel", efficiency: "92%" },
  { title: "Laveur humide", status: "Opérationnel", efficiency: "95%" },
  { title: "Filtre à manches", status: "Opérationnel", efficiency: "99.5%" }
];

export default function EmissionsPage() {
  return (
    <AppShell>
      <header className="topbar">
        <div className="top-left">
          <h2>Émissions &amp; conformité 🌿</h2>
          <p>Suivi continu des polluants atmosphériques.</p>
        </div>
        <div className="top-right">
          <span className="connection-status">
            <span>Conforme</span>
          </span>
        </div>
      </header>

      <section className="hero">
        <div>
          <h3>Traitement des fumées</h3>
          <p>
            Les valeurs sont actualisées toutes les 5 minutes et comparées aux seuils réglementaires
            de l&apos;unité pilote CSR.
          </p>
        </div>
        <button className="icon-btn" aria-label="Exporter les données">
          ⬇️
        </button>
      </section>

      <section className="grid">
        {emissions.map(item => (
          <article className="card" key={item.label}>
            <header className="card-header">
              <h3>{item.label}</h3>
              <span className={`tag ${item.status}`}>Instantané</span>
            </header>
            <div className="card-body">
              <div className="kpi-row big">
                <span>Mesure</span>
                <strong>{item.value}</strong>
              </div>
              <p className="small-text">{item.limit}</p>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: item.status === "good" ? "55%" : "70%",
                    background:
                      item.status === "good"
                        ? "linear-gradient(90deg,#2ecc71,#1abc9c)"
                        : "linear-gradient(90deg,#f1c40f,#e67e22)"
                  }}
                />
              </div>
            </div>
          </article>
        ))}

        <article className="card card-wide">
          <header className="card-header">
            <h3>Ligne de traitement des fumées</h3>
            <span className="pill">En service</span>
          </header>
          <div className="card-body">
            <div className="data-grid" style={{ gridTemplateColumns: "1fr" }}>
              {scrubberStages.map(stage => (
                <div className="data-item" key={stage.title}>
                  <div className="data-label">{stage.title}</div>
                  <div className="data-value">{stage.status}</div>
                  <div className="data-trend trend-up">
                    Efficacité: {stage.efficiency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="card card-wide">
          <header className="card-header">
            <h3>CO₂ évité</h3>
            <span className="tag good">🌱 Positif</span>
          </header>
          <div className="card-body">
            <div className="kpi-row big">
              <span>Journalier</span>
              <strong>2.3 t</strong>
            </div>
            <div className="kpi-row">
              <span>Tendance</span>
              <strong className="trend-up">↑ +5% vs hier</strong>
            </div>
            <p className="small-text" style={{ marginTop: 12 }}>
              Estimation basée sur le mix énergétique local et le PCI moyen.
            </p>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Capteurs critiques</h3>
            <span className="connection-status">
              <span>Réseau OK</span>
            </span>
          </header>
          <div className="card-body">
            <ul className="alarms">
              <li className="alarm ok">
                <span className="dot" />
                <div>
                  <strong>Analyseur NOₓ</strong>
                  <div className="small-text">Calibrage à jour</div>
                </div>
              </li>
              <li className="alarm ok">
                <span className="dot" />
                <div>
                  <strong>Analyseur CO</strong>
                  <div className="small-text">Drift &lt; 1%</div>
                </div>
              </li>
              <li className="alarm ok">
                <span className="dot" />
                <div>
                  <strong>Sonde poussières</strong>
                  <div className="small-text">Auto-nettoyage actif</div>
                </div>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
