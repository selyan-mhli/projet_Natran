import { Flame, Cpu, TrendingUp, BookOpen } from 'lucide-react'

interface HeaderProps {
  activeTab: 'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about'
  setActiveTab: (tab: 'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about') => void
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: 'about' as const, label: 'Introduction', icon: BookOpen },
    { id: 'simulation' as const, label: 'Simulation 3D', icon: Cpu },
    { id: 'architecture' as const, label: 'Architecture', icon: Flame },
    { id: 'impact' as const, label: 'Impact', icon: TrendingUp },
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">C.U.R.I.E</h1>
              <p className="text-sm text-slate-500">Tri intelligent des CSR par IA</p>
            </div>
          </div>
          
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-slate-900">Rapport Scientifique</p>
            <p className="text-xs text-slate-500">Pyro-gazéification industrielle</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-1 py-3 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
