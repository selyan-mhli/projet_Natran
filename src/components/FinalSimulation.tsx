import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Eye } from 'lucide-react'
import * as BABYLON from '@babylonjs/core'
import Dashboard from './Dashboard'
import { useSimulation } from '../context/SimulationContext'

interface CSRObject {
  mesh: BABYLON.Mesh
  type: string
  decision: 'accept' | 'reject' | 'uncertain'
  color: BABYLON.Color3
  isBeingGrabbed: boolean
}

export default function FinalSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<BABYLON.Engine | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null)
  const objectsRef = useRef<CSRObject[]>([])
  const armsRef = useRef<{ pivot: BABYLON.TransformNode, arm: BABYLON.Mesh, gripper: BABYLON.Mesh, side: string, isBusy: boolean, heldObject: BABYLON.Mesh | null }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [fps, setFps] = useState(60)
  
  // Utiliser le contexte global pour les stats
  const { stats, updateStats, resetStats } = useSimulation()

  const materials = [
    { name: 'PVC', color: new BABYLON.Color3(0.93, 0.26, 0.26), decision: 'reject' as const },
    { name: 'PE/PP', color: new BABYLON.Color3(0.23, 0.51, 0.96), decision: 'accept' as const },
    { name: 'Papier', color: new BABYLON.Color3(0.96, 0.62, 0.05), decision: 'accept' as const },
    { name: 'Métaux', color: new BABYLON.Color3(0.42, 0.45, 0.50), decision: 'reject' as const },
    { name: 'Bois', color: new BABYLON.Color3(0.57, 0.25, 0.05), decision: 'accept' as const },
    { name: 'Incertain', color: new BABYLON.Color3(0.5, 0.5, 0.5), decision: 'uncertain' as const }
  ]
  
  // Fonction d'animation de pivot (rotation)
  const animatePivot = (node: BABYLON.TransformNode, axis: 'x' | 'y' | 'z', targetAngle: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const startAngle = node.rotation[axis]
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing smooth
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        node.rotation[axis] = startAngle + (targetAngle - startAngle) * eased
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      animate()
    })
  }

  useEffect(() => {
    if (!canvasRef.current) return

    // ENGINE
    const engine = new BABYLON.Engine(canvasRef.current, true)
    engineRef.current = engine

    // SCENE avec fond noir
    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0.15, 0.15, 0.18, 1)
    sceneRef.current = scene

    // CAMERA
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      25,
      new BABYLON.Vector3(0, 2, 0),
      scene
    )
    camera.attachControl(canvasRef.current, true)
    camera.lowerRadiusLimit = 10
    camera.upperRadiusLimit = 40
    cameraRef.current = camera

    // LUMIÈRES
    const hemiLight = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene)
    hemiLight.intensity = 0.5

    const mainLight = new BABYLON.DirectionalLight('main', new BABYLON.Vector3(-1, -2, -1), scene)
    mainLight.position = new BABYLON.Vector3(10, 20, 10)
    mainLight.intensity = 1

    // Spots industriels
    const spot1 = new BABYLON.SpotLight('spot1', new BABYLON.Vector3(-3, 8, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 4, 2, scene)
    spot1.intensity = 0.8
    spot1.diffuse = new BABYLON.Color3(1, 0.95, 0.8)

    const spot2 = new BABYLON.SpotLight('spot2', new BABYLON.Vector3(3, 8, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 4, 2, scene)
    spot2.intensity = 0.8
    spot2.diffuse = new BABYLON.Color3(1, 0.95, 0.8)

    // SOL
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene)
    const groundMat = new BABYLON.StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.22)
    ground.material = groundMat

    // CONVOYEUR AU NIVEAU DU SOL
    const conveyor = BABYLON.MeshBuilder.CreateBox('conveyor', { width: 3, height: 0.2, depth: 20 }, scene)
    conveyor.position.y = 0.1 // Juste au-dessus du sol
    const conveyorMat = new BABYLON.StandardMaterial('conveyorMat', scene)
    conveyorMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.12)
    conveyorMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    conveyor.material = conveyorMat

    // Bordures convoyeur
    const sideMat = new BABYLON.StandardMaterial('sideMat', scene)
    sideMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32)
    
    const sideLeft = BABYLON.MeshBuilder.CreateBox('sideL', { width: 0.15, height: 0.4, depth: 20 }, scene)
    sideLeft.position = new BABYLON.Vector3(-1.575, 0.3, 0)
    sideLeft.material = sideMat

    const sideRight = BABYLON.MeshBuilder.CreateBox('sideR', { width: 0.15, height: 0.4, depth: 20 }, scene)
    sideRight.position = new BABYLON.Vector3(1.575, 0.3, 0)
    sideRight.material = sideMat

    // CAMÉRA CCTV RÉALISTE (PLUS GROSSE)
    const createCCTV = (x: number, z: number) => {
      const cctvGroup = new BABYLON.TransformNode('cctv', scene)
      
      // Support plus épais
      const support = BABYLON.MeshBuilder.CreateCylinder('support', { diameter: 0.15, height: 2 }, scene)
      support.position = new BABYLON.Vector3(x, 6, z)
      support.parent = cctvGroup
      const supportMat = new BABYLON.StandardMaterial('supportMat', scene)
      supportMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15)
      supportMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5)
      support.material = supportMat

      // Corps de caméra plus gros
      const body = BABYLON.MeshBuilder.CreateBox('body', { width: 0.8, height: 0.6, depth: 1.2 }, scene)
      body.position = new BABYLON.Vector3(x, 5, z)
      body.rotation.x = -Math.PI / 6
      body.parent = cctvGroup
      const bodyMat = new BABYLON.StandardMaterial('bodyMat', scene)
      bodyMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05)
      bodyMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
      body.material = bodyMat

      // Lentille plus grosse
      const lens = BABYLON.MeshBuilder.CreateCylinder('lens', { diameter: 0.4, height: 0.3 }, scene)
      lens.position = new BABYLON.Vector3(x, 4.8, z + 0.7)
      lens.rotation.x = Math.PI / 2
      lens.parent = cctvGroup
      const lensMat = new BABYLON.StandardMaterial('lensMat', scene)
      lensMat.diffuseColor = new BABYLON.Color3(0, 0, 0)
      lensMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0.6)
      lensMat.specularColor = new BABYLON.Color3(1, 1, 1)
      lens.material = lensMat
      
      // LED rouge d'enregistrement
      const led = BABYLON.MeshBuilder.CreateSphere('led', { diameter: 0.1 }, scene)
      led.position = new BABYLON.Vector3(x - 0.3, 5.2, z)
      led.parent = cctvGroup
      const ledMat = new BABYLON.StandardMaterial('ledMat', scene)
      ledMat.emissiveColor = new BABYLON.Color3(1, 0, 0)
      led.material = ledMat

      return cctvGroup
    }

    createCCTV(0, -2)

    // BRAS ROBOTIQUES SIMPLES QUI BOUGENT
    const createSimpleArm = (x: number, z: number, color: BABYLON.Color3, side: string) => {
      // Pivot pour rotation
      const pivot = new BABYLON.TransformNode('armPivot_' + side + z, scene)
      pivot.position = new BABYLON.Vector3(x, 0, z)
      
      // Base
      const base = BABYLON.MeshBuilder.CreateCylinder('base', { diameter: 0.8, height: 0.3 }, scene)
      base.position = new BABYLON.Vector3(0, 0.15, 0)
      base.parent = pivot
      const baseMat = new BABYLON.StandardMaterial('baseMat', scene)
      baseMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2)
      base.material = baseMat
      
      // Bras principal
      const arm = BABYLON.MeshBuilder.CreateBox('arm', { width: 0.2, height: 0.2, depth: 2.5 }, scene)
      arm.position = new BABYLON.Vector3(0, 0.5, 1.25)
      arm.parent = pivot
      const armMat = new BABYLON.StandardMaterial('armMat', scene)
      armMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3)
      arm.material = armMat
      
      // Pince
      const gripper = BABYLON.MeshBuilder.CreateBox('gripper', { width: 0.4, height: 0.15, depth: 0.3 }, scene)
      gripper.position = new BABYLON.Vector3(0, 0.5, 2.5)
      gripper.parent = pivot
      const gripperMat = new BABYLON.StandardMaterial('gripperMat', scene)
      gripperMat.diffuseColor = color
      gripperMat.emissiveColor = color.scale(0.3)
      gripper.material = gripperMat
      
      return { pivot, arm, gripper, side, isBusy: false, heldObject: null as BABYLON.Mesh | null }
    }
    
    // Créer 2 bras de chaque côté
    const armLeft1 = createSimpleArm(-3, 1, new BABYLON.Color3(0.2, 0.8, 0.3), 'left')
    const armLeft2 = createSimpleArm(-3, 3, new BABYLON.Color3(0.2, 0.8, 0.3), 'left')
    const armRight1 = createSimpleArm(3, 1, new BABYLON.Color3(0.9, 0.2, 0.2), 'right')
    const armRight2 = createSimpleArm(3, 3, new BABYLON.Color3(0.9, 0.2, 0.2), 'right')
    
    armsRef.current = [armLeft1, armLeft2, armRight1, armRight2]
    
    // Orienter les bras vers le convoyeur
    // Gauche (vert) : rotation 0 = pointe vers +Z, donc vers le convoyeur
    // Droite (rouge) : rotation π = pointe vers -Z, donc vers le convoyeur
    armLeft1.pivot.rotation.y = 0
    armLeft2.pivot.rotation.y = 0
    armRight1.pivot.rotation.y = Math.PI
    armRight2.pivot.rotation.y = Math.PI

    // BACS OUVERTS (sans couvercle)
    const createBin = (x: number, z: number, color: BABYLON.Color3, label: string) => {
      const binGroup = new BABYLON.TransformNode('binGroup' + label, scene)
      
      const wallThickness = 0.1
      const binWidth = 2
      const binHeight = 1.5
      const binDepth = 2
      
      // Fond
      const bottom = BABYLON.MeshBuilder.CreateBox('bottom', { 
        width: binWidth, 
        height: wallThickness, 
        depth: binDepth 
      }, scene)
      bottom.position = new BABYLON.Vector3(x, 0.05, z)
      const binMat = new BABYLON.StandardMaterial('binMat' + label, scene)
      binMat.diffuseColor = color
      binMat.alpha = 0.4
      bottom.material = binMat
      
      // Mur gauche
      const leftWall = BABYLON.MeshBuilder.CreateBox('leftWall', { 
        width: wallThickness, 
        height: binHeight, 
        depth: binDepth 
      }, scene)
      leftWall.position = new BABYLON.Vector3(x - binWidth/2, 0.05 + binHeight/2, z)
      leftWall.material = binMat
      
      // Mur droit
      const rightWall = BABYLON.MeshBuilder.CreateBox('rightWall', { 
        width: wallThickness, 
        height: binHeight, 
        depth: binDepth 
      }, scene)
      rightWall.position = new BABYLON.Vector3(x + binWidth/2, 0.05 + binHeight/2, z)
      rightWall.material = binMat
      
      // Mur arrière
      const backWall = BABYLON.MeshBuilder.CreateBox('backWall', { 
        width: binWidth, 
        height: binHeight, 
        depth: wallThickness 
      }, scene)
      backWall.position = new BABYLON.Vector3(x, 0.05 + binHeight/2, z - binDepth/2)
      backWall.material = binMat
      
      // Mur avant
      const frontWall = BABYLON.MeshBuilder.CreateBox('frontWall', { 
        width: binWidth, 
        height: binHeight, 
        depth: wallThickness 
      }, scene)
      frontWall.position = new BABYLON.Vector3(x, 0.05 + binHeight/2, z + binDepth/2)
      frontWall.material = binMat
      
      // Bordures lumineuses
      const edgeMat = new BABYLON.StandardMaterial('edgeMat' + label, scene)
      edgeMat.emissiveColor = color
      edgeMat.wireframe = true
      
      const edges = BABYLON.MeshBuilder.CreateBox('edges', { 
        width: binWidth + 0.2, 
        height: binHeight + 0.2, 
        depth: binDepth + 0.2 
      }, scene)
      edges.position = new BABYLON.Vector3(x, 0.05 + binHeight/2, z)
      edges.material = edgeMat
      
      // Label au-dessus
      const labelPlane = BABYLON.MeshBuilder.CreatePlane('label', { width: 1.5, height: 0.3 }, scene)
      labelPlane.position = new BABYLON.Vector3(x, 0.05 + binHeight + 0.5, z)
      const labelMat = new BABYLON.StandardMaterial('labelMat' + label, scene)
      labelMat.diffuseColor = color
      labelMat.emissiveColor = color.scale(0.5)
      labelPlane.material = labelMat
    }

    createBin(-5, 5, new BABYLON.Color3(0.2, 0.8, 0.3), 'Conformes')
    createBin(5, 5, new BABYLON.Color3(0.9, 0.2, 0.2), 'Non-conformes')
    createBin(0, 12, new BABYLON.Color3(0.5, 0.5, 0.5), 'Incertains')

    // ZONE DE TRI
    const sortZone = BABYLON.MeshBuilder.CreatePlane('sortZone', { width: 3, height: 0.1 }, scene)
    sortZone.position = new BABYLON.Vector3(0, 0.21, 2)
    sortZone.rotation.x = Math.PI / 2
    const sortMat = new BABYLON.StandardMaterial('sortMat', scene)
    sortMat.diffuseColor = new BABYLON.Color3(1, 0, 0)
    sortMat.emissiveColor = new BABYLON.Color3(0.5, 0, 0)
    sortMat.alpha = 0.7
    sortZone.material = sortMat

    // RENDER LOOP avec FPS
    let lastTime = performance.now()
    let frameCount = 0
    engine.runRenderLoop(() => {
      scene.render()
      
      // Calculer FPS
      frameCount++
      const currentTime = performance.now()
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
      }
    })

    // RESIZE
    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      engine.dispose()
    }
  }, [])

  // GÉNÉRATION D'OBJETS
  useEffect(() => {
    if (!isRunning || !sceneRef.current) return

    const interval = setInterval(() => {
      if (objectsRef.current.length >= 6) return // Plus d'objets simultanés

      const scene = sceneRef.current!
      const count = Math.random() > 0.5 ? 2 : 3
      
      for (let i = 0; i < count; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)]
        
        const mesh = BABYLON.MeshBuilder.CreateBox(`csr_${Date.now()}_${i}`, { size: 0.5 }, scene)
        // Poser les cubes SUR le tapis (y = hauteur du tapis + moitié du cube)
        mesh.position = new BABYLON.Vector3((i - 1) * 0.8, 0.45, -10)
        
        const mat = new BABYLON.StandardMaterial(`mat_${Date.now()}_${i}`, scene)
        mat.diffuseColor = material.color
        mat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5)
        mesh.material = mat

        objectsRef.current.push({
          mesh,
          type: material.name,
          decision: material.decision,
          color: material.color,
          isBeingGrabbed: false
        })

        updateStats({
          total: stats.total + 1,
          accepted: stats.accepted + (material.decision === 'accept' ? 1 : 0),
          rejected: stats.rejected + (material.decision === 'reject' ? 1 : 0),
          uncertain: stats.uncertain + (material.decision === 'uncertain' ? 1 : 0)
        })
      }
    }, 1000) // Toutes les secondes au lieu de 3

    return () => clearInterval(interval)
  }, [isRunning, materials])

  // MOUVEMENT DES OBJETS ET DÉTECTION
  useEffect(() => {
    if (!isRunning || !sceneRef.current) return

    // Constantes de configuration
    const CONVEYOR_SPEED = 0.05        // Vitesse du tapis (unités/frame)
    const ARM_LENGTH = 2.5             // Longueur du bras
    const GRAB_DISTANCE = 0.5          // Distance max pour attraper
    const REACTION_TIME = 0.3          // Temps de réaction en secondes (pour prédiction)

    const interval = setInterval(() => {
      objectsRef.current.forEach((obj, index) => {
        // Les objets avancent sur le tapis
        if (!obj.isBeingGrabbed) {
          obj.mesh.position.z += CONVEYOR_SPEED
        }

        // DÉTECTION DANS LA ZONE DE TRI
        if (obj.mesh.position.z > 0 && obj.mesh.position.z < 4 && !obj.isBeingGrabbed) {
          const targetSide = obj.decision === 'accept' ? 'left' : obj.decision === 'reject' ? 'right' : null
          
          if (targetSide) {
            // Prédiction de la position future du cube
            const predictedZ = obj.mesh.position.z + CONVEYOR_SPEED * (REACTION_TIME * 30)
            
            // Trouver un bras libre du bon côté, proche de la position prédite
            const availableArm = armsRef.current.find(arm => 
              arm.side === targetSide && 
              !arm.isBusy && 
              Math.abs(arm.pivot.position.z - predictedZ) < 2.5
            )
            
            if (availableArm) {
              obj.isBeingGrabbed = true
              availableArm.isBusy = true
              availableArm.heldObject = obj.mesh
              
              const binPos = targetSide === 'left' 
                ? new BABYLON.Vector3(-5, 0.5, 5) 
                : new BABYLON.Vector3(5, 0.5, 5)
              
              // Animation dynamique du bras
              const animateArmAndCube = async () => {
                const armPos = availableArm.pivot.position
                const restAngle = targetSide === 'left' ? 0 : Math.PI
                
                try {
                  // 1. VISER LE CUBE - Calculer l'angle vers la position actuelle du cube
                  const dx = obj.mesh.position.x - armPos.x
                  const dz = obj.mesh.position.z - armPos.z
                  const targetAngle = Math.atan2(dx, dz)
                  
                  // 2. TOURNER VERS LE CUBE
                  await animatePivot(availableArm.pivot, 'y', targetAngle, 0.25)
                  
                  // 3. DESCENDRE - Incliner le bras vers le bas pour attraper
                  await animatePivot(availableArm.pivot, 'x', -0.25, 0.15)
                  
                  // 4. ATTRAPER - Attacher le cube au gripper
                  obj.mesh.parent = availableArm.gripper
                  obj.mesh.position = new BABYLON.Vector3(0, -0.35, 0)
                  
                  // 5. REMONTER
                  await animatePivot(availableArm.pivot, 'x', 0, 0.15)
                  
                  // 6. CALCULER L'ANGLE VERS LE BAC
                  const binDx = binPos.x - armPos.x
                  const binDz = binPos.z - armPos.z
                  const binAngle = Math.atan2(binDx, binDz)
                  
                  // 7. TOURNER VERS LE BAC
                  await animatePivot(availableArm.pivot, 'y', binAngle, 0.4)
                  
                  // 8. DESCENDRE POUR LÂCHER
                  await animatePivot(availableArm.pivot, 'x', -0.2, 0.15)
                  
                  // 9. LÂCHER DANS LE BAC
                  obj.mesh.parent = null
                  obj.mesh.position = binPos.clone()
                  obj.mesh.position.y = 0.5 + Math.random() * 0.3
                  obj.mesh.position.x += (Math.random() - 0.5) * 0.5
                  obj.mesh.position.z += (Math.random() - 0.5) * 0.5
                  
                  // 10. REMONTER
                  await animatePivot(availableArm.pivot, 'x', 0, 0.1)
                  
                  // 11. RETOUR POSITION INITIALE
                  await animatePivot(availableArm.pivot, 'y', restAngle, 0.3)
                  
                  // 12. SUPPRIMER LE CUBE APRÈS UN DÉLAI
                  setTimeout(() => {
                    if (obj.mesh) {
                      obj.mesh.dispose()
                      const idx = objectsRef.current.indexOf(obj)
                      if (idx > -1) objectsRef.current.splice(idx, 1)
                    }
                  }, 2000)
                  
                } catch (error) {
                  // En cas d'erreur, remettre le bras en position
                  availableArm.pivot.rotation.x = 0
                  availableArm.pivot.rotation.y = restAngle
                } finally {
                  // TOUJOURS libérer le bras
                  availableArm.isBusy = false
                  availableArm.heldObject = null
                }
              }
              
              animateArmAndCube()
            }
          }
        }

        // Supprimer si hors de vue (incertains qui continuent)
        if (obj.mesh.position.z > 15 && !obj.isBeingGrabbed) {
          obj.mesh.dispose()
          objectsRef.current.splice(index, 1)
        }
      })
    }, 30)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    objectsRef.current.forEach(obj => obj.mesh.dispose())
    objectsRef.current = []
    resetStats()
  }

  return (
    <div className="space-y-6">
      {/* Contrôles en haut */}
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
        <button
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.alpha = -Math.PI / 2
              cameraRef.current.beta = Math.PI / 2.5
              cameraRef.current.radius = 25
              cameraRef.current.target = new BABYLON.Vector3(0, 2, 0)
            }
          }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors"
        >
          <Eye className="w-5 h-5" />
          Reset Vue
        </button>
      </div>

      <div className="relative bg-slate-950 rounded-xl border-2 border-slate-700 overflow-hidden" style={{ height: '600px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        
        {/* FPS Counter */}
        <div className="absolute top-4 right-4 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-700">
          <p className="text-xs font-mono text-green-400">
            ⚡ {fps} FPS
          </p>
        </div>
        
        {/* Contrôles */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 px-4 py-2 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-300">
            🖱️ Clic gauche: Rotation • Molette: Zoom • Clic droit: Déplacement
          </p>
        </div>
      </div>

      {/* MONITORING - Composant Dashboard intégré */}
      <div className="mt-8">
        <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold mb-6">
          Monitoring
        </div>
        
        {/* Stats de la simulation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total CSR triés</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Conformes</p>
            <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Non-conformes</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Incertains</p>
            <p className="text-2xl font-bold text-slate-500">{stats.uncertain}</p>
          </div>
        </div>
        
        <Dashboard />
      </div>
    </div>
  )
}
