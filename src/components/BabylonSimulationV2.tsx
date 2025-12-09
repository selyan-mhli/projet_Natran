import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Camera as CameraIcon, Zap } from 'lucide-react'
import * as BABYLON from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'
import '@babylonjs/loaders'

interface DetectionStats {
  total: number
  accepted: number
  rejected: number
  currentFPS: number
  avgConfidence: number
  chloreLevel: number
  pciValue: number
}

interface CSRObject {
  mesh: BABYLON.Mesh
  type: string
  color: BABYLON.Color3
  reject: boolean
  detected: boolean
  confidence: number
  speed: number
}

export default function BabylonSimulationV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<BABYLON.Engine | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null)
  const objectsRef = useRef<CSRObject[]>([])
  const animationRef = useRef<number | null>(null)
  const roboticArmsRef = useRef<any[]>([])
  const binCountersRef = useRef({ left: 0, right: 0, end: 0 })
  const binObjectsRef = useRef<{ left: BABYLON.Mesh[], right: BABYLON.Mesh[], end: BABYLON.Mesh[] }>({ left: [], right: [], end: [] })
  
  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState<DetectionStats>({
    total: 0,
    accepted: 0,
    rejected: 0,
    currentFPS: 0,
    avgConfidence: 0,
    chloreLevel: 1.2,
    pciValue: 18.5
  })

  const materials = [
    { name: 'PVC (Chloré)', color: new BABYLON.Color3(0.93, 0.26, 0.26), reject: true, confidence: 0.94 },
    { name: 'PE/PP', color: new BABYLON.Color3(0.23, 0.51, 0.96), reject: false, confidence: 0.96 },
    { name: 'Papier/Carton', color: new BABYLON.Color3(0.96, 0.62, 0.05), reject: false, confidence: 0.92 },
    { name: 'Métaux', color: new BABYLON.Color3(0.42, 0.45, 0.50), reject: true, confidence: 0.98 },
    { name: 'Bois', color: new BABYLON.Color3(0.57, 0.25, 0.05), reject: false, confidence: 0.91 },
    { name: 'Textile', color: new BABYLON.Color3(0.55, 0.36, 0.96), reject: false, confidence: 0.89 }
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })
    engineRef.current = engine

    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0.95, 0.96, 0.97, 1)
    sceneRef.current = scene

    // Caméra
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2.5,
      Math.PI / 3.2,
      22,
      new BABYLON.Vector3(0, 0, 0),
      scene
    )
    camera.attachControl(canvasRef.current, true)
    camera.lowerRadiusLimit = 6
    camera.upperRadiusLimit = 30
    camera.lowerBetaLimit = 0.1
    camera.upperBetaLimit = Math.PI / 2.1
    camera.wheelPrecision = 50
    camera.panningSensibility = 100
    cameraRef.current = camera

    // Lumières
    const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene)
    hemiLight.intensity = 0.8

    const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene)
    dirLight.position = new BABYLON.Vector3(15, 30, 15)
    dirLight.intensity = 1.5

    // Convoyeur
    const conveyorMat = new BABYLON.StandardMaterial('conveyorMat', scene)
    conveyorMat.diffuseColor = new BABYLON.Color3(0.28, 0.33, 0.40)
    conveyorMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2)

    const conveyor = BABYLON.MeshBuilder.CreateBox('conveyor', {
      width: 4,
      height: 0.3,
      depth: 20
    }, scene)
    conveyor.position.y = 0
    conveyor.material = conveyorMat

    // Bordures
    const borderMat = new BABYLON.StandardMaterial('borderMat', scene)
    borderMat.diffuseColor = new BABYLON.Color3(0.2, 0.24, 0.32)

    const border1 = BABYLON.MeshBuilder.CreateBox('border1', {
      width: 0.2,
      height: 0.6,
      depth: 20
    }, scene)
    border1.position = new BABYLON.Vector3(-2.1, 0.3, 0)
    border1.material = borderMat

    const border2 = BABYLON.MeshBuilder.CreateBox('border2', {
      width: 0.2,
      height: 0.6,
      depth: 20
    }, scene)
    border2.position = new BABYLON.Vector3(2.1, 0.3, 0)
    border2.material = borderMat

    // BACS DE COLLECTE
    const createCollectionBin = (name: string, position: BABYLON.Vector3, color: BABYLON.Color3) => {
      const binMat = new BABYLON.StandardMaterial(`${name}Mat`, scene)
      binMat.diffuseColor = color
      binMat.alpha = 0.3

      const bin = BABYLON.MeshBuilder.CreateBox(name, {
        width: 2,
        height: 1.5,
        depth: 2
      }, scene)
      bin.position = position
      bin.material = binMat

      // Bordure du bac
      const edgeMat = new BABYLON.StandardMaterial(`${name}EdgeMat`, scene)
      edgeMat.diffuseColor = color
      edgeMat.emissiveColor = color.scale(0.3)

      return bin
    }

    // Bac gauche (acceptés - vert)
    createCollectionBin('binLeft', new BABYLON.Vector3(-5, 0.75, 0), new BABYLON.Color3(0.2, 0.8, 0.3))
    
    // Bac droite (rejetés - rouge)
    createCollectionBin('binRight', new BABYLON.Vector3(5, 0.75, 0), new BABYLON.Color3(0.8, 0.2, 0.2))
    
    // Bac fin (non triables - gris)
    createCollectionBin('binEnd', new BABYLON.Vector3(0, 0.75, 12), new BABYLON.Color3(0.5, 0.5, 0.5))

    // CAMÉRAS INDUSTRIELLES RÉALISTES
    const createIndustrialCamera = (name: string, position: BABYLON.Vector3) => {
      // Boîtier principal
      const housingMat = new BABYLON.StandardMaterial(`${name}HousingMat`, scene)
      housingMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15)
      housingMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5)
      housingMat.specularPower = 64

      const housing = BABYLON.MeshBuilder.CreateBox(`${name}Housing`, {
        width: 0.4,
        height: 0.6,
        depth: 0.8
      }, scene)
      housing.position = position
      housing.material = housingMat

      // Lentille
      const lensMat = new BABYLON.StandardMaterial(`${name}LensMat`, scene)
      lensMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.1)
      lensMat.specularColor = new BABYLON.Color3(1, 1, 1)
      lensMat.specularPower = 128

      const lens = BABYLON.MeshBuilder.CreateCylinder(`${name}Lens`, {
        diameter: 0.3,
        height: 0.2
      }, scene)
      lens.rotation.x = Math.PI / 2
      lens.position = new BABYLON.Vector3(position.x, position.y, position.z + 0.5)
      lens.material = lensMat

      // Support
      const supportMat = new BABYLON.StandardMaterial(`${name}SupportMat`, scene)
      supportMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2)

      const support = BABYLON.MeshBuilder.CreateCylinder(`${name}Support`, {
        diameter: 0.1,
        height: position.y - 1
      }, scene)
      support.position = new BABYLON.Vector3(position.x, (position.y - 1) / 2 + 1, position.z)
      support.material = supportMat
    }

    createIndustrialCamera('cam1', new BABYLON.Vector3(-2, 5, 0))
    createIndustrialCamera('cam2', new BABYLON.Vector3(0, 5.5, 0))
    createIndustrialCamera('cam3', new BABYLON.Vector3(2, 5, 0))

    // BRAS ROBOTIQUES ARTICULÉS
    const createRoboticArm = (side: 'left' | 'right', position: BABYLON.Vector3, targetType: 'accept' | 'reject') => {
      const armMat = new BABYLON.StandardMaterial(`arm${side}Mat`, scene)
      armMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35)
      armMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6)

      // Base
      const base = BABYLON.MeshBuilder.CreateCylinder(`arm${side}Base`, {
        diameter: 0.5,
        height: 0.3
      }, scene)
      base.position = position
      base.material = armMat

      // Bras 1 (vertical)
      const arm1 = BABYLON.MeshBuilder.CreateCylinder(`arm${side}Arm1`, {
        diameter: 0.12,
        height: 2
      }, scene)
      arm1.position = new BABYLON.Vector3(position.x, position.y + 1.15, position.z)
      arm1.material = armMat

      // Joint 1
      const joint1 = BABYLON.MeshBuilder.CreateSphere(`arm${side}Joint1`, {
        diameter: 0.2
      }, scene)
      joint1.position = new BABYLON.Vector3(position.x, position.y + 2.15, position.z)
      joint1.material = armMat

      // Bras 2 (horizontal)
      const arm2 = BABYLON.MeshBuilder.CreateCylinder(`arm${side}Arm2`, {
        diameter: 0.1,
        height: 2
      }, scene)
      arm2.rotation.z = Math.PI / 2
      arm2.position = new BABYLON.Vector3(
        position.x + (side === 'left' ? -1 : 1),
        position.y + 2.15,
        position.z
      )
      arm2.material = armMat

      // Pince
      const gripperMat = new BABYLON.StandardMaterial(`gripper${side}Mat`, scene)
      gripperMat.diffuseColor = targetType === 'reject' ? new BABYLON.Color3(0.6, 0.2, 0.2) : new BABYLON.Color3(0.2, 0.6, 0.3)

      const gripper = BABYLON.MeshBuilder.CreateBox(`arm${side}Gripper`, {
        width: 0.2,
        height: 0.15,
        depth: 0.3
      }, scene)
      gripper.position = new BABYLON.Vector3(
        position.x + (side === 'left' ? -2 : 2),
        position.y + 2.15,
        position.z
      )
      gripper.material = gripperMat

      return { base, arm1, joint1, arm2, gripper, targetType, side }
    }

    const arm1 = createRoboticArm('left', new BABYLON.Vector3(-3, 0.5, 2), 'accept')
    const arm2 = createRoboticArm('right', new BABYLON.Vector3(3, 0.5, 2), 'reject')
    const arm3 = createRoboticArm('left', new BABYLON.Vector3(-3, 0.5, -2), 'accept')
    const arm4 = createRoboticArm('right', new BABYLON.Vector3(3, 0.5, -2), 'reject')

    roboticArmsRef.current = [arm1, arm2, arm3, arm4]

    // Sol
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {
      width: 30,
      height: 30
    }, scene)
    ground.position.y = -1

    const gridMat = new GridMaterial('gridMat', scene)
    gridMat.majorUnitFrequency = 5
    gridMat.minorUnitVisibility = 0.3
    gridMat.gridRatio = 1
    gridMat.backFaceCulling = false
    gridMat.mainColor = new BABYLON.Color3(0.8, 0.8, 0.8)
    gridMat.lineColor = new BABYLON.Color3(0.6, 0.6, 0.6)
    gridMat.opacity = 0.8
    ground.material = gridMat

    // Boucle de rendu
    engine.runRenderLoop(() => {
      scene.render()
      setStats(prev => ({ ...prev, currentFPS: Math.round(engine.getFps()) }))
    })

    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      scene.dispose()
      engine.dispose()
    }
  }, [])

  const createCSRObject = () => {
    if (!sceneRef.current) return

    const material = materials[Math.floor(Math.random() * materials.length)]
    const scene = sceneRef.current

    const shapes = ['box', 'sphere', 'cylinder', 'torus', 'capsule']
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    
    let mesh: BABYLON.Mesh
    const size = 0.4 + Math.random() * 0.4

    if (shape === 'box') {
      mesh = BABYLON.MeshBuilder.CreateBox(`csr_${Date.now()}`, {
        width: size,
        height: size,
        depth: size
      }, scene)
    } else if (shape === 'sphere') {
      mesh = BABYLON.MeshBuilder.CreateSphere(`csr_${Date.now()}`, {
        diameter: size
      }, scene)
    } else if (shape === 'cylinder') {
      mesh = BABYLON.MeshBuilder.CreateCylinder(`csr_${Date.now()}`, {
        diameter: size * 0.7,
        height: size * 1.5
      }, scene)
    } else if (shape === 'torus') {
      mesh = BABYLON.MeshBuilder.CreateTorus(`csr_${Date.now()}`, {
        diameter: size,
        thickness: size * 0.3
      }, scene)
    } else {
      mesh = BABYLON.MeshBuilder.CreateCapsule(`csr_${Date.now()}`, {
        radius: size * 0.4,
        height: size * 1.2
      }, scene)
    }

    mesh.position = new BABYLON.Vector3(
      (Math.random() - 0.5) * 3,
      2 + Math.random() * 2,
      -12
    )

    mesh.rotation = new BABYLON.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    const objMat = new BABYLON.StandardMaterial(`mat_${Date.now()}`, scene)
    objMat.diffuseColor = material.color
    objMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4)
    mesh.material = objMat

    const speed = 0.08 + Math.random() * 0.04
    const rotationSpeed = new BABYLON.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    )

    const csrObject: CSRObject = {
      mesh,
      type: material.name,
      color: material.color,
      reject: material.reject,
      detected: false,
      confidence: material.confidence + (Math.random() * 0.1 - 0.05),
      speed
    }

    objectsRef.current.push(csrObject)

    scene.registerBeforeRender(() => {
      if (!mesh.isDisposed()) {
        mesh.position.z += speed
        mesh.rotation.addInPlace(rotationSpeed)

        if (mesh.position.y > 0.5) {
          mesh.position.y -= 0.02
        }

        // Détection
        if (mesh.position.z > -0.5 && mesh.position.z < 0.5 && !csrObject.detected) {
          csrObject.detected = true

          const detectionMat = mesh.material as BABYLON.StandardMaterial
          if (detectionMat) {
            detectionMat.emissiveColor = csrObject.reject 
              ? new BABYLON.Color3(0.93, 0.26, 0.26)
              : new BABYLON.Color3(0.13, 0.77, 0.37)
          }

          // Trouver le bras le plus proche
          const targetArm = roboticArmsRef.current.find((arm: any) => {
            const isCorrectType = csrObject.reject ? arm.targetType === 'reject' : arm.targetType === 'accept'
            const isNearZ = Math.abs(arm.gripper.position.z - mesh.position.z) < 3
            return isCorrectType && isNearZ
          })

          if (targetArm) {
            // Fonction d'easing pour mouvement fluide (ease-in-out)
            const easeInOutCubic = (t: number) => {
              return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
            }

            // Animation RÉALISTE du bras qui attrape l'objet
            let animationProgress = 0
            const objectStartPos = mesh.position.clone()
            
            // Sauvegarder positions initiales du bras
            const originalArm2Rotation = targetArm.arm2.rotation.z
            const originalArm2X = targetArm.arm2.position.x
            const originalGripperX = targetArm.gripper.position.x
            const originalGripperY = targetArm.gripper.position.y
            
            // Positions cibles
            const binSide = targetArm.side === 'left' ? 'left' : 'right'
            const binX = targetArm.side === 'left' ? -5 : 5
            const binY = 0.75 + (binCountersRef.current[binSide] * 0.15)
            const direction = targetArm.side === 'left' ? 1 : -1
            
            const armAnimation = scene.onBeforeRenderObservable.add(() => {
              animationProgress += 0.018

              if (animationProgress <= 1) {
                if (animationProgress < 0.25) {
                  // Phase 1: Bras s'étend vers l'objet (0-25%)
                  const t1 = animationProgress / 0.25
                  const ease1 = easeInOutCubic(t1)
                  
                  // Rotation du bras horizontal
                  targetArm.arm2.rotation.z = originalArm2Rotation + direction * 0.6 * ease1
                  
                  // Mettre à jour la position du bras2 et joint1
                  const baseX = targetArm.side === 'left' ? -3 : 3
                  targetArm.arm2.position.x = baseX + direction * (1 + 1 * ease1)
                  targetArm.joint1.position.x = baseX
                  
                  // Extension de la pince
                  targetArm.gripper.position.x = originalGripperX + direction * 2 * ease1
                  targetArm.gripper.position.y = originalGripperY - 1.5 * ease1
                  
                } else if (animationProgress < 0.35) {
                  // Phase 2: Saisie de l'objet (25-35%)
                  // L'objet suit la pince
                  mesh.position.x = targetArm.gripper.position.x
                  mesh.position.y = targetArm.gripper.position.y
                  
                } else if (animationProgress < 0.65) {
                  // Phase 3: Lever l'objet (35-65%)
                  const t3 = (animationProgress - 0.35) / 0.3
                  const ease3 = easeInOutCubic(t3)
                  
                  const baseX = targetArm.side === 'left' ? -3 : 3
                  
                  // Lever la pince
                  targetArm.gripper.position.y = originalGripperY - 1.5 + 2.5 * ease3
                  
                  // Maintenir l'extension du bras
                  targetArm.arm2.position.x = baseX + direction * 2
                  
                  // L'objet suit
                  mesh.position.x = targetArm.gripper.position.x
                  mesh.position.y = targetArm.gripper.position.y
                  mesh.rotation.y += 0.03
                  
                } else if (animationProgress < 0.9) {
                  // Phase 4: Déplacement vers le bac (65-90%)
                  const t4 = (animationProgress - 0.65) / 0.25
                  const ease4 = easeInOutCubic(t4)
                  
                  const baseX = targetArm.side === 'left' ? -3 : 3
                  
                  // Étendre encore plus vers le bac
                  targetArm.gripper.position.x = originalGripperX + direction * (2 + 3 * ease4)
                  targetArm.arm2.position.x = baseX + direction * (2 + 1.5 * ease4)
                  
                  // L'objet suit
                  mesh.position.x = targetArm.gripper.position.x
                  mesh.position.y = targetArm.gripper.position.y
                  mesh.rotation.y += 0.03
                  
                } else {
                  // Phase 5: Lâcher dans le bac (90-100%)
                  const t5 = (animationProgress - 0.9) / 0.1
                  const ease5 = easeInOutCubic(t5)
                  
                  // Descendre l'objet dans le bac
                  mesh.position.x = binX
                  mesh.position.y = targetArm.gripper.position.y - 1 * ease5
                  mesh.position.z = objectStartPos.z
                  
                  if (animationProgress > 0.95) {
                    mesh.position.y = binY
                    
                    // Rétraction du bras
                    targetArm.arm2.rotation.z = originalArm2Rotation + direction * 0.6 * (1 - ease5)
                    targetArm.arm2.position.x = originalArm2X + direction * 3.5 * (1 - ease5)
                    targetArm.gripper.position.x = originalGripperX + direction * 5 * (1 - ease5)
                    targetArm.gripper.position.y = originalGripperY + 1 * (1 - ease5)
                  }
                  
                  if (animationProgress > 0.98) {
                    // Ajouter au bac
                    binObjectsRef.current[binSide].push(mesh)
                    binCountersRef.current[binSide]++
                    
                    // Vider le bac si plein (>15 objets)
                    if (binCountersRef.current[binSide] > 15) {
                      binObjectsRef.current[binSide].forEach(obj => {
                        if (!obj.isDisposed()) {
                          obj.dispose()
                        }
                      })
                      binObjectsRef.current[binSide] = []
                      binCountersRef.current[binSide] = 0
                    }
                  }
                }
              } else {
                // Retour complet à la position initiale
                targetArm.arm2.rotation.z = originalArm2Rotation
                targetArm.arm2.position.x = originalArm2X
                targetArm.gripper.position.x = originalGripperX
                targetArm.gripper.position.y = originalGripperY
                scene.onBeforeRenderObservable.remove(armAnimation)
              }
            })
          }

          setStats(prev => {
            const newTotal = prev.total + 1
            const newAccepted = prev.accepted + (csrObject.reject ? 0 : 1)
            const newRejected = prev.rejected + (csrObject.reject ? 1 : 0)
            
            const chloreReduction = (newRejected / newTotal) * 1.7
            const newChlore = Math.max(0.5, 1.2 - chloreReduction)
            const qualityRatio = newAccepted / newTotal
            const newPCI = 17 + qualityRatio * 4

            return {
              ...prev,
              total: newTotal,
              accepted: newAccepted,
              rejected: newRejected,
              avgConfidence: (prev.avgConfidence * prev.total + csrObject.confidence) / newTotal,
              chloreLevel: newChlore,
              pciValue: newPCI
            }
          })
        }

        // Supprimer si hors de vue
        if (mesh.position.z > 12) {
          mesh.dispose()
          objectsRef.current = objectsRef.current.filter(obj => obj.mesh !== mesh)
        }
      }
    })
  }

  const startSimulation = () => {
    setIsRunning(true)
    animationRef.current = window.setInterval(() => {
      createCSRObject()
    }, 800)
  }

  const stopSimulation = () => {
    setIsRunning(false)
    if (animationRef.current) {
      clearInterval(animationRef.current)
      animationRef.current = null
    }
  }

  const resetSimulation = () => {
    stopSimulation()
    objectsRef.current.forEach(obj => {
      if (!obj.mesh.isDisposed()) {
        obj.mesh.dispose()
      }
    })
    objectsRef.current = []
    setStats({
      total: 0,
      accepted: 0,
      rejected: 0,
      currentFPS: 0,
      avgConfidence: 0,
      chloreLevel: 1.2,
      pciValue: 18.5
    })
  }

  const resetCameraView = () => {
    if (cameraRef.current) {
      cameraRef.current.alpha = -Math.PI / 2.5
      cameraRef.current.beta = Math.PI / 3.2
      cameraRef.current.radius = 22
      cameraRef.current.target = new BABYLON.Vector3(0, 0, 0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Simulation 3D - Babylon.js</h2>
            <p className="text-slate-600">Visualisation réaliste du système de tri intelligent des CSR</p>
          </div>
          <div className="flex gap-3">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-md transition-all"
              >
                <Play className="w-5 h-5" />
                Démarrer
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 shadow-md transition-all"
              >
                <Pause className="w-5 h-5" />
                Arrêter
              </button>
            )}
            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 shadow-md transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Réinitialiser
            </button>
            <button
              onClick={resetCameraView}
              className="flex items-center gap-2 px-4 py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-400 shadow-md transition-all"
              title="Réinitialiser la vue de la caméra"
            >
              <CameraIcon className="w-5 h-5" />
              Reset Vue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-600 mb-1">Total Détecté</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-400">
            <p className="text-xs text-slate-600 mb-1">Accepté</p>
            <p className="text-2xl font-bold text-slate-900">{stats.accepted}</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-600">
            <p className="text-xs text-slate-600 mb-1">Rejeté</p>
            <p className="text-2xl font-bold text-slate-900">{stats.rejected}</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-600 mb-1">Confiance</p>
            <p className="text-2xl font-bold text-slate-900">{(stats.avgConfidence * 100).toFixed(1)}%</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-600 mb-1">Chlore</p>
            <p className="text-2xl font-bold text-slate-900">{stats.chloreLevel.toFixed(2)}%</p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-600 mb-1">PCI</p>
            <p className="text-xl font-bold text-slate-900">{stats.pciValue.toFixed(1)}<span className="text-xs"> MJ/kg</span></p>
          </div>
          <div className="glass-effect rounded-lg p-4 border-l-4 border-slate-500">
            <p className="text-xs text-slate-600 mb-1">FPS</p>
            <p className="text-2xl font-bold text-slate-900">{stats.currentFPS}</p>
          </div>
        </div>

        <div className="relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-lg" style={{ height: '600px' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          
          <div className="absolute top-4 left-4 glass-effect px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <CameraIcon className="w-4 h-4 text-slate-700" />
              <span className="text-sm font-medium text-slate-900">Vue 3D Interactive</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Clic gauche: Rotation • Molette: Zoom</p>
          </div>

          {isRunning && (
            <div className="absolute top-4 right-4 glass-effect px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-700 animate-pulse" />
                <span className="text-sm font-medium text-slate-900">Simulation active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
