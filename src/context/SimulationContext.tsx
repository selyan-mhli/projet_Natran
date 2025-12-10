import { createContext, useContext, useState, ReactNode } from 'react'

interface SimulationStats {
  total: number
  accepted: number
  rejected: number
  uncertain: number
  isRunning: boolean
  // Métriques calculées
  chlore: number
  pci: number
  humidity: number
  metals: number
  syngasQuality: number
}

interface SimulationContextType {
  stats: SimulationStats
  updateStats: (newStats: Partial<SimulationStats>) => void
  resetStats: () => void
}

const defaultStats: SimulationStats = {
  total: 0,
  accepted: 0,
  rejected: 0,
  uncertain: 0,
  isRunning: false,
  chlore: 0.8,
  pci: 18.5,
  humidity: 12.3,
  metals: 0.3,
  syngasQuality: 65
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<SimulationStats>(defaultStats)

  const updateStats = (newStats: Partial<SimulationStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats }
      
      // Calculer les métriques basées sur le tri
      if (updated.total > 0) {
        const tauxRejet = updated.rejected / updated.total
        const tauxAccept = updated.accepted / updated.total
        
        // Plus on rejette de contaminants, meilleure est la qualité
        updated.chlore = Math.max(0.3, 0.8 - (tauxRejet * 0.5))
        updated.metals = Math.max(0.1, 0.3 - (tauxRejet * 0.2))
        updated.pci = Math.min(22, 18.5 + (tauxAccept * 3))
        updated.humidity = Math.max(8, 12.3 - (tauxAccept * 2))
        updated.syngasQuality = Math.min(98, 65 + (tauxRejet * 30) + (tauxAccept * 5))
      }
      
      return updated
    })
  }

  const resetStats = () => {
    setStats(defaultStats)
  }

  return (
    <SimulationContext.Provider value={{ stats, updateStats, resetStats }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
