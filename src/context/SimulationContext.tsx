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

// Valeurs initiales basées sur CSR non triés (Sources: ADEME, EN 15359)
// CSR brut peut contenir jusqu'à 3.3% de chlore (avec PVC)
// PCI variable: 8-27 MJ/kg selon composition
const defaultStats: SimulationStats = {
  total: 0,
  accepted: 0,
  rejected: 0,
  uncertain: 0,
  isRunning: false,
  chlore: 1.5,      // CSR brut non trié: ~1.5% chlore (présence PVC)
  pci: 14,          // PCI moyen CSR France: ~14 MJ/kg (ADEME)
  humidity: 15,     // Humidité typique
  metals: 0.5,      // Métaux lourds
  syngasQuality: 60 // Qualité syngas estimée sans tri
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<SimulationStats>(defaultStats)

  const updateStats = (newStats: Partial<SimulationStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats }
      
      // Calculer les métriques basées sur le tri
      // Logique: rejeter PVC/métaux = moins de chlore, meilleur syngas
      // Accepter bons matériaux = meilleur PCI
      if (updated.total > 0) {
        const tauxRejet = updated.rejected / updated.total
        const tauxAccept = updated.accepted / updated.total
        
        // Chlore: CSR brut ~1.5%, objectif Classe 1 <0.2% (EN 15359)
        // En rejetant le PVC, on réduit le chlore
        updated.chlore = Math.max(0.15, 1.5 - (tauxRejet * 1.3))
        
        // Métaux: réduction par tri
        updated.metals = Math.max(0.1, 0.5 - (tauxRejet * 0.4))
        
        // PCI: CSR trié peut atteindre 20-25 MJ/kg (ADEME: 8-27 MJ/kg)
        updated.pci = Math.min(25, 14 + (tauxAccept * 10))
        
        // Humidité: légère amélioration
        updated.humidity = Math.max(10, 15 - (tauxAccept * 3))
        
        // Qualité syngas: estimation basée sur réduction contaminants
        updated.syngasQuality = Math.min(95, 60 + (tauxRejet * 25) + (tauxAccept * 10))
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
