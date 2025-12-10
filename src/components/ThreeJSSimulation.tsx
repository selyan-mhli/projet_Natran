import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface Stats {
  total: number
  accepted: number
  rejected: number
  avgConfidence: number
  chloreLevel: number
  pciValue: number
}

export default function ThreeJSSimulation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const objectsRef = useRef<THREE.Mesh[]>([])
  const armsRef = useRef<THREE.Group[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    accepted: 0,
    rejected: 0,
    avgConfidence: 0,
    chloreLevel: 1.2,
    pciValue: 18.5
  })

  const materials = [
    { name: 'PVC', color: 0xef4444, reject: true, confidence: 0.94, emoji: '🧴' },
    { name: 'PE/PP', color: 0x3b82f6, reject: false, confidence: 0.96, emoji: '🛍️' },
    { name: 'Papier', color: 0xf59e0b, reject: false, confidence: 0.92, emoji: '📦' },
    { name: 'Métaux', color: 0x6b7280, reject: true, confidence: 0.98, emoji: '🥫' },
    { name: 'Bois', color: 0x92400e, reject: false, confidence: 0.91, emoji: '🪵' },
    { name: 'Textile', color: 0x8b5cf6, reject: false, confidence: 0.89, emoji: '👕' }
  ]

  useEffect(() => {
    if (!containerRef.current) return

    // SCENE
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f7)
    scene.fog = new THREE.Fog(0xf5f5f7, 20, 50)
    sceneRef.current = scene

    // CAMERA (vue rapprochée)
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(8, 6, 12)
    camera.lookAt(0, 2, 0)
    cameraRef.current = camera

    // RENDERER avec anti-aliasing et ombres
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 8
    controls.maxDistance = 40
    controls.maxPolarAngle = Math.PI / 2
    controlsRef.current = controls

    // LUMIÈRES PROFESSIONNELLES
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(10, 20, 10)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    mainLight.shadow.camera.near = 0.5
    mainLight.shadow.camera.far = 50
    mainLight.shadow.camera.left = -15
    mainLight.shadow.camera.right = 15
    mainLight.shadow.camera.top = 15
    mainLight.shadow.camera.bottom = -15
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
    fillLight.position.set(-10, 10, -10)
    scene.add(fillLight)

    // SPOTS INDUSTRIELS
    const spotLight1 = new THREE.SpotLight(0xfff5e1, 0.8)
    spotLight1.position.set(-5, 12, 0)
    spotLight1.angle = Math.PI / 6
    spotLight1.penumbra = 0.3
    spotLight1.castShadow = true
    scene.add(spotLight1)

    const spotLight2 = new THREE.SpotLight(0xfff5e1, 0.8)
    spotLight2.position.set(5, 12, 0)
    spotLight2.angle = Math.PI / 6
    spotLight2.penumbra = 0.3
    scene.add(spotLight2)

    // SOL INDUSTRIEL
    const groundGeometry = new THREE.PlaneGeometry(30, 30)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3e,
      roughness: 0.7,
      metalness: 0.3
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    scene.add(ground)

    // GRILLE
    const gridHelper = new THREE.GridHelper(30, 30, 0x555555, 0x444444)
    gridHelper.position.y = 0.01
    scene.add(gridHelper)

    // CONVOYEUR SURÉLEVÉ
    const beltGeometry = new THREE.BoxGeometry(2.5, 0.15, 18)
    const beltMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1e,
      roughness: 0.6,
      metalness: 0.8
    })
    const belt = new THREE.Mesh(beltGeometry, beltMaterial)
    belt.position.set(0, 2, 0)
    belt.castShadow = true
    belt.receiveShadow = true
    scene.add(belt)

    // Bordures
    const sideGeometry = new THREE.BoxGeometry(0.12, 0.3, 18)
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3e,
      roughness: 0.4,
      metalness: 0.9
    })
    
    const sideLeft = new THREE.Mesh(sideGeometry, sideMaterial)
    sideLeft.position.set(-1.31, 2.15, 0)
    sideLeft.castShadow = true
    scene.add(sideLeft)

    const sideRight = new THREE.Mesh(sideGeometry, sideMaterial)
    sideRight.position.set(1.31, 2.15, 0)
    sideRight.castShadow = true
    scene.add(sideRight)
    
    // Supports du convoyeur (4 pieds)
    const supportGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 12)
    const supportMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2e,
      roughness: 0.5,
      metalness: 0.9
    })
    
    const supportPositions = [
      [-1, 1, -7],
      [1, 1, -7],
      [-1, 1, 7],
      [1, 1, 7]
    ]
    
    supportPositions.forEach(pos => {
      const support = new THREE.Mesh(supportGeometry, supportMaterial)
      support.position.set(pos[0], pos[1], pos[2])
      support.castShadow = true
      scene.add(support)
    })

    // PORTIQUE AVEC CAMÉRAS
    const portiqueGeometry = new THREE.BoxGeometry(0.15, 4, 0.15)
    const portiqueMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2e,
      roughness: 0.4,
      metalness: 0.9
    })
    
    // Poteaux du portique
    const portiqueLeft = new THREE.Mesh(portiqueGeometry, portiqueMaterial)
    portiqueLeft.position.set(-2, 4, 0)
    portiqueLeft.castShadow = true
    scene.add(portiqueLeft)
    
    const portiqueRight = new THREE.Mesh(portiqueGeometry, portiqueMaterial)
    portiqueRight.position.set(2, 4, 0)
    portiqueRight.castShadow = true
    scene.add(portiqueRight)
    
    // Barre horizontale
    const barreGeometry = new THREE.BoxGeometry(4.3, 0.15, 0.15)
    const barre = new THREE.Mesh(barreGeometry, portiqueMaterial)
    barre.position.set(0, 6, 0)
    barre.castShadow = true
    scene.add(barre)
    
    // CAMÉRAS SUSPENDUES
    const createCamera = (x: number) => {
      const cameraGroup = new THREE.Group()
      
      // Support vertical
      const supportGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8)
      const supportMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1e,
        roughness: 0.3,
        metalness: 0.9
      })
      const support = new THREE.Mesh(supportGeometry, supportMaterial)
      support.position.set(0, -0.6, 0)
      cameraGroup.add(support)
      
      // Corps caméra
      const bodyGeometry = new THREE.BoxGeometry(0.25, 0.3, 0.4)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0e,
        roughness: 0.2,
        metalness: 0.95
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, -1.3, 0)
      body.castShadow = true
      cameraGroup.add(body)
      
      // Lentille
      const lensGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16)
      const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.05,
        metalness: 1,
        emissive: 0x0033ff,
        emissiveIntensity: 0.3
      })
      const lens = new THREE.Mesh(lensGeometry, lensMaterial)
      lens.rotation.x = Math.PI / 2
      lens.position.set(0, -1.3, 0.25)
      cameraGroup.add(lens)
      
      cameraGroup.position.set(x, 6, 0)
      scene.add(cameraGroup)
    }
    
    createCamera(-1.2)
    createCamera(0)
    createCamera(1.2)

    // ZONE DE DÉTECTION LUMINEUSE
    const detectionGeometry = new THREE.PlaneGeometry(2.5, 1.5)
    const detectionMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      emissive: 0xff0000,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.4
    })
    const detectionZone = new THREE.Mesh(detectionGeometry, detectionMaterial)
    detectionZone.rotation.x = -Math.PI / 2
    detectionZone.position.set(0, 2.08, 0)
    scene.add(detectionZone)

    // BRAS ROBOTIQUES GÉANTS ET VISIBLES
    const createRoboticArm = (x: number, z: number, color: number) => {
      const armGroup = new THREE.Group()
      
      // BASE ÉNORME
      const baseGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.4, 20)
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2e,
        roughness: 0.3,
        metalness: 0.95
      })
      const base = new THREE.Mesh(baseGeometry, baseMaterial)
      base.castShadow = true
      armGroup.add(base)
      
      // ARTICULATION 1 GROSSE
      const joint1Geometry = new THREE.SphereGeometry(0.35, 20, 20)
      const joint1Material = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        roughness: 0.2,
        metalness: 0.95,
        emissive: 0xff3300,
        emissiveIntensity: 0.3
      })
      const joint1 = new THREE.Mesh(joint1Geometry, joint1Material)
      joint1.position.set(0, 0.5, 0)
      joint1.castShadow = true
      armGroup.add(joint1)
      
      // BRAS 1 GROS
      const arm1Geometry = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16)
      const arm1Material = new THREE.MeshStandardMaterial({
        color: 0x3a3a3e,
        roughness: 0.3,
        metalness: 0.9
      })
      const arm1 = new THREE.Mesh(arm1Geometry, arm1Material)
      arm1.position.set(0, 1.75, 0)
      arm1.castShadow = true
      armGroup.add(arm1)
      
      // ARTICULATION 2 GROSSE
      const joint2 = new THREE.Mesh(joint1Geometry, joint1Material)
      joint2.position.set(0, 3, 0)
      joint2.castShadow = true
      armGroup.add(joint2)
      
      // BRAS 2 GROS
      const arm2 = new THREE.Mesh(arm1Geometry, arm1Material)
      arm2.position.set(0, 4.25, 0)
      arm2.castShadow = true
      armGroup.add(arm2)
      
      // PINCE ÉNORME COLORÉE
      const gripperGeometry = new THREE.BoxGeometry(0.7, 0.25, 0.8)
      const gripperMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.6
      })
      const gripper = new THREE.Mesh(gripperGeometry, gripperMaterial)
      gripper.position.set(0, 5.5, 0)
      gripper.castShadow = true
      armGroup.add(gripper)
      
      // DOIGTS GROS
      const fingerGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.6)
      const fingerLeft = new THREE.Mesh(fingerGeometry, gripperMaterial)
      fingerLeft.position.set(-0.3, 5.4, 0)
      fingerLeft.castShadow = true
      armGroup.add(fingerLeft)
      
      const fingerRight = new THREE.Mesh(fingerGeometry, gripperMaterial)
      fingerRight.position.set(0.3, 5.4, 0)
      fingerRight.castShadow = true
      armGroup.add(fingerRight)
      
      armGroup.position.set(x, 0, z)
      scene.add(armGroup)
      return armGroup
    }
    
    // BRAS SUR LES CÔTÉS DU CONVOYEUR
    const armLeft = createRoboticArm(-3.5, 0, 0x22c55e)  // Vert - GAUCHE
    const armRight = createRoboticArm(3.5, 0, 0xef4444)   // Rouge - DROITE
    armsRef.current = [armLeft, armRight]
    
    // BACS DE COLLECTE
    const createBin = (x: number, z: number, color: number, label: string) => {
      const binGeometry = new THREE.BoxGeometry(1.8, 1.2, 1.8)
      const binMaterial = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        roughness: 0.3,
        metalness: 0.3
      })
      const bin = new THREE.Mesh(binGeometry, binMaterial)
      bin.position.set(x, 1.1, z)
      bin.castShadow = true
      bin.receiveShadow = true
      scene.add(bin)

      // Bordure épaisse
      const edgesGeometry = new THREE.EdgesGeometry(binGeometry)
      const edgesMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: 4 })
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
      bin.add(edges)
      
      // Panneau au-dessus
      const panelGeometry = new THREE.PlaneGeometry(1.5, 0.4)
      const panelMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5
      })
      const panel = new THREE.Mesh(panelGeometry, panelMaterial)
      panel.position.set(x, 2.5, z)
      panel.rotation.y = Math.PI / 4
      scene.add(panel)
    }

    createBin(-4.5, 5, 0x22c55e, 'CONFORMES')
    createBin(4.5, 5, 0xef4444, 'NON-CONFORMES')

    // ANIMATION LOOP
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // Animer les bras (rotation et mouvement)
      armsRef.current.forEach((arm, index) => {
        const time = Date.now() * 0.001
        const side = index === 0 ? -1 : 1
        
        // Rotation de la base
        if (arm.children[0]) {
          arm.children[0].rotation.y = Math.sin(time + index) * 0.3
        }
        
        // Mouvement du bras 1
        if (arm.children[2]) {
          arm.children[2].rotation.z = Math.sin(time * 1.5 + index) * 0.2 * side
        }
        
        // Mouvement du bras 2
        if (arm.children[4]) {
          arm.children[4].rotation.z = Math.sin(time * 2 + index) * 0.15 * side
        }
        
        // Mouvement de la pince
        if (arm.children[5]) {
          arm.children[5].rotation.x = Math.sin(time * 3 + index) * 0.1
        }
        
        // Ouverture/fermeture des doigts
        if (arm.children[6] && arm.children[7]) {
          const openClose = Math.sin(time * 2 + index) * 0.15
          arm.children[6].position.x = -0.3 - openClose
          arm.children[7].position.x = 0.3 + openClose
        }
      })
      
      // Animer les objets (PLUS RAPIDE)
      objectsRef.current.forEach((obj, index) => {
        obj.position.z += 0.08 // Plus rapide
        obj.rotation.x += 0.03
        obj.rotation.y += 0.035
        obj.rotation.z += 0.025
        
        // Détection et capture par les bras
        if (obj.position.z > -1 && obj.position.z < 1) {
          armsRef.current.forEach((arm, armIndex) => {
            const armX = armIndex === 0 ? -3.5 : 3.5
            const distance = Math.abs(obj.position.x - armX)
            
            if (distance < 2) {
              // L'objet est proche du bras, on le fait "disparaître"
              obj.scale.multiplyScalar(0.95)
              
              if (obj.scale.x < 0.1) {
                scene.remove(obj)
                objectsRef.current.splice(index, 1)
              }
            }
          })
        }

        // Supprimer si hors de vue
        if (obj.position.z > 11) {
          scene.remove(obj)
          objectsRef.current.splice(index, 1)
        }
      })

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // RESIZE
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [])

  // GÉNÉRATION D'OBJETS (PLUS RAPIDE)
  useEffect(() => {
    if (!isRunning || !sceneRef.current) return

    const interval = setInterval(() => {
      if (objectsRef.current.length >= 12) return // Plus d'objets simultanés

      const material = materials[Math.floor(Math.random() * materials.length)]
      
      const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
      const meshMaterial = new THREE.MeshStandardMaterial({
        color: material.color,
        roughness: 0.4,
        metalness: 0.6
      })
      
      const mesh = new THREE.Mesh(geometry, meshMaterial)
      mesh.position.set(
        (Math.random() - 0.5) * 1.8,
        2.5,
        -10
      )
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      sceneRef.current!.add(mesh)
      objectsRef.current.push(mesh)

      // Stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        accepted: prev.accepted + (material.reject ? 0 : 1),
        rejected: prev.rejected + (material.reject ? 1 : 0),
        avgConfidence: (prev.avgConfidence * prev.total + material.confidence) / (prev.total + 1)
      }))
    }, 600) // BEAUCOUP PLUS RAPIDE (au lieu de 1500ms)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    objectsRef.current.forEach(obj => sceneRef.current?.remove(obj))
    objectsRef.current = []
    setStats({
      total: 0,
      accepted: 0,
      rejected: 0,
      avgConfidence: 0,
      chloreLevel: 1.2,
      pciValue: 18.5
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Total</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Conformes</p>
          <p className="text-3xl font-bold text-green-400">{stats.accepted}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Non-conformes</p>
          <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Confiance</p>
          <p className="text-2xl font-bold text-blue-400">{(stats.avgConfidence * 100).toFixed(1)}%</p>
        </div>
        <div className="glass-effect p-4 rounded-lg">
          <p className="text-sm text-slate-400">Chlore</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.chloreLevel.toFixed(2)}%</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Play className="w-5 h-5" />
            Démarrer
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

      {/* Canvas */}
      <div 
        ref={containerRef} 
        className="relative bg-slate-950 rounded-xl border-2 border-slate-700 overflow-hidden"
        style={{ height: '600px' }}
      >
        <div className="absolute bottom-4 left-4 glass-effect px-4 py-2 rounded-lg z-10">
          <p className="text-xs text-slate-300">
            🖱️ Clic gauche: Rotation • Molette: Zoom • Clic droit: Déplacement
          </p>
        </div>
      </div>
    </div>
  )
}
