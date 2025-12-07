import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function Dashboard() {
  const [detections, setDetections] = useState<Array<{ id: number; type: string; confidence: number; time: string }>>([])
  const [metrics, setMetrics] = useState({
    chlore: 0.8,
    pci: 18.5,
    humidity: 12.3,
    metals: 0.3
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const materials = [
        { name: 'PVC (Chloré)', weight: 0.15 },
        { name: 'PE/PP', weight: 0.35 },
        { name: 'Papier/Carton', weight: 0.28 },
        { name: 'Métaux ferreux', weight: 0.05 },
        { name: 'Bois', weight: 0.12 },
        { name: 'Textile', weight: 0.05 }
      ]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const newDetection = {
        id: Date.now(),
        type: material.name,
        confidence: 88 + Math.random() * 11, // 88-99%
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      setDetections(prev => [newDetection, ...prev].slice(0, 12))
      
      // Simule des variations réalistes basées sur la composition détectée
      setMetrics(prev => {
        const variation = 0.05 // 5% de variation max
        return {
          chlore: Math.max(0.3, Math.min(1.5, prev.chlore + (Math.random() - 0.5) * variation)),
          pci: Math.max(16, Math.min(22, prev.pci + (Math.random() - 0.5) * 0.3)),
          humidity: Math.max(8, Math.min(15, prev.humidity + (Math.random() - 0.5) * 0.4)),
          metals: Math.max(0.1, Math.min(0.6, prev.metals + (Math.random() - 0.5) * 0.05))
        }
      })
    }, 1800)

    return () => clearInterval(interval)
  }, [])

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
          value={`${metrics.chlore.toFixed(2)}%`}
          icon={AlertTriangle}
          status={metrics.chlore < 1 ? 'good' : 'warning'}
          trend="-35%"
        />
        <MetricCard
          title="PCI Moyen"
          value={`${metrics.pci.toFixed(1)} MJ/kg`}
          icon={TrendingUp}
          status="good"
          trend="+12%"
        />
        <MetricCard
          title="Humidité"
          value={`${metrics.humidity.toFixed(1)}%`}
          icon={Activity}
          status={metrics.humidity < 15 ? 'good' : 'warning'}
          trend="-8%"
        />
        <MetricCard
          title="Métaux Lourds"
          value={`${metrics.metals.toFixed(2)}%`}
          icon={CheckCircle}
          status={metrics.metals < 0.5 ? 'good' : 'warning'}
          trend="-42%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Détections en Temps Réel</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {detections.map((detection) => (
              <div key={detection.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getMaterialColor(detection.type)}`}></div>
                  <div>
                    <p className="font-medium text-white">{detection.type}</p>
                    <p className="text-xs text-slate-400">{detection.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-400">{detection.confidence.toFixed(1)}%</p>
                  <p className="text-xs text-slate-400">Confiance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Composition CSR Détectée</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={compositionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Qualité du Gaz Produit (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[50, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Line type="monotone" dataKey="avant" stroke="#ef4444" strokeWidth={2} name="Sans Tri IA" />
            <Line type="monotone" dataKey="apres" stroke="#22c55e" strokeWidth={2} name="Avec Tri IA" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, status, trend }: any) {
  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-8 h-8 ${status === 'good' ? 'text-green-400' : 'text-yellow-400'}`} />
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-sm text-slate-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function getMaterialColor(type: string) {
  const colors: Record<string, string> = {
    'PVC (Chloré)': 'bg-red-500',
    'PE/PP': 'bg-blue-500',
    'Papier/Carton': 'bg-yellow-500',
    'Métaux ferreux': 'bg-gray-400',
    'Bois': 'bg-amber-700',
    'Textile': 'bg-purple-500'
  }
  return colors[type] || 'bg-slate-500'
}
