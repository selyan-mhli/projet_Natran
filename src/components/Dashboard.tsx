import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSimulation } from '../context/SimulationContext'

export default function Dashboard() {
  const { stats } = useSimulation()
  const [detections, setDetections] = useState<Array<{ id: number; type: string; confidence: number; time: string }>>([])
  const [qualityHistory, setQualityHistory] = useState<Array<{ time: string; chlore: number; syngas: number }>>([])

  // Ajouter des détections basées sur la simulation
  useEffect(() => {
    if (stats.total === 0) {
      setDetections([])
      setQualityHistory([])
      return
    }
    
    const materials = ['PE/PP', 'Papier/Carton', 'Bois', 'PVC (Chloré)', 'Métaux ferreux', 'Textile']
    const newDetection = {
      id: Date.now(),
      type: materials[Math.floor(Math.random() * materials.length)],
      confidence: 88 + Math.random() * 11,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
    setDetections(prev => [newDetection, ...prev].slice(0, 12))
    
    // Historique qualité syngas et chlore
    setQualityHistory(prev => [...prev, {
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      chlore: stats.chlore,
      syngas: stats.syngasQuality
    }].slice(-15))
  }, [stats.total, stats.chlore, stats.syngasQuality])

  // Données vides si simulation pas lancée
  const isSimulationActive = stats.total > 0

  // Composition basée sur les vraies stats
  const compositionData = isSimulationActive ? [
    { name: 'Conformes', value: stats.accepted },
    { name: 'Rejetés', value: stats.rejected },
    { name: 'Incertains', value: stats.uncertain },
  ] : []

  // Si simulation pas lancée, afficher message
  if (!isSimulationActive) {
    return (
      <div className="bg-slate-100 rounded-xl p-12 text-center border border-slate-200">
        <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Monitoring en attente</h3>
        <p className="text-slate-500">Démarrez la simulation pour voir les données en temps réel</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Taux de Chlore"
          value={`${stats.chlore.toFixed(2)}%`}
          icon={AlertTriangle}
          status={stats.chlore < 1 ? 'good' : 'warning'}
          trend={`-${((0.8 - stats.chlore) / 0.8 * 100).toFixed(0)}%`}
        />
        <MetricCard
          title="PCI Moyen"
          value={`${stats.pci.toFixed(1)} MJ/kg`}
          icon={TrendingUp}
          status="good"
          trend={`+${((stats.pci - 18.5) / 18.5 * 100).toFixed(0)}%`}
        />
        <MetricCard
          title="Humidité"
          value={`${stats.humidity.toFixed(1)}%`}
          icon={Activity}
          status={stats.humidity < 15 ? 'good' : 'warning'}
          trend={`-${((12.3 - stats.humidity) / 12.3 * 100).toFixed(0)}%`}
        />
        <MetricCard
          title="Qualité Syngas"
          value={`${stats.syngasQuality.toFixed(0)}/100`}
          icon={CheckCircle}
          status={stats.syngasQuality > 80 ? 'good' : 'warning'}
          trend={`+${((stats.syngasQuality - 65) / 65 * 100).toFixed(0)}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Flux de détection en temps réel</h3>
          {detections.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {detections.map((detection) => (
                <div key={detection.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMaterialColor(detection.type)}`}></div>
                    <div>
                      <p className="font-medium text-slate-900">{detection.type}</p>
                      <p className="text-xs text-slate-500">{detection.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{detection.confidence.toFixed(1)}%</p>
                    <p className="text-xs text-slate-500">Confiance</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">En attente de détections...</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Répartition du tri</h3>
          {compositionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={compositionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="value" fill="#1e3a5f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-8">En attente de données...</p>
          )}
        </div>
      </div>

      {/* Courbe d'évolution en temps réel */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-slate-900">Évolution de la qualité (temps réel)</h3>
        {qualityHistory.length > 1 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={qualityHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Line type="monotone" dataKey="syngas" stroke="#16a34a" strokeWidth={2} name="Qualité Syngas %" dot={{ fill: '#16a34a', r: 3 }} />
              <Line type="monotone" dataKey="chlore" stroke="#dc2626" strokeWidth={2} name="Chlore %" dot={{ fill: '#dc2626', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-center py-8">En attente de données...</p>
        )}
        <div className="flex justify-center gap-6 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-slate-600">Qualité Syngas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-slate-600">Taux de Chlore</span>
          </div>
        </div>
      </div>

      {/* Données de référence - Sources scientifiques */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold mb-2 text-slate-900">Seuils de qualité CSR</h3>
        <p className="text-sm text-slate-500 mb-4">Norme européenne EN 15359 - Classes de qualité</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-slate-500">Chlore Classe 1</p>
            <p className="text-green-600 font-bold">{"<"} 0.2%</p>
            <p className="text-xs text-slate-400">Très haute qualité</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-slate-500">Chlore Classe 3</p>
            <p className="text-amber-600 font-bold">{"<"} 1%</p>
            <p className="text-xs text-slate-400">Qualité standard</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-slate-500">Limite cimenteries</p>
            <p className="text-red-600 font-bold">{"<"} 0.5%</p>
            <p className="text-xs text-slate-400">Seuil max accepté</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-slate-500">PCI typique</p>
            <p className="text-blue-600 font-bold">8-27 MJ/kg</p>
            <p className="text-xs text-slate-400">Source: ADEME</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Sources : Étude ADEME, Norme EN 15359, Actu-Environnement
        </p>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, status, trend }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-8 h-8 ${status === 'good' ? 'text-slate-700' : 'text-amber-600'}`} />
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-sm text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function getMaterialColor(type: string) {
  const colors: Record<string, string> = {
    'PVC (Chloré)': 'bg-red-500',
    'PE/PP': 'bg-blue-500',
    'Papier/Carton': 'bg-amber-500',
    'Métaux ferreux': 'bg-gray-500',
    'Bois': 'bg-amber-700',
    'Textile': 'bg-purple-500'
  }
  return colors[type] || 'bg-slate-500'
}
