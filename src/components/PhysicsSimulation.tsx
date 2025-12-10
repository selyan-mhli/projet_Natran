import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Cylinder, Sphere } from '@react-three/drei'
import { Physics, useBox, useCylinder, useSphere, usePlane } from '@react-three/cannon'
import { useEffect, useState, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

// Convoyeur
function Conveyor() {
  const [ref] = useBox(() => ({
    args: [3, 0.2, 20],
    position: [0, 1, 0],
    type: 'Static'
  }))
  
  return (
    <Box ref={ref as any} args={[3, 0.2, 20]} position={[0, 1, 0]}>
      <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.4} />
    </Box>
  )
}

// Sol
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0]
  }))
  
  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#3a3a3e" />
    </mesh>
  )
}

// Objet CSR avec physique
function CSRObject({ position, color }: { position: [number, number, number], color: string }) {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [0.5, 0.5, 0.5],
    velocity: [0, 0, 2] // Vitesse initiale vers l'avant
  }))
  
  return (
    <Box ref={ref as any} args={[0.5, 0.5, 0.5]} castShadow>
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
    </Box>
  )
}

// Bras robotique simple avec physique
function RoboticArm({ position, color }: { position: [number, number, number], color: string }) {
  // Base fixe
  const [baseRef] = useCylinder(() => ({
    args: [0.4, 0.5, 0.3, 16],
    position: [position[0], position[1], position[2]],
    type: 'Static'
  }))
  
  // Bras articulé
  const [armRef] = useCylinder(() => ({
    args: [0.15, 0.15, 2, 12],
    position: [position[0], position[1] + 1.5, position[2]],
    type: 'Kinematic'
  }))
  
  // Pince
  const [gripperRef] = useBox(() => ({
    args: [0.5, 0.2, 0.5],
    position: [position[0], position[1] + 2.8, position[2]],
    type: 'Kinematic'
  }))
  
  return (
    <group>
      <Cylinder ref={baseRef as any} args={[0.4, 0.5, 0.3, 16]}>
        <meshStandardMaterial color="#2a2a2e" metalness={0.9} roughness={0.3} />
      </Cylinder>
      
      <Cylinder ref={armRef as any} args={[0.15, 0.15, 2, 12]}>
        <meshStandardMaterial color="#3a3a3e" metalness={0.9} roughness={0.3} />
      </Cylinder>
      
      <Box ref={gripperRef as any} args={[0.5, 0.2, 0.5]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Box>
    </group>
  )
}

// Scène principale
function Scene({ objects }: { objects: Array<{ id: number, color: string }> }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <spotLight position={[-5, 15, 0]} angle={0.3} intensity={0.8} castShadow />
      <spotLight position={[5, 15, 0]} angle={0.3} intensity={0.8} castShadow />
      
      <Ground />
      <Conveyor />
      
      <RoboticArm position={[-2.5, 0, 0]} color="#22c55e" />
      <RoboticArm position={[2.5, 0, 0]} color="#ef4444" />
      
      {objects.map((obj) => (
        <CSRObject 
          key={obj.id} 
          position={[(Math.random() - 0.5) * 2, 3, -8]} 
          color={obj.color} 
        />
      ))}
      
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
      />
    </>
  )
}

export default function PhysicsSimulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [objects, setObjects] = useState<Array<{ id: number, color: string }>>([])
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0 })
  
  const colors = ['#ef4444', '#3b82f6', '#f59e0b', '#6b7280', '#92400e', '#8b5cf6']
  
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      if (objects.length < 10) {
        const newObj = {
          id: Date.now(),
          color: colors[Math.floor(Math.random() * colors.length)]
        }
        setObjects(prev => [...prev, newObj])
        setStats(prev => ({ ...prev, total: prev.total + 1 }))
      }
    }, 800)
    
    return () => clearInterval(interval)
  }, [isRunning, objects.length])
  
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
      
      {/* Canvas 3D */}
      <div className="relative bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden" style={{ height: '600px' }}>
        <Canvas
          shadows
          camera={{ position: [8, 6, 12], fov: 50 }}
        >
          <Physics gravity={[0, -9.81, 0]}>
            <Scene objects={objects} />
          </Physics>
        </Canvas>
        
        <div className="absolute bottom-4 left-4 glass-effect px-4 py-2 rounded-lg">
          <p className="text-xs text-slate-700">
            🖱️ Clic gauche: Rotation • Molette: Zoom • Physique réelle activée
          </p>
        </div>
      </div>
    </div>
  )
}
