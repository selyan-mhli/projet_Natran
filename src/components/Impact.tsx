import { TrendingUp, TrendingDown, Leaf, Zap, DollarSign, Activity } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useSimulation } from '../context/SimulationContext'

export default function Impact() {
  const { stats } = useSimulation()
  
  // Calculs basés sur la simulation
  const tauxConformite = stats.total > 0 ? (stats.accepted / stats.total * 100).toFixed(1) : '0'
  const tauxRejet = stats.total > 0 ? (stats.rejected / stats.total * 100).toFixed(1) : '0'
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
      {/* Résumé des stats de la simulation */}
      {stats.total > 0 && (
        <div className="bg-slate-900 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4">📊 Résumé de la Simulation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-slate-300">Total CSR triés</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-slate-300">Conformes</p>
              <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-slate-300">Non-conformes</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-slate-300">Taux conformité</p>
              <p className="text-2xl font-bold text-green-400">{tauxConformite}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-slate-300">Qualité syngas</p>
              <p className="text-2xl font-bold text-blue-400">{stats.syngasQuality.toFixed(0)}/100</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-slate-300">Taux chlore</p>
              <p className="text-2xl font-bold text-amber-400">{stats.chlore.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparaison avec/sans solution */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Comparaison : Avec vs Sans NATRAN</h2>
        <p className="text-slate-600 mb-6">
          Impact de notre solution de tri prédictif par IA sur la qualité du processus
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">❌ Sans NATRAN</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Chlore : 2.5% (corrosion)</li>
              <li>• Qualité syngas : 65/100</li>
              <li>• Tri manuel inefficace</li>
              <li>• Maintenance élevée</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">✅ Avec NATRAN</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Chlore : {stats.total > 0 ? stats.chlore.toFixed(2) : '0.8'}% (-68%)</li>
              <li>• Qualité syngas : {stats.total > 0 ? stats.syngasQuality.toFixed(0) : '92'}/100</li>
              <li>• Tri automatisé 96.8% précision</li>
              <li>• Maintenance réduite de 47%</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">💰 Économies</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ROI : &lt; 2 ans</li>
              <li>• Économies : €450k/an</li>
              <li>• -1200t CO₂/an</li>
              <li>• +42% qualité gaz</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyse d'impact environnemental et économique</h2>
        <p className="text-slate-600 mb-6">
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
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Réduction des contaminants (% massique)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Legend />
              <Bar dataKey="sansTri" fill="#ef4444" name="Sans tri prédictif" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avecTri" fill="#22c55e" name="Avec tri prédictif" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Évolution de la qualité du syngas (indice/100)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mois" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[50, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sansTri" stroke="#ef4444" strokeWidth={2} name="Sans tri prédictif" />
              <Line type="monotone" dataKey="avecTri" stroke="#22c55e" strokeWidth={2} name="Avec tri prédictif" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Analyse comparative des performances</h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
              <Radar name="Avec tri prédictif" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              <Radar name="Sans tri prédictif" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Rendement énergétique</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Rendement gazéification" before="68%" after="88%" />
            <MetricRow label="Consommation énergie" before="100%" after="82%" />
            <MetricRow label="Production H₂" before="12%" after="18%" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Impact Environnemental</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Émissions HCl" before="2.5 kg/t" after="0.8 kg/t" />
            <MetricRow label="Émissions H₂S" before="1.8 kg/t" after="0.6 kg/t" />
            <MetricRow label="Déchets ultimes" before="15%" after="9%" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Économies Annuelles</h3>
          </div>
          <div className="space-y-4">
            <MetricRow label="Maintenance réacteur" before="€180k" after="€95k" />
            <MetricRow label="Traitement gaz" before="€220k" after="€110k" />
            <MetricRow label="Gestion déchets" before="€150k" after="€85k" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Conclusion</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Bénéfices Techniques</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>Stabilisation de la composition des CSR en entrée</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>Réduction drastique des polluants (Cl, S, métaux)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>Amélioration de la qualité du gaz de synthèse</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>Moins d'encrassement et de maintenance</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Bénéfices Économiques</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>ROI inférieur à 2 ans</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>Économies de €450k/an en moyenne</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>Valorisation accrue du gaz produit</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
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
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-8 h-8 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend === 'up' ? 'Amélioration' : 'Réduction'}
        </span>
      </div>
      <h3 className="text-sm text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  )
}

function MetricRow({ label, before, after }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-700 font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-red-50 border border-red-200 rounded px-2 py-1">
          <p className="text-xs text-red-600">Avant</p>
          <p className="text-sm font-bold text-red-700">{before}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded px-2 py-1">
          <p className="text-xs text-green-600">Après</p>
          <p className="text-sm font-bold text-green-700">{after}</p>
        </div>
      </div>
    </div>
  )
}
