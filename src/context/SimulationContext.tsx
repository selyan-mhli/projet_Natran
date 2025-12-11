import { createContext, useContext, useState, ReactNode } from 'react'

interface SimulationStats {
  total: number
  accepted: number
  rejected: number
  uncertain: number
  isRunning: boolean
  // Stats QC (Contrôle Qualité)
  falsePositives: number  // Conformes détectés comme non-conformes par erreur
  falseNegatives: number  // Non-conformes détectés comme conformes par erreur
  truePositives: number   // Conformes correctement classés
  trueNegatives: number   // Non-conformes correctement classés
  // Métriques calculées
  chlore: number
  pci: number
  humidity: number
  metals: number
  syngasQuality: number
  precision: number       // TP / (TP + FP)
  recall: number          // TP / (TP + FN)
  f1Score: number         // 2 * (precision * recall) / (precision + recall)
}

interface SimulationContextType {
  stats: SimulationStats
  updateStats: (newStats: Partial<SimulationStats>) => void
  resetStats: () => void
}

// Valeurs initiales basées sur CSR non triés (Sources: ADEME, EN 15359)
// Performances modèle YOLOv8 pour tri CSR (études: mAP@50 ~96.8%)
// Taux d'erreur réalistes basés sur littérature:
// - Faux positifs (FP): ~2.8% (précision 97.2%)
// - Faux négatifs (FN): ~4.4% (rappel 95.6%)
const defaultStats: SimulationStats = {
  total: 0,
  accepted: 0,
  rejected: 0,
  uncertain: 0,
  isRunning: false,
  // Stats QC initialisées à 0
  falsePositives: 0,
  falseNegatives: 0,
  truePositives: 0,
  trueNegatives: 0,
  // Métriques CSR
  chlore: 1.5,      // CSR brut non trié: ~1.5% chlore (présence PVC)
  pci: 14,          // PCI moyen CSR France: ~14 MJ/kg (ADEME)
  humidity: 15,     // Humidité typique
  metals: 0.5,      // Métaux lourds
  syngasQuality: 60, // Qualité syngas estimée sans tri
  // Métriques modèle (valeurs cibles YOLOv8)
  precision: 97.2,
  recall: 95.6,
  f1Score: 96.4
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
        
        // Chlore: CSR brut ~1.5%, objectif Classe 1 <0.2% (EN 15359)
        updated.chlore = Math.max(0.15, 1.5 - (tauxRejet * 1.3))
        
        // Métaux: réduction par tri
        updated.metals = Math.max(0.1, 0.5 - (tauxRejet * 0.4))
        
        // PCI: CSR trié peut atteindre 20-25 MJ/kg
        updated.pci = Math.min(25, 14 + (tauxAccept * 10))
        
        // Humidité: légère amélioration
        updated.humidity = Math.max(10, 15 - (tauxAccept * 3))
        
        // Qualité syngas
        updated.syngasQuality = Math.min(95, 60 + (tauxRejet * 25) + (tauxAccept * 10))
        
        // Calcul des métriques de performance du modèle
        // Seulement si on a assez de données (>10 objets) pour avoir des stats significatives
        const tp = updated.truePositives
        const fp = updated.falsePositives
        const fn = updated.falseNegatives
        
        if (updated.total >= 10) {
          // Calcul basé sur les données réelles
          if (tp + fp > 0) {
            updated.precision = (tp / (tp + fp)) * 100
          }
          if (tp + fn > 0) {
            updated.recall = (tp / (tp + fn)) * 100
          }
          if (updated.precision > 0 && updated.recall > 0) {
            updated.f1Score = 2 * (updated.precision * updated.recall) / (updated.precision + updated.recall)
          }
        } else {
          // Garder les valeurs cibles du modèle YOLOv8 tant qu'on n'a pas assez de données
          updated.precision = 97.2
          updated.recall = 95.6
          updated.f1Score = 96.4
        }
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
