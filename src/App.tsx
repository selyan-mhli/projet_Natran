import { useState } from 'react'
import Header from './components/Header'
import FinalSimulation from './components/FinalSimulation'
import Architecture from './components/Architecture'
import Impact from './components/Impact'
import AboutCSR from './components/AboutCSR'
import { SimulationProvider } from './context/SimulationContext'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulation' | 'architecture' | 'impact' | 'about'>('about')

  return (
    <SimulationProvider>
    <div className="min-h-screen bg-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'about' && <AboutCSR />}
        {activeTab === 'simulation' && <FinalSimulation />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'impact' && <Impact />}
      </main>
      
      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-slate-900">Solution C.U.R.I.E</p>
              <p className="text-sm text-slate-500">Système de tri intelligent des CSR par vision artificielle</p>
            </div>
            <div className="text-sm text-slate-500">
              <p>© 2024 - Rapport Scientifique</p>
              <p>Optimisation de la pyro-gazéification industrielle</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </SimulationProvider>
  )
}

export default App
