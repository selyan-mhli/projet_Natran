import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useSimulation } from '../context/SimulationContext'

export default function Dashboard() {
  const { stats } = useSimulation()
  const [detections, setDetections] = useState<Array<{ id: number; type: string; confidence: number; time: string }>>([])
  const [qualityHistory, setQualityHistory] = useState<Array<{ time: string; quality: number }>>([])

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
    
    // Historique qualité syngas
    setQualityHistory(prev => [...prev, {
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      quality: stats.syngasQuality
    }].slice(-10))
  }, [stats.total])

  const qualityData = [
    { name: '00:00', avant: 65, apres: 92 },
    { name: '04:00', avant: 62, apres: 94 },
    { name: '08:00', avant: 68, apres: 91 },
    { name: '12:00', avant: 64, apres: 93 },
    { name: '16:00', avant: 66, apres: 95 },
    { name: '20:00', avant: 63, apres: 94 },
  ]

  const compositionData = [
    { name: 'Plastique', value: 35 },
    { name: 'Papier', value: 28 },
    { name: 'Bois', value: 20 },
    { name: 'Carton', value: 12 },
    { name: 'Autres', value: 5 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Taux de Chlore"
          value={`${stats.chlore.toFixed(2)}%`}
          icon={AlertTriangle}
          status={stats.chlore < 1 ? 'good' : 'warning'}
          trend={stats.total > 0 ? `-${((0.8 - stats.chlore) / 0.8 * 100).toFixed(0)}%` : '0%'}
        />
        <MetricCard
          title="PCI Moyen"
          value={`${stats.pci.toFixed(1)} MJ/kg`}
          icon={TrendingUp}
          status="good"
          trend={stats.total > 0 ? `+${((stats.pci - 18.5) / 18.5 * 100).toFixed(0)}%` : '0%'}
        />
        <MetricCard
          title="Humidité"
          value={`${stats.humidity.toFixed(1)}%`}
          icon={Activity}
          status={stats.humidity < 15 ? 'good' : 'warning'}
          trend={stats.total > 0 ? `-${((12.3 - stats.humidity) / 12.3 * 100).toFixed(0)}%` : '0%'}
        />
        <MetricCard
          title="Qualité Syngas"
          value={`${stats.syngasQuality.toFixed(0)}/100`}
          icon={CheckCircle}
          status={stats.syngasQuality > 80 ? 'good' : 'warning'}
          trend={stats.total > 0 ? `+${((stats.syngasQuality - 65) / 65 * 100).toFixed(0)}%` : '0%'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Flux de détection en temps réel</h3>
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
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Analyse compositionnelle instantanée</h3>
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
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-slate-900">Qualité du syngas produit (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" domain={[50, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              labelStyle={{ color: '#0f172a' }}
            />
            <Legend />
            <Line type="monotone" dataKey="avant" stroke="#dc2626" strokeWidth={2} name="Sans tri prédictif" />
            <Line type="monotone" dataKey="apres" stroke="#16a34a" strokeWidth={2} name="Avec tri prédictif" />
          </LineChart>
        </ResponsiveContainer>
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
