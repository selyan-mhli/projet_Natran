import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box } from '@react-three/drei'
import { Play, Pause, RotateCcw } from 'lucide-react'
import type * as THREE from 'three'

interface CSRObject {
  id: number
  position: [number, number, number]
  type: string
  color: string
  emoji: string
  speed: number
  detected: boolean
  decision: 'accept' | 'reject' | null
  confidence: number
}

// Composant pour un objet CSR en 3D
function CSRItem({ obj }: { obj: CSRObject }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      // Rotation pour effet réaliste
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x += 0.005
    }
  })

  return (
    <group position={obj.position}>
      {/* Objet 3D */}
      <Box args={[0.8, 0.8, 0.8]} ref={meshRef}>
        <meshStandardMaterial 
          color={obj.color} 
          metalness={0.3}
          roughness={0.4}
          emissive={obj.detected ? obj.color : '#000000'}
          emissiveIntensity={obj.detected ? 0.5 : 0}
        />
      </Box>
      
      {/* Label au-dessus */}
      {obj.detected && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color={obj.decision === 'reject' ? '#ef4444' : '#22c55e'}
          anchorX="center"
          anchorY="middle"
        >
          {obj.type} • {(obj.confidence * 100).toFixed(0)}%
        </Text>
      )}
      
      {/* Décision */}
      {obj.decision && (
        <Text
          position={[1.5, 0, 0]}
          fontSize={0.5}
          color={obj.decision === 'reject' ? '#ef4444' : '#22c55e'}
          anchorX="center"
          anchorY="middle"
        >
          {obj.decision === 'reject' ? '✕' : '✓'}
        </Text>
      )}
    </group>
  )
}

// Convoyeur 3D
function Conveyor() {
  return (
    <group>
      {/* Bande principale */}
      <Box args={[3, 0.2, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
      </Box>
      
      {/* Bordures */}
      <Box args={[0.2, 0.4, 12]} position={[-1.6, 0.2, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[0.2, 0.4, 12]} position={[1.6, 0.2, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      
      {/* Zone de détection (ligne rouge) */}
      <Box args={[3.5, 0.05, 0.1]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </Box>
      
      {/* Grille au sol */}
      <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, -0.5, 0]} />
    </group>
  )
}

// Capteurs 3D
function Sensors() {
  return (
    <group>
      {/* Caméra RGB */}
      <group position={[-1.5, 3, 0]}>
        <Box args={[0.4, 0.3, 0.3]}>
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.3} />
        </Box>
        <Box args={[0.05, 2.5, 0.05]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#475569" />
        </Box>
        <Text position={[0, -0.5, 0]} fontSize={0.2} color="#60a5fa">RGB</Text>
      </group>
      
      {/* Caméra NIR */}
      <group position={[0, 3.5, 0]}>
        <Box args={[0.5, 0.4, 0.4]}>
          <meshStandardMaterial color="#6b21a8" emissive="#a855f7" emissiveIntensity={0.3} />
        </Box>
        <Box args={[0.05, 3, 0.05]} position={[0, -2, 0]}>
          <meshStandardMaterial color="#475569" />
        </Box>
        <Text position={[0, -0.6, 0]} fontSize={0.25} color="#c084fc">NIR</Text>
      </group>
      
      {/* Capteur Spectral */}
      <group position={[1.5, 3, 0]}>
        <Box args={[0.4, 0.3, 0.3]}>
          <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.3} />
        </Box>
        <Box args={[0.05, 2.5, 0.05]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#475569" />
        </Box>
        <Text position={[0, -0.5, 0]} fontSize={0.2} color="#4ade80">SPEC</Text>
      </group>
    </group>
  )
}

// Scène 3D principale
function Scene({ objects }: { objects: CSRObject[] }) {
  return (
    <>
      {/* Lumières */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#60a5fa" />
      
      {/* Convoyeur */}
      <Conveyor />
      
      {/* Capteurs */}
      <Sensors />
      
      {/* Objets CSR */}
      {objects.map(obj => (
        <CSRItem key={obj.id} obj={obj} />
      ))}
      
      {/* Contrôles caméra */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

export default function Simulation3D() {
  const [isRunning, setIsRunning] = useState(false)
  const [objects, setObjects] = useState<CSRObject[]>([])
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0
  })

  const materials = [
    { name: 'PVC', color: '#ef4444', emoji: '🧴', reject: true, confidence: 0.95 },
    { name: 'PE/PP', color: '#3b82f6', emoji: '🛍️', reject: false, confidence: 0.92 },
    { name: 'Papier', color: '#f59e0b', emoji: '📦', reject: false, confidence: 0.89 },
    { name: 'Métaux', color: '#6b7280', emoji: '🥫', reject: true, confidence: 0.97 },
    { name: 'Bois', color: '#92400e', emoji: '🪵', reject: false, confidence: 0.88 },
    { name: 'Textile', color: '#8b5cf6', emoji: '👕', reject: false, confidence: 0.85 }
  ]

  useEffect(() => {
    if (!isRunning) return

    // Génération d'objets
    const generateInterval = setInterval(() => {
      const material = materials[Math.floor(Math.random() * materials.length)]
      const newObj: CSRObject = {
        id: Date.now() + Math.random(),
        position: [Math.random() * 2 - 1, 1, -6],
        type: material.name,
        color: material.color,
        emoji: material.emoji,
        speed: 0.03 + Math.random() * 0.02,
        detected: false,
        decision: null,
        confidence: material.confidence + (Math.random() * 0.1 - 0.05)
      }
      setObjects(prev => [...prev, newObj])
    }, 1000)

    // Animation des objets
    const animationInterval = setInterval(() => {
      setObjects(prev => {
        return prev.map(obj => {
          const newZ = obj.position[2] + obj.speed
          const newObj = { ...obj, position: [obj.position[0], obj.position[1], newZ] as [number, number, number] }
          
          // Détection dans la zone
          if (newZ > -0.5 && newZ < 0.5 && !obj.detected) {
            newObj.detected = true
            const isReject = materials.find(m => m.name === obj.type)?.reject || false
            newObj.decision = isReject ? 'reject' : 'accept'
            
            setStats(s => ({
              total: s.total + 1,
              accepted: s.accepted + (isReject ? 0 : 1),
              rejected: s.rejected + (isReject ? 1 : 0)
            }))
          }
          
          return newObj
        }).filter(obj => obj.position[2] < 6)
      })
    }, 50)

    return () => {
      clearInterval(generateInterval)
      clearInterval(animationInterval)
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
    setObjects([])
    setStats({ total: 0, accepted: 0, rejected: 0 })
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setObjects([])
    setStats({ total: 0, accepted: 0, rejected: 0 })
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Total Détecté</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Accepté</p>
          <p className="text-3xl font-bold text-green-400">{stats.accepted}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Rejeté</p>
          <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Play className="w-5 h-5" />
            Démarrer la Simulation 3D
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <Pause className="w-5 h-5" />
            Arrêter
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Réinitialiser
        </button>
      </div>

      {/* Canvas 3D */}
      <div className="relative bg-slate-950 rounded-xl border-2 border-slate-700 overflow-hidden" style={{ height: '600px' }}>
        <Canvas
          camera={{ position: [0, 8, 12], fov: 50 }}
          shadows
        >
          <Scene objects={objects} />
        </Canvas>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 glass-effect px-4 py-2 rounded-lg">
          <p className="text-xs text-slate-300">🖱️ Clic gauche: Rotation • Molette: Zoom • Clic droit: Déplacement</p>
        </div>
      </div>
    </div>
  )
}
