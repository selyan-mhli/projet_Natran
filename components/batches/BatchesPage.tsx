'use client';

import { useEffect, useMemo, useState } from "react";
import { BatchRecord } from "@/types";

type QualityFilter = "all" | "excellent" | "good" | "moyenne";
type SortOption = "recent" | "oldest" | "pci-high" | "pci-low";

const qualityResolver = (pci: number) => {
  if (pci > 20) {
    return { className: "good", label: "Excellente", emoji: "🟢" };
  }
  if (pci > 17) {
    return { className: "neutral", label: "Bonne", emoji: "🟡" };
  }
  return { className: "warn", label: "Moyenne", emoji: "🟠" };
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<QualityFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/batches");
        if (!res.ok) {
          throw new Error("Erreur API");
        }
        const payload = (await res.json()) as BatchRecord[];
        setBatches(payload);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les fiches CSR.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const qualityFilter = (batch: BatchRecord) => {
      const q = qualityResolver(batch.pci);
      if (quality === "all") return true;
      if (quality === "excellent") return q.label === "Excellente";
      if (quality === "good") return q.label === "Bonne";
      return q.label === "Moyenne";
    };

    const searchFilter = (batch: BatchRecord) => {
      const query = search.toLowerCase();
      return (
        batch.name.toLowerCase().includes(query) ||
        batch.batch_ref.toLowerCase().includes(query)
      );
    };

    let result = batches.filter(batch => qualityFilter(batch) && searchFilter(batch));

    result = result.sort((a, b) => {
      switch (sort) {
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "pci-high":
          return b.pci - a.pci;
        case "pci-low":
          return a.pci - b.pci;
        default:
          return 0;
      }
    });

    return result;
  }, [batches, quality, sort, search]);

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="topbar">
        <div className="top-left">
          <h2 style={{ margin: 0 }}>Fiches d&apos;identité Énergétique CSR</h2>
        </div>
        <div className="top-right">
          <button
            className="primary-btn small"
            type="button"
            onClick={() => alert("Ajouter une nouvelle fiche CSR...")}
          >
            + Nouvelle fiche
          </button>
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher une fiche..."
              aria-label="Recherche"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <section
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius-lg)",
          padding: 16,
          boxShadow: "var(--shadow-soft)",
          marginBottom: 20
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-muted)"
            }}
          >
            Filtrer par:
          </span>
          <select
            className="card-select"
            aria-label="Filtrer par qualité"
            value={quality}
            onChange={e => setQuality(e.target.value as QualityFilter)}
          >
            <option value="all">Toutes les qualités</option>
            <option value="excellent">Excellente</option>
            <option value="good">Bonne</option>
            <option value="moyenne">Moyenne</option>
          </select>
          <select
            className="card-select"
            aria-label="Trier par"
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
          >
            <option value="recent">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="pci-high">PCI décroissant</option>
            <option value="pci-low">PCI croissant</option>
          </select>
          <div style={{ flex: 1 }} />
          <span
            style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
            id="batch-count"
          >
            {filtered.length} fiche{filtered.length > 1 ? "s" : ""} disponible
            {filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </section>

      <section className="grid">
        {error && (
          <article className="card card-wide">
            <div className="card-body">
              <p style={{ color: "#e74c3c" }}>{error}</p>
            </div>
          </article>
        )}

        {!error && filtered.length === 0 && !loading && (
          <article className="card card-wide">
            <div className="card-body">
              <p>Aucune fiche CSR disponible.</p>
            </div>
          </article>
        )}

        {filtered.map((batch, index) => {
          const qualityInfo = qualityResolver(batch.pci);
          return (
            <article className="card" key={batch.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <header className="card-header">
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "1rem" }}>
                      {batch.name || "CSR"}
                    </h3>
                    <span
                      className={`tag ${qualityInfo.className}`}
                      style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                    >
                      {qualityInfo.emoji} {qualityInfo.label}
                    </span>
                  </div>
                  <span className="small-text">{batch.batch_ref}</span>
                </div>
                <span className="pill">
                  {new Date(batch.created_at).toLocaleDateString("fr-FR")}
                </span>
              </header>

              <div className="card-body">
                <div className="section-title">⚗️ Physico-chimique</div>
                <div className="data-grid">
                  <div className="data-item">
                    <div className="data-label">PCI</div>
                    <div
                      className="data-value"
                      style={{ color: batch.pci > 18 ? "#2ecc71" : "#f1c40f" }}
                    >
                      {batch.pci} MJ/kg
                    </div>
                  </div>
                  <div className="data-item">
                    <div className="data-label">Granulométrie</div>
                    <div className="data-value">{batch.granulometry} mm</div>
                  </div>
                  <div className="data-item">
                    <div className="data-label">Humidité</div>
                    <div className="data-value">{batch.humidity} %</div>
                  </div>
                  <div className="data-item">
                    <div className="data-label">Carbone</div>
                    <div className="data-value">{batch.carbon} %</div>
                  </div>
                </div>

                <div className="section-title" style={{ marginTop: 16 }}>
                  🧪 Analyse élémentaire
                </div>
                <div className="data-grid">
                  <div className="data-item">
                    <div className="data-label">Hydrogène</div>
                    <div className="data-value">{batch.hydrogen} %</div>
                  </div>
                  <div className="data-item">
                    <div className="data-label">Oxygène</div>
                    <div className="data-value">{batch.oxygen} %</div>
                  </div>
                </div>

                <div className="section-title" style={{ marginTop: 16 }}>
                  ☣️ Polluants
                </div>
                <div
                  className="tags-col"
                  style={{ flexWrap: "wrap", gap: 8, flexDirection: "row" }}
                >
                  {Object.entries(batch.pollutants || {}).map(([key, value]) => {
                    let color = "good";
                    if (value > 1) color = "warn";
                    if (value > 2) color = "danger";
                    return (
                      <span
                        className={`tag ${color}`}
                        key={key}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {key}: {value}%
                      </span>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
