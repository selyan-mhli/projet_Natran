import { useState, useEffect, useRef } from 'react'
import { Camera, Cpu, Play, RotateCcw, Zap } from 'lucide-react'

interface Detection {
  x: number
  y: number
  width: number
  height: number
  type: string
  confidence: number
  id: number
  speed: number
  shape: string
  flash: boolean
}

interface LiveStats {
  total: number
  rejected: number
  accepted: number
  currentThroughput: number
  avgConfidence: number
  chloreLevel: number
  pciValue: number
}

export default function Simulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [detectedItems, setDetectedItems] = useState<Detection[]>([])
  const [stats, setStats] = useState<LiveStats>({
    total: 0,
    rejected: 0,
    accepted: 0,
    currentThroughput: 0,
    avgConfidence: 0,
    chloreLevel: 1.2,
    pciValue: 18.5
  })
  const [fps, setFps] = useState(0)
  const [_conveyorSpeed, _setConveyorSpeed] = useState(100)
  const animationRef = useRef<number>()

  const materials = [
    { name: 'PVC (Chloré)', color: 'border-slate-500', bgColor: 'bg-slate-500/20', reject: true, avgConf: 0.94, shape: 'bottle' },
    { name: 'PE/PP', color: 'border-slate-500', bgColor: 'bg-slate-500/20', reject: false, avgConf: 0.96, shape: 'bag' },
    { name: 'Papier/Carton', color: 'border-yellow-500', bgColor: 'bg-yellow-500/20', reject: false, avgConf: 0.92, shape: 'box' },
    { name: 'Métaux', color: 'border-gray-400', bgColor: 'bg-gray-400/20', reject: true, avgConf: 0.98, shape: 'can' },
    { name: 'Bois', color: 'border-amber-700', bgColor: 'bg-amber-700/20', reject: false, avgConf: 0.91, shape: 'plank' },
    { name: 'Textile', color: 'border-purple-500', bgColor: 'bg-purple-500/20', reject: false, avgConf: 0.89, shape: 'cloth' },
  ]

  useEffect(() => {
    if (isRunning) {
      const fpsInterval = setInterval(() => {
        setFps(Math.floor(42 + Math.random() * 8)) // Simule 42-50 FPS
      }, 100)
      return () => clearInterval(fpsInterval)
    } else {
      setFps(0)
    }
  }, [isRunning])

  // Animation du convoyeur
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setDetectedItems(prev => 
          prev.map(item => ({
            ...item,
            y: item.y + item.speed,
            flash: false
          })).filter(item => item.y < 100) // Garde les objets jusqu'en bas
        )
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  const startSimulation = () => {
    setIsRunning(true)
    setDetectedItems([])
    setStats({
      total: 0,
      rejected: 0,
      accepted: 0,
      currentThroughput: 0,
      avgConfidence: 0,
      chloreLevel: 1.2,
      pciValue: 18.5
    })
    setFps(45)

    // Génère un flux continu d'objets CSR
    const interval = setInterval(() => {
      const numDetections = Math.floor(Math.random() * 2) + 1 // 1-2 objets
      
      for (let i = 0; i < numDetections; i++) {
        setTimeout(() => {
          const material = materials[Math.floor(Math.random() * materials.length)]
          const newItem: Detection = {
            x: Math.random() * 70 + 15, // Position sur toute la largeur
            y: 0, // Commence tout en haut
            width: Math.random() * 8 + 12, // 12-20% - objets bien visibles
            height: Math.random() * 8 + 12,
            type: material.name,
            confidence: material.avgConf + (Math.random() * 0.08 - 0.04),
            id: Date.now() + Math.random(),
            speed: 0.6 + Math.random() * 0.4, // Vitesse plus rapide pour voir le mouvement
            shape: material.shape,
            flash: true
          }

          setDetectedItems(prev => [...prev, newItem])
          
          // Mise à jour des stats en temps réel
          setStats(prev => {
            const newTotal = prev.total + 1
            const newRejected = material.reject ? prev.rejected + 1 : prev.rejected
            const newAccepted = !material.reject ? prev.accepted + 1 : prev.accepted
            const newAvgConf = ((prev.avgConfidence * prev.total) + newItem.confidence) / newTotal
            
            // Calcul du niveau de chlore basé sur les rejets
            const chloreReduction = (newRejected / newTotal) * 0.8
            const newChlore = Math.max(0.4, 1.2 - chloreReduction)
            
            // PCI augmente avec meilleur tri
            const pciIncrease = (newAccepted / newTotal) * 2
            const newPCI = Math.min(21, 18.5 + pciIncrease)
            
            return {
              total: newTotal,
              rejected: newRejected,
              accepted: newAccepted,
              currentThroughput: Math.floor(newTotal / ((Date.now() - startTime) / 1000) * 60), // objets/min
              avgConfidence: newAvgConf,
              chloreLevel: newChlore,
              pciValue: newPCI
            }
          })
        }, i * 300)
      }
    }, 800) // Génère un objet toutes les 0.8 secondes (plus rapide)

    const startTime = Date.now()

    // Arrêt après 30 secondes
    setTimeout(() => {
      clearInterval(interval)
      setIsRunning(false)
    }, 30000)
  }

  const reset = () => {
    setDetectedItems([])
    setStats({
      total: 0,
      rejected: 0,
      accepted: 0,
      currentThroughput: 0,
      avgConfidence: 0,
      chloreLevel: 1.2,
      pciValue: 18.5
    })
    setIsRunning(false)
    _setConveyorSpeed(100)
  }

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Simulation de Détection IA</h2>
            <p className="text-slate-400">Visualisation en temps réel du tri intelligent des CSR</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startSimulation}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isRunning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-600 text-slate-900 hover:bg-slate-700 glow-effect'
              }`}
            >
              <Play className="w-5 h-5" />
              Démarrer
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-slate-900 rounded-lg font-medium hover:bg-slate-600 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-400 mb-1">Total Détecté</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-400 mb-1">Accepté</p>
            <p className="text-2xl font-bold text-slate-400">{stats.accepted}</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-400 mb-1">Rejeté</p>
            <p className="text-2xl font-bold text-slate-400">{stats.rejected}</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-400 mb-1">Débit traitement</p>
            <p className="text-2xl font-bold text-slate-400">{stats.currentThroughput}<span className="text-sm">/min</span></p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="text-xs text-slate-400 mb-1">Confiance moyenne</p>
            <p className="text-2xl font-bold text-slate-400">{(stats.avgConfidence * 100).toFixed(1)}%</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-purple-500">
            <p className="text-xs text-slate-400 mb-1">Taux de rejet</p>
            <p className="text-2xl font-bold text-slate-400">{stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(0) : 0}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Taux de chlore</span>
              <span className={`text-lg font-bold ${stats.chloreLevel < 0.8 ? 'text-slate-400' : 'text-slate-400'}`}>
                {stats.chloreLevel.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${stats.chloreLevel < 0.8 ? 'bg-slate-500' : 'bg-orange-500'}`}
                style={{ width: `${(stats.chloreLevel / 1.5) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Objectif: {'<'} 0.8% (Norme EN 15359)</p>
          </div>

          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Pouvoir Calorifique Inférieur</span>
              <span className={`text-lg font-bold ${stats.pciValue > 19 ? 'text-slate-400' : 'text-slate-400'}`}>
                {stats.pciValue.toFixed(1)} MJ/kg
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${stats.pciValue > 19 ? 'bg-slate-500' : 'bg-slate-500'}`}
                style={{ width: `${((stats.pciValue - 16) / 6) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Plage optimale: 18-22 MJ/kg</p>
          </div>
        </div>

        <div className="relative bg-white rounded-xl border-2 border-slate-700 overflow-hidden" style={{ 
          height: '600px'
        }}>
          {/* En-tête avec infos caméra */}
          <div className="absolute top-4 left-4 flex items-center gap-3 glass-effect px-4 py-2 rounded-lg z-20">
            <Camera className="w-5 h-5 text-slate-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">CAM-01 • Convoyeur Principal</span>
                {isRunning && <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>}
              </div>
              <span className="text-xs text-slate-400">4K • 60Hz • NIR+RGB</span>
            </div>
          </div>

          {/* Infos modèle et FPS */}
          <div className="absolute top-4 right-4 space-y-2 z-20">
            <div className="glass-effect px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900">YOLOv8-CSR-Custom</span>
              </div>
              <span className="text-xs text-slate-400">NVIDIA Jetson AGX Orin</span>
            </div>
            {isRunning && (
              <div className="glass-effect px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-400">{fps} FPS</span>
                </div>
              </div>
            )}
          </div>

          {/* LIGNE DE PRODUCTION SIMPLE */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
            {/* Grille de fond */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(100,200,255,0.3) 50px, rgba(100,200,255,0.3) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(100,200,255,0.3) 50px, rgba(100,200,255,0.3) 51px)'
            }}></div>

            {/* Convoyeur simple */}
            <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-gradient-to-b from-slate-600 via-slate-500 to-slate-600">
              {/* Texture */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)'
              }}></div>
              
              {/* Lignes qui défilent */}
              {isRunning && (
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)',
                  animation: 'conveyor 2s linear infinite'
                }}></div>
              )}
            </div>

            {/* Bordures */}
            <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-slate-800 border-r-2 border-slate-600"></div>
            <div className="absolute right-1/4 top-0 bottom-0 w-2 bg-slate-800 border-l-2 border-slate-600"></div>

            {/* STATIONS DE CAPTEURS EN 3D */}
            {/* STATION 1: Caméra RGB */}
            <div className="absolute left-1/3 top-8 z-20">
              <div className="relative">
                {/* Support 3D */}
                <div className="w-2 h-32 bg-gradient-to-b from-slate-500 to-slate-700 mx-auto rounded-full shadow-lg"></div>
                {/* Caméra RGB */}
                <div className="w-16 h-12 bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-500 rounded-lg flex items-center justify-center shadow-2xl" style={{
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  <Camera className="w-6 h-6 text-slate-400" />
                  {isRunning && (
                    <div className="absolute inset-0 border-2 border-slate-400 rounded-lg animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-slate-400 text-center mt-2 font-bold bg-slate-900/80 px-2 py-1 rounded">RGB 4K</div>
                {/* Faisceau 3D */}
                {isRunning && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-b from-blue-500/30 via-blue-500/10 to-transparent pointer-events-none" style={{
                    clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
                    filter: 'blur(2px)'
                  }}></div>
                )}
              </div>
            </div>

            {/* STATION 2: Caméra NIR */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 z-20">
              <div className="relative">
                {/* Support 3D */}
                <div className="w-2 h-40 bg-gradient-to-b from-slate-500 to-slate-700 mx-auto rounded-full shadow-lg"></div>
                {/* Caméra NIR */}
                <div className="w-20 h-14 bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-purple-500 rounded-lg flex items-center justify-center shadow-2xl" style={{
                  boxShadow: '0 10px 30px rgba(168, 85, 247, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  <Camera className="w-7 h-7 text-slate-400" />
                  {isRunning && (
                    <div className="absolute inset-0 border-2 border-purple-400 rounded-lg animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-slate-400 text-center mt-2 font-bold bg-slate-900/80 px-2 py-1 rounded">NIR</div>
                {/* Faisceau 3D */}
                {isRunning && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-40 h-72 bg-gradient-to-b from-purple-500/35 via-purple-500/12 to-transparent pointer-events-none" style={{
                    clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
                    filter: 'blur(2px)'
                  }}></div>
                )}
              </div>
            </div>

            {/* STATION 3: Capteur Spectral */}
            <div className="absolute left-2/3 top-8 z-20">
              <div className="relative">
                {/* Support 3D */}
                <div className="w-2 h-32 bg-gradient-to-b from-slate-500 to-slate-700 mx-auto rounded-full shadow-lg"></div>
                {/* Capteur */}
                <div className="w-16 h-12 bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-500 rounded-lg flex items-center justify-center shadow-2xl" style={{
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  <Zap className="w-6 h-6 text-slate-400" />
                  {isRunning && (
                    <div className="absolute inset-0 border-2 border-slate-400 rounded-lg animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-slate-400 text-center mt-2 font-bold bg-slate-900/80 px-2 py-1 rounded">SPECTRAL</div>
                {/* Faisceau 3D */}
                {isRunning && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-b from-green-500/30 via-green-500/10 to-transparent pointer-events-none" style={{
                    clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
                    filter: 'blur(2px)'
                  }}></div>
                )}
              </div>
            </div>

            {/* Zone de scan laser 3D */}
            <div className="absolute left-1/4 right-1/4 top-1/2 -translate-y-1/2 h-2 z-15">
              <div className="relative h-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80 shadow-lg shadow-red-500/50">
                {isRunning && (
                  <>
                    <div className="absolute inset-0 bg-slate-500 animate-pulse"></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-bold whitespace-nowrap bg-slate-900/80 px-3 py-1 rounded">
                      ⚡ ZONE DE DÉTECTION ⚡
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Système de tri 3D (droite) */}
            <div className="absolute right-16 bottom-24 z-20">
              <div className="flex flex-col items-center gap-2">
                {/* Buse de rejet 3D */}
                <div className="w-14 h-20 bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-500 rounded-t-xl flex items-center justify-center shadow-2xl" style={{
                  boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  <div className="text-3xl">💨</div>
                </div>
                <div className="text-sm text-slate-400 font-bold bg-slate-900/80 px-3 py-1 rounded">REJET</div>
                {isRunning && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-500/40 rounded-full animate-ping"></div>
                )}
              </div>
            </div>

            {/* Sortie accepté 3D (gauche) */}
            <div className="absolute left-16 bottom-24 z-20">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-20 bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-500 rounded-t-xl flex items-center justify-center shadow-2xl" style={{
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  <div className="text-3xl">✓</div>
                </div>
                <div className="text-sm text-slate-400 font-bold bg-slate-900/80 px-3 py-1 rounded">ACCEPTÉ</div>
              </div>
            </div>

            {/* Objets CSR sur le convoyeur */}
            {detectedItems.map((item) => {
              const material = materials.find(m => m.name === item.type)!
              const isReject = material.reject
              const isInScanZone = item.y > 45 && item.y < 55
              
              // Position sur le convoyeur (25% à 75% horizontalement)
              const conveyorLeft = 25
              const conveyorWidth = 50
              const relativeX = conveyorLeft + (item.x / 100) * conveyorWidth
              
              return (
                <div
                  key={item.id}
                  className={`absolute transition-all duration-100`}
                  style={{
                    left: `${relativeX}%`,
                    top: `${item.y}%`,
                    width: `${item.width * 0.5}%`,
                    height: `${item.height * 0.5}%`,
                    zIndex: 30
                  }}
                >
                  {/* Objet physique 3D avec ombre */}
                  <div className={`relative w-full h-full ${material.bgColor} rounded-xl border-3 ${material.color} shadow-2xl`}
                    style={{
                      transform: isInScanZone ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      boxShadow: isInScanZone 
                        ? `0 25px 70px ${isReject ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)'}, inset 0 2px 8px rgba(255,255,255,0.2)` 
                        : '0 20px 50px rgba(0,0,0,0.8), inset 0 2px 8px rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Emoji de l'objet - PLUS GROS */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center text-slate-900 font-bold text-xs">
                        {material.shape.toUpperCase()}
                      </div>
                    </div>

                    {/* Bounding box YOLO quand dans la zone de scan */}
                    {isInScanZone && (
                      <>
                        {/* Label de détection - PLUS VISIBLE */}
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-bold ${
                          isReject ? 'bg-slate-500' : 'bg-slate-500'
                        } text-slate-900 whitespace-nowrap shadow-2xl z-50 animate-pulse`}
                        style={{
                          transform: 'translateZ(20px)',
                          boxShadow: `0 8px 20px ${isReject ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)'}`
                        }}>
                          {item.type} • {(item.confidence * 100).toFixed(1)}%
                        </div>
                        
                        {/* Coins de la bounding box - PLUS ÉPAIS */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-white shadow-lg"></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-white shadow-lg"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-white shadow-lg"></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-white shadow-lg"></div>
                        
                        {/* Flash de scan - PLUS INTENSE */}
                        <div className="absolute inset-0 bg-white animate-ping opacity-30 rounded-xl"></div>
                        
                        {/* Particules de scan */}
                        <div className="absolute inset-0 overflow-hidden rounded-xl">
                          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
                          <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Indicateur de décision (apparaît après le scan) - PLUS VISIBLE */}
                  {item.y > 55 && (
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2" style={{
                      zIndex: 50
                    }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl ${
                        isReject ? 'bg-slate-500' : 'bg-slate-500'
                      }`}
                      style={{
                        animation: 'bounce 1s infinite',
                        boxShadow: `0 8px 25px ${isReject ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)'}`
                      }}>
                        <span className="text-slate-900 font-bold text-xl">{isReject ? '✕' : '✓'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Overlay d'informations en bas */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-transparent pt-16 pb-4">
            <div className="flex items-center justify-around px-8">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">CSR Accepté</span>
                </div>
                <p className="text-sm text-slate-300">→ Vers Pyro-gazéification</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">Polluants Détectés</span>
                </div>
                <p className="text-sm text-slate-300">→ Rejet automatique</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Zap className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Temps de réponse</span>
                </div>
                <p className="text-sm text-slate-300">{'<'} 20ms</p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          {isRunning && (
            <div className="absolute bottom-4 right-4 glass-effect px-3 py-1 rounded text-xs text-slate-400 font-mono">
              {new Date().toLocaleTimeString('fr-FR')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Matériaux Détectables</h3>
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.name} className={`flex items-center justify-between p-3 border-2 rounded-lg ${material.color}`}>
                <span className="font-medium text-slate-900">{material.name}</span>
                <span className={`text-sm font-bold ${material.reject ? 'text-slate-400' : 'text-slate-400'}`}>
                  {material.reject ? 'REJETÉ' : 'ACCEPTÉ'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Performances du Modèle</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Précision</span>
                <span className="text-slate-900 font-bold">96.8%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-slate-500 h-2 rounded-full" style={{ width: '96.8%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Rappel</span>
                <span className="text-slate-900 font-bold">94.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-slate-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Vitesse de Traitement</span>
                <span className="text-slate-900 font-bold">45 FPS</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-slate-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(500px);
            opacity: 0;
          }
        }
        
        @keyframes conveyor {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 42px;
          }
        }
      `}</style>
    </div>
  )
}
