import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Camera as CameraIcon, Zap } from 'lucide-react'
import * as BABYLON from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'
import '@babylonjs/loaders'
import { RealisticRoboticArm } from './RealisticRoboticArm'

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
  const roboticArmsRef = useRef<RealisticRoboticArm[]>([])
  const binCountersRef = useRef({ left: 0, right: 0, end: 0 })
  const binObjectsRef = useRef<{ left: BABYLON.Mesh[], right: BABYLON.Mesh[], end: BABYLON.Mesh[] }>({ left: [], right: [], end: [] })
  const binPositionsRef = useRef({
    left: new BABYLON.Vector3(-5, 1.5, 0),
    right: new BABYLON.Vector3(5, 1.5, 0),
    end: new BABYLON.Vector3(0, 1.5, 12)
  })
  
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

    // CONVOYEUR INDUSTRIEL DÉTAILLÉ
    const conveyorMat = new BABYLON.PBRMetallicRoughnessMaterial('conveyorMat', scene)
    conveyorMat.baseColor = new BABYLON.Color3(0.15, 0.18, 0.22)
    conveyorMat.metallic = 0.8
    conveyorMat.roughness = 0.4

    // Bande principale
    const conveyor = BABYLON.MeshBuilder.CreateBox('conveyor', {
      width: 3,
      height: 0.2,
      depth: 20
    }, scene)
    conveyor.position = new BABYLON.Vector3(0, 0.1, 0)
    conveyor.material = conveyorMat
    
    // Rouleaux sous le convoyeur (réalisme)
    const rollerMat = new BABYLON.StandardMaterial('rollerMat', scene)
    rollerMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    rollerMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5)
    
    for (let i = -9; i <= 9; i += 1.5) {
      const roller = BABYLON.MeshBuilder.CreateCylinder(`roller_${i}`, {
        diameter: 0.15,
        height: 3.2
      }, scene)
      roller.rotation.z = Math.PI / 2
      roller.position = new BABYLON.Vector3(0, -0.05, i)
      roller.material = rollerMat
    }
    
    // Bordures latérales métalliques
    const sideMat = new BABYLON.PBRMetallicRoughnessMaterial('sideMat', scene)
    sideMat.baseColor = new BABYLON.Color3(0.35, 0.35, 0.38)
    sideMat.metallic = 0.9
    sideMat.roughness = 0.3
    
    const sideLeft = BABYLON.MeshBuilder.CreateBox('sideLeft', {
      width: 0.15,
      height: 0.4,
      depth: 20
    }, scene)
    sideLeft.position = new BABYLON.Vector3(-1.575, 0.3, 0)
    sideLeft.material = sideMat
    
    const sideRight = BABYLON.MeshBuilder.CreateBox('sideRight', {
      width: 0.15,
      height: 0.4,
      depth: 20
    }, scene)
    sideRight.position = new BABYLON.Vector3(1.575, 0.3, 0)
    sideRight.material = sideMat
    
    // Lignes de guidage sur le convoyeur
    for (let i = -9; i <= 9; i += 2) {
      const guideLine = BABYLON.MeshBuilder.CreateBox(`guide_${i}`, {
        width: 2.8,
        height: 0.02,
        depth: 0.05
      }, scene)
      guideLine.position = new BABYLON.Vector3(0, 0.21, i)
      const guideMat = new BABYLON.StandardMaterial(`guideMat_${i}`, scene)
      guideMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0)
      guideMat.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0)
      guideLine.material = guideMat
    }

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

    // STRUCTURE INDUSTRIELLE RÉALISTE (comme vraie usine)
    const createIndustrialStructure = () => {
      const structureMat = new BABYLON.PBRMetallicRoughnessMaterial('structureMat', scene)
      structureMat.baseColor = new BABYLON.Color3(0.25, 0.25, 0.27)
      structureMat.metallic = 0.95
      structureMat.roughness = 0.4
      
      // COLONNES INDUSTRIELLES (8 colonnes pour solidité)
      const columnPositions = [
        [-5, 0, -10], [5, 0, -10],
        [-5, 0, -3], [5, 0, -3],
        [-5, 0, 3], [5, 0, 3],
        [-5, 0, 10], [5, 0, 10]
      ]
      
      columnPositions.forEach((pos, i) => {
        // Colonne principale
        const column = BABYLON.MeshBuilder.CreateCylinder(`column${i}`, {
          diameter: 0.4,
          height: 10,
          tessellation: 16
        }, scene)
        column.position = new BABYLON.Vector3(pos[0], 5, pos[1])
        column.material = structureMat
        
        // Base de colonne
        const base = BABYLON.MeshBuilder.CreateBox(`columnBase${i}`, {
          width: 0.8,
          height: 0.3,
          depth: 0.8
        }, scene)
        base.position = new BABYLON.Vector3(pos[0], 0.15, pos[1])
        base.material = structureMat
      })
      
      // POUTRES LONGITUDINALES (le long du convoyeur)
      for (let side of [-5, 5]) {
        const beam = BABYLON.MeshBuilder.CreateBox(`longBeam_${side}`, {
          width: 0.25,
          height: 0.3,
          depth: 20
        }, scene)
        beam.position = new BABYLON.Vector3(side, 9.5, 0)
        beam.material = structureMat
      }
      
      // POUTRES TRANSVERSALES (traversent le convoyeur)
      for (let z of [-10, -3, 3, 10]) {
        const crossBeam = BABYLON.MeshBuilder.CreateBox(`crossBeam_${z}`, {
          width: 10,
          height: 0.25,
          depth: 0.3
        }, scene)
        crossBeam.position = new BABYLON.Vector3(0, 9.5, z)
        crossBeam.material = structureMat
      }
      
      // TOIT INDUSTRIEL (tôle ondulée)
      const roofMat = new BABYLON.StandardMaterial('roofMat', scene)
      roofMat.diffuseColor = new BABYLON.Color3(0.4, 0.42, 0.45)
      roofMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6)
      roofMat.alpha = 0.85
      
      const roof = BABYLON.MeshBuilder.CreateBox('roof', {
        width: 12,
        height: 0.1,
        depth: 22
      }, scene)
      roof.position = new BABYLON.Vector3(0, 10, 0)
      roof.material = roofMat
      
      // CÂBLES ÉLECTRIQUES (réalisme)
      const cableMat = new BABYLON.StandardMaterial('cableMat', scene)
      cableMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1)
      
      for (let z = -9; z <= 9; z += 3) {
        const cable = BABYLON.MeshBuilder.CreateCylinder(`cable_${z}`, {
          diameter: 0.05,
          height: 10
        }, scene)
        cable.position = new BABYLON.Vector3(-4.5, 5, z)
        cable.material = cableMat
      }
      
      // CONDUITS D'AÉRATION
      for (let z = -8; z <= 8; z += 4) {
        const duct = BABYLON.MeshBuilder.CreateBox(`duct_${z}`, {
          width: 0.4,
          height: 0.4,
          depth: 3
        }, scene)
        duct.position = new BABYLON.Vector3(0, 9.2, z)
        const ductMat = new BABYLON.StandardMaterial(`ductMat_${z}`, scene)
        ductMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.52)
        duct.material = ductMat
      }
    }
    
    createIndustrialStructure()
    
    // PANNEAUX DE SIGNALISATION
    const createSignPanel = (text: string, position: BABYLON.Vector3, color: BABYLON.Color3) => {
      const panel = BABYLON.MeshBuilder.CreatePlane(`panel_${text}`, {
        width: 2,
        height: 0.8
      }, scene)
      panel.position = position
      panel.rotation.y = Math.PI
      
      const panelMat = new BABYLON.StandardMaterial(`panelMat_${text}`, scene)
      panelMat.diffuseColor = color
      panelMat.emissiveColor = color.scale(0.3)
      panel.material = panelMat
    }
    
    createSignPanel('ZONE DE TRI', new BABYLON.Vector3(0, 6.5, -7.5), new BABYLON.Color3(0.2, 0.5, 0.9))
    createSignPanel('CONFORME', new BABYLON.Vector3(-4.5, 2, 0), new BABYLON.Color3(0.2, 0.8, 0.3))
    createSignPanel('NON-CONFORME', new BABYLON.Vector3(4.5, 2, 0), new BABYLON.Color3(0.9, 0.2, 0.2))
    
    // ÉCLAIRAGE INDUSTRIEL
    const createIndustrialLight = (position: BABYLON.Vector3) => {
      const lightHousing = BABYLON.MeshBuilder.CreateCylinder('lightHousing', {
        diameter: 0.6,
        height: 0.3
      }, scene)
      lightHousing.position = position
      
      const housingMat = new BABYLON.StandardMaterial('housingMat', scene)
      housingMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1)
      lightHousing.material = housingMat
      
      const spotLight = new BABYLON.SpotLight(
        `spot_${position.x}_${position.z}`,
        position,
        new BABYLON.Vector3(0, -1, 0),
        Math.PI / 3,
        2,
        scene
      )
      spotLight.intensity = 0.8
      spotLight.diffuse = new BABYLON.Color3(1, 0.95, 0.8)
    }
    
    createIndustrialLight(new BABYLON.Vector3(-2, 7, -4))
    createIndustrialLight(new BABYLON.Vector3(2, 7, -4))
    createIndustrialLight(new BABYLON.Vector3(-2, 7, 0))
    createIndustrialLight(new BABYLON.Vector3(2, 7, 0))
    createIndustrialLight(new BABYLON.Vector3(-2, 7, 4))
    createIndustrialLight(new BABYLON.Vector3(2, 7, 4))
    
    // BRAS ROBOTIQUES RÉALISTES (2 seulement - réaliste)
    const arm1 = new RealisticRoboticArm({
      scene,
      position: new BABYLON.Vector3(-3.5, 0.5, 0),
      side: 'left',
      targetType: 'accept'
    })
    
    const arm2 = new RealisticRoboticArm({
      scene,
      position: new BABYLON.Vector3(3.5, 0.5, 0),
      side: 'right',
      targetType: 'reject'
    })

    roboticArmsRef.current = [arm1, arm2]

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

    const speed = 0.03 + Math.random() * 0.01
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

    let isPaused = false
    
    scene.registerBeforeRender(() => {
      if (!mesh.isDisposed()) {
        // Ne bouger que si pas en pause
        if (!isPaused) {
          mesh.position.z += speed
          mesh.rotation.addInPlace(rotationSpeed)
        }

        if (mesh.position.y > 0.5) {
          mesh.position.y -= 0.02
        }

        // Détection (zone plus large pour meilleure synchronisation)
        if (mesh.position.z > -1 && mesh.position.z < 1 && !csrObject.detected) {
          csrObject.detected = true

          const detectionMat = mesh.material as BABYLON.StandardMaterial
          if (detectionMat) {
            detectionMat.emissiveColor = csrObject.reject 
              ? new BABYLON.Color3(0.93, 0.26, 0.26)
              : new BABYLON.Color3(0.13, 0.77, 0.37)
          }

          // Trouver un bras disponible du bon type ET dans la zone de prise
          const targetArm = roboticArmsRef.current.find(arm => {
            const isCorrectType = csrObject.reject ? arm.getTargetType() === 'reject' : arm.getTargetType() === 'accept'
            const isInZone = arm.isInGraspZone(mesh.position) // ZONE DE PRISE
            return isCorrectType && isInZone && arm.isAvailable()
          })

          if (targetArm) {
            // ARRÊTER l'objet pendant que le bras l'attrape
            isPaused = true
            
            // Utiliser l'animation réaliste du bras avec COMPENSATION PRÉDICTIVE
            const binPos = csrObject.reject 
              ? binPositionsRef.current.right 
              : binPositionsRef.current.left
            
            // Passer la vitesse du convoyeur pour la prédiction
            targetArm.grabObject(mesh, binPos, speed).then(() => {
              isPaused = false
              // Après l'animation, ajouter au compteur
              const binSide = csrObject.reject ? 'right' : 'left'
              binObjectsRef.current[binSide].push(mesh)
              binCountersRef.current[binSide]++
              
              // Vider le bac si plein
              if (binCountersRef.current[binSide] > 15) {
                binObjectsRef.current[binSide].forEach(obj => {
                  if (!obj.isDisposed()) {
                    obj.dispose()
                  }
                })
                binObjectsRef.current[binSide] = []
                binCountersRef.current[binSide] = 0
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

        // Supprimer si hors de vue (IMPORTANT pour éviter accumulation)
        if (mesh.position.z > 12 || mesh.position.z < -15) {
          if (!mesh.isDisposed()) {
            mesh.dispose()
          }
          objectsRef.current = objectsRef.current.filter(obj => obj.mesh !== mesh)
        }
      }
    })
  }

  const startSimulation = () => {
    setIsRunning(true)
    animationRef.current = setInterval(() => {
      // Limiter à 5 objets max sur le convoyeur
      if (objectsRef.current.length < 5) {
        createCSRObject()
      }
    }, 1200)
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
