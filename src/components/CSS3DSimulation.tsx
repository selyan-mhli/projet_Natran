import { useEffect, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import './CSS3DSimulation.css'

interface CSRObject {
  id: number
  x: number
  z: number
  color: string
  type: string
  rotate: number
}

export default function CSS3DSimulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [objects, setObjects] = useState<CSRObject[]>([])
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0 })
  const [armLeftAngle, setArmLeftAngle] = useState(0)
  const [armRightAngle, setArmRightAngle] = useState(0)

  const materials = [
    { name: 'PVC', color: '#ef4444', reject: true },
    { name: 'PE/PP', color: '#3b82f6', reject: false },
    { name: 'Papier', color: '#f59e0b', reject: false },
    { name: 'Métaux', color: '#6b7280', reject: true },
    { name: 'Bois', color: '#92400e', reject: false },
    { name: 'Textile', color: '#8b5cf6', reject: false }
  ]

  // Animation des bras
  useEffect(() => {
    const interval = setInterval(() => {
      setArmLeftAngle(prev => (prev + 2) % 360)
      setArmRightAngle(prev => (prev - 2) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Génération d'objets
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      if (objects.length < 8) {
        const material = materials[Math.floor(Math.random() * materials.length)]
        const newObj: CSRObject = {
          id: Date.now(),
          x: (Math.random() - 0.5) * 150,
          z: -400,
          color: material.color,
          type: material.name,
          rotate: Math.random() * 360
        }
        setObjects(prev => [...prev, newObj])
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          accepted: prev.accepted + (material.reject ? 0 : 1),
          rejected: prev.rejected + (material.reject ? 1 : 0)
        }))
      }
    }, 800)

    return () => clearInterval(interval)
  }, [isRunning, objects.length])

  // Animation des objets
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setObjects(prev => 
        prev
          .map(obj => ({
            ...obj,
            z: obj.z + 3,
            rotate: obj.rotate + 2
          }))
          .filter(obj => obj.z < 400)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setObjects([])
    setStats({ total: 0, accepted: 0, rejected: 0 })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-600">Conformes</p>
          <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-600">Non-conformes</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Play className="w-5 h-5" />
            Démarrer
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Pause className="w-5 h-5" />
            Arrêter
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Réinitialiser
        </button>
      </div>

      {/* Scène 3D */}
      <div className="scene-container">
        <div className="scene">
          {/* Sol */}
          <div className="ground"></div>

          {/* Convoyeur */}
          <div className="conveyor">
            <div className="conveyor-belt"></div>
            <div className="conveyor-side left"></div>
            <div className="conveyor-side right"></div>
          </div>

          {/* Structure */}
          <div className="structure-left"></div>
          <div className="structure-right"></div>
          <div className="structure-top"></div>

          {/* Caméras */}
          <div className="camera" style={{ left: '35%' }}>
            <div className="camera-body"></div>
            <div className="camera-lens"></div>
          </div>
          <div className="camera" style={{ left: '50%' }}>
            <div className="camera-body"></div>
            <div className="camera-lens"></div>
          </div>
          <div className="camera" style={{ left: '65%' }}>
            <div className="camera-body"></div>
            <div className="camera-lens"></div>
          </div>

          {/* Bras robotiques */}
          <div className="robotic-arm left" style={{ transform: `translate3d(-200px, 0, 0) rotateY(${armLeftAngle * 0.3}deg)` }}>
            <div className="arm-base"></div>
            <div className="arm-joint"></div>
            <div className="arm-segment"></div>
            <div className="arm-gripper green"></div>
          </div>

          <div className="robotic-arm right" style={{ transform: `translate3d(200px, 0, 0) rotateY(${armRightAngle * 0.3}deg)` }}>
            <div className="arm-base"></div>
            <div className="arm-joint"></div>
            <div className="arm-segment"></div>
            <div className="arm-gripper red"></div>
          </div>

          {/* Zone de détection */}
          <div className="detection-zone"></div>

          {/* Bacs */}
          <div className="bin left">
            <div className="bin-label">CONFORMES</div>
          </div>
          <div className="bin right">
            <div className="bin-label">NON-CONFORMES</div>
          </div>

          {/* Objets CSR */}
          {objects.map(obj => (
            <div
              key={obj.id}
              className="csr-object"
              style={{
                transform: `translate3d(${obj.x}px, -50px, ${obj.z}px) rotateX(${obj.rotate}deg) rotateY(${obj.rotate * 1.5}deg)`,
                backgroundColor: obj.color
              }}
            >
              <div className="csr-face front"></div>
              <div className="csr-face back"></div>
              <div className="csr-face top"></div>
              <div className="csr-face bottom"></div>
              <div className="csr-face left-side"></div>
              <div className="csr-face right-side"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 mt-4">
        🖱️ Faites glisser pour faire pivoter • Molette pour zoomer
      </div>
    </div>
  )
}
