import { TrendingUp, TrendingDown, Leaf, Zap, DollarSign } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function Impact() {
  const comparisonData = [
    { metric: 'Chlore', sansTri: 2.5, avecTri: 0.8 },
    { metric: 'Soufre', sansTri: 1.8, avecTri: 0.6 },
    { metric: 'Métaux', sansTri: 1.2, avecTri: 0.3 },
    { metric: 'Cendres', sansTri: 15, avecTri: 9 },
    { metric: 'Humidité', sansTri: 18, avecTri: 12 }
  ]

  const gasQualityData = [
    { mois: 'Jan', sansTri: 65, avecTri: 92 },
    { mois: 'Fév', sansTri: 62, avecTri: 94 },
    { mois: 'Mar', sansTri: 68, avecTri: 91 },
    { mois: 'Avr', sansTri: 64, avecTri: 93 },
    { mois: 'Mai', sansTri: 66, avecTri: 95 },
    { mois: 'Juin', sansTri: 63, avecTri: 94 }
  ]

  const performanceData = [
    { subject: 'Efficacité', A: 95, B: 65 },
    { subject: 'Stabilité', A: 92, B: 60 },
    { subject: 'Qualité Gaz', A: 94, B: 68 },
    { subject: 'Rendement', A: 88, B: 70 },
    { subject: 'Maintenance', A: 85, B: 55 }
  ]

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyse d'impact environnemental et économique</h2>
        <p className="text-slate-400 mb-6">
          Étude comparative : pyro-gazéification avec et sans système de tri prédictif
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ImpactCard
            icon={TrendingDown}
            title="Polluants"
            value="-65%"
            description="Réduction des contaminants (Cl, S, métaux lourds)"
            trend="down"
          />
          <ImpactCard
            icon={TrendingUp}
            title="Qualité syngas"
            value="+42%"
            description="Amélioration de la pureté du gaz de synthèse"
            trend="up"
          />
          <ImpactCard
            icon={Leaf}
            title="Bilan carbone"
            value="-1200t"
            description="Émissions évitées (tCO₂eq/an)"
            trend="down"
          />
          <ImpactCard
            icon={DollarSign}
            title="Gains financiers"
            value="€450k"
            description="Annuels (maintenance et optimisation)"
            trend="up"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Réduction des contaminants (% massique)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="metric" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="sansTri" fill="#ef4444" name="Sans tri prédictif" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avecTri" fill="#22c55e" name="Avec tri prédictif" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Évolution de la qualité du syngas (indice/100)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mois" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[50, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sansTri" stroke="#ef4444" strokeWidth={2} name="Sans tri prédictif" />
              <Line type="monotone" dataKey="avecTri" stroke="#22c55e" strokeWidth={2} name="Avec tri prédictif" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Analyse comparative des performances</h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
              <Radar name="Avec tri prédictif" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              <Radar name="Sans tri prédictif" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">Rendement énergétique</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Rendement gazéification" before="68%" after="88%" />
            <MetricRow label="Consommation énergie" before="100%" after="82%" />
            <MetricRow label="Production H₂" before="12%" after="18%" />
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">Impact Environnemental</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Émissions HCl" before="2.5 kg/t" after="0.8 kg/t" />
            <MetricRow label="Émissions H₂S" before="1.8 kg/t" after="0.6 kg/t" />
            <MetricRow label="Déchets ultimes" before="15%" after="9%" />
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">Économies Annuelles</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Maintenance réacteur" before="€180k" after="€95k" />
            <MetricRow label="Traitement gaz" before="€220k" after="€110k" />
            <MetricRow label="Gestion déchets" before="€150k" after="€85k" />
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 bg-gradient-to-br from-primary-900/20 to-primary-800/10 border border-slate-500/30">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Conclusion</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-300 mb-3">Bénéfices Techniques</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Stabilisation de la composition des CSR en entrée</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Réduction drastique des polluants (Cl, S, métaux)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Amélioration de la qualité du gaz de synthèse</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Moins d'encrassement et de maintenance</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-300 mb-3">Bénéfices Économiques</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>ROI inférieur à 2 ans</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Économies de €450k/an en moyenne</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Valorisation accrue du gaz produit</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-400 mt-1">✓</span>
                <span>Réduction des coûts de traitement des effluents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImpactCard({ icon: Icon, title, value, description, trend }: any) {
  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-8 h-8 ${trend === 'up' ? 'text-slate-400' : 'text-slate-400'}`} />
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          trend === 'up' ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-500/20 text-slate-400'
        }`}>
          {trend === 'up' ? 'Amélioration' : 'Réduction'}
        </span>
      </div>
      <h3 className="text-sm text-slate-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  )
}

function MetricRow({ label, before, after }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-400">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-500/10 border border-slate-500/30 rounded px-2 py-1">
          <p className="text-xs text-slate-400">Avant</p>
          <p className="text-sm font-bold text-slate-400">{before}</p>
        </div>
        <div className="bg-slate-500/10 border border-slate-500/30 rounded px-2 py-1">
          <p className="text-xs text-slate-400">Après</p>
          <p className="text-sm font-bold text-slate-400">{after}</p>
        </div>
      </div>
    </div>
  )
}
