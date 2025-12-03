import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

const reports = [
  {
    title: "📄 Rapport quotidien - 19/12/2023",
    summary: "Production, émissions, qualité CSR",
    format: "PDF"
  },
  {
    title: "📊 Rapport hebdomadaire - Semaine 50",
    summary: "Synthèse des performances et tendances",
    format: "XLSX"
  },
  {
    title: "📈 Rapport mensuel - Novembre 2023",
    summary: "Analyse complète du mois et KPIs",
    format: "PDF"
  },
  {
    title: "🌿 Rapport environnemental - Q4 2023",
    summary: "Bilan carbone et conformité réglementaire",
    format: "PDF"
  }
];

const highlights = [
  { label: "Disponibilité unité", value: "96 %" },
  { label: "Débit moyen CSR", value: "1.18 t/h" },
  { label: "CO₂ évité", value: "2.3 t/j" },
  { label: "Alarmes critiques", value: "0" }
];

export default function RapportsPage() {
  return (
    <AppShell>
      <header className="topbar">
        <div className="top-left">
          <div className="date-card">
            <span className="date-day">{new Date().getDate()}</span>
            <div className="date-info">
              <span className="date-weekday">Aujourd&apos;hui</span>
              <span className="date-month">
                {new Date().toLocaleDateString("fr-FR", { month: "long" })}
              </span>
            </div>
          </div>
          <button className="primary-btn" type="button">
            Nouveau rapport <span className="arrow">→</span>
          </button>
        </div>
        <div className="top-right">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un rapport..."
              aria-label="Recherche"
            />
          </div>
        </div>
      </header>

      <section className="hero">
        <div>
          <h3>Rapports et analyses</h3>
          <p>
            Consultez et générez vos rapports d&apos;activité. Les exports PDF et
            XLSX intègrent automatiquement les données temps réel du dashboard.
          </p>
        </div>
        <button className="icon-btn" aria-label="Commande vocale">
          🎙
        </button>
      </section>

      <section className="grid">
        <article className="card card-large">
          <header className="card-header">
            <h3>Rapports disponibles</h3>
            <select className="card-select" aria-label="Filtrer les rapports">
              <option>Tous les rapports</option>
              <option>Rapports quotidiens</option>
              <option>Rapports hebdomadaires</option>
              <option>Rapports mensuels</option>
            </select>
          </header>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reports.map(report => (
              <div className="data-item" style={{ padding: 14 }} key={report.title}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "0.95rem" }}>{report.title}</strong>
                    <div className="small-text" style={{ marginTop: 4 }}>
                      {report.summary}
                    </div>
                  </div>
                  <span className={`tag ${report.format === "PDF" ? "good" : "neutral"}`}>
                    {report.format}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="ghost-btn"
                    style={{ flex: 1 }}
                    type="button"
                  >
                    📥 Télécharger
                  </button>
                  <button
                    className="ghost-btn"
                    type="button"
                  >
                    👁️ Aperçu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>KPIs synthèse</h3>
            <span className="pill">Période 24h</span>
          </header>
          <div className="card-body">
            <div className="data-grid" style={{ gridTemplateColumns: "1fr" }}>
              {highlights.map(item => (
                <div className="data-item" key={item.label}>
                  <div className="data-label">{item.label}</div>
                  <div className="data-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="card">
          <header className="card-header">
            <h3>Tâches associées</h3>
            <span className="tag warn">3 à due</span>
          </header>
          <div className="card-body">
            <ul className="alarms">
              <li className="alarm ok">
                <span className="dot" />
                <div>
                  <strong>Valider rapport quotidien</strong>
                  <div className="small-text">Échéance 18:00</div>
                </div>
              </li>
              <li className="alarm ok">
                <span className="dot" />
                <div>
                  <strong>Préparer synthèse émissions</strong>
                  <div className="small-text">Demain 10:00</div>
                </div>
              </li>
              <li className="alarm ok">
                <span className="dot" />
                <div>
                  <strong>Archiver rapports S49</strong>
                  <div className="small-text">Cette semaine</div>
                </div>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
