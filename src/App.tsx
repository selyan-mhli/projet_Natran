import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Simulation from './components/Simulation'
import Architecture from './components/Architecture'
import Impact from './components/Impact'
import AboutCSR from './components/AboutCSR'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about'>('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'about' && <AboutCSR />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'simulation' && <Simulation />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'impact' && <Impact />}
      </main>
      
      <footer className="border-t border-slate-800 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p> 2024 Projet Concours NATRAN - Tri Intelligent des CSR par IA</p>
          <p className="mt-2">Solution innovante pour la pyro-gazification optimise</p>
        </div>
      </footer>
    </div>
  )
}

export default App
