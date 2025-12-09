import { Flame, BarChart3, Cpu, TrendingUp, BookOpen } from 'lucide-react'

interface HeaderProps {
  activeTab: 'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about'
  setActiveTab: (tab: 'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about') => void
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: 'about' as const, label: 'Contexte CSR', icon: BookOpen },
    { id: 'dashboard' as const, label: 'Monitoring temps réel', icon: BarChart3 },
    { id: 'simulation' as const, label: 'Détection IA', icon: Cpu },
    { id: 'architecture' as const, label: 'Architecture système', icon: Flame },
    { id: 'impact' as const, label: 'Analyse d\'impact', icon: TrendingUp },
  ]

  return (
    <header className="border-b border-slate-200 glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg border-2 border-slate-900">
              <Flame className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">NATRAN - Système de Tri Intelligent</h1>
              <p className="text-sm text-slate-600">Optimisation de la pyro-gazéification des CSR par vision artificielle</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
            <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-700">Système opérationnel</span>
          </div>
        </div>
        
        <nav className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
