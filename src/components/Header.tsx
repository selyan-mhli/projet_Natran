import { Flame, BarChart3, Cpu, TrendingUp, BookOpen } from 'lucide-react'

interface HeaderProps {
  activeTab: 'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about'
  setActiveTab: (tab: 'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about') => void
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: 'about' as const, label: 'Les CSR', icon: BookOpen },
    { id: 'dashboard' as const, label: 'Monitoring', icon: BarChart3 },
    { id: 'simulation' as const, label: 'Simulation IA', icon: Cpu },
    { id: 'architecture' as const, label: 'Architecture', icon: Flame },
    { id: 'impact' as const, label: 'Impact', icon: TrendingUp },
  ]

  return (
    <header className="border-b border-slate-800 glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center glow-effect">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">NATRAN CSR AI</h1>
              <p className="text-sm text-slate-400">Tri Intelligent pour Pyro-gazéification</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-effect rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">Système Actif</span>
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
                    ? 'bg-primary-600 text-white glow-effect'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
