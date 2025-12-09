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

export default function BabylonSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<BABYLON.Engine | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null)
  const objectsRef = useRef<CSRObject[]>([])
  const animationRef = useRef<number | null>(null)
  const roboticArmsRef = useRef<any[]>([])
  
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

    // Initialisation Babylon.js
    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true
    })
    engineRef.current = engine

    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0.95, 0.96, 0.97, 1)
    sceneRef.current = scene

    // Caméra - Vue par défaut selon préférence utilisateur
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

    // Lumières - Éclairage industriel amélioré
    const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene)
    hemiLight.intensity = 0.7
    hemiLight.groundColor = new BABYLON.Color3(0.1, 0.15, 0.2)

    const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene)
    dirLight.position = new BABYLON.Vector3(15, 30, 15)
    dirLight.intensity = 1.2

    // Lumières d'ambiance industrielle - Plus intenses
    const spotLight1 = new BABYLON.SpotLight(
      'spotLight1',
      new BABYLON.Vector3(-4, 7, 0),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 3,
      2,
      scene
    )
    spotLight1.intensity = 0.8
    spotLight1.diffuse = new BABYLON.Color3(1, 1, 0.9)

    const spotLight2 = new BABYLON.SpotLight(
      'spotLight2',
      new BABYLON.Vector3(4, 7, 0),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 3,
      2,
      scene
    )
    spotLight2.intensity = 0.8
    spotLight2.diffuse = new BABYLON.Color3(1, 1, 0.9)

    // Lumière frontale pour mieux voir les capteurs
    const frontLight = new BABYLON.PointLight('frontLight', new BABYLON.Vector3(0, 4, 5), scene)
    frontLight.intensity = 0.6
    frontLight.diffuse = new BABYLON.Color3(0.9, 0.95, 1)

    // Convoyeur principal
    const conveyorMat = new BABYLON.StandardMaterial('conveyorMat', scene)
    conveyorMat.diffuseColor = new BABYLON.Color3(0.28, 0.33, 0.40)
    conveyorMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2)
    conveyorMat.roughness = 0.8

    const conveyor = BABYLON.MeshBuilder.CreateBox('conveyor', {
      width: 4,
      height: 0.3,
      depth: 20
    }, scene)
    conveyor.position.y = 0
    conveyor.material = conveyorMat

    // Bordures du convoyeur
    const borderMat = new BABYLON.StandardMaterial('borderMat', scene)
    borderMat.diffuseColor = new BABYLON.Color3(0.2, 0.24, 0.32)
    borderMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5)

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

    // Zone de détection (ligne laser rouge avec animation)
    const detectionZoneMat = new BABYLON.StandardMaterial('detectionZoneMat', scene)
    detectionZoneMat.emissiveColor = new BABYLON.Color3(0.93, 0.26, 0.26)
    detectionZoneMat.alpha = 0.6

    const detectionZone = BABYLON.MeshBuilder.CreateBox('detectionZone', {
      width: 4.5,
      height: 0.05,
      depth: 0.2
    }, scene)
    detectionZone.position.y = 0.2
    detectionZone.material = detectionZoneMat

    // Effet de scan laser animé
    let scanIntensity = 0
    scene.registerBeforeRender(() => {
      scanIntensity += 0.08
      const pulse = 0.4 + Math.sin(scanIntensity) * 0.3
      detectionZoneMat.emissiveColor = new BABYLON.Color3(0.93 * pulse, 0.26 * pulse, 0.26 * pulse)
      detectionZoneMat.alpha = 0.4 + pulse * 0.3
    })

    // Rayon laser vertical pour effet visuel
    const laserMat = new BABYLON.StandardMaterial('laserMat', scene)
    laserMat.emissiveColor = new BABYLON.Color3(1, 0.2, 0.2)
    laserMat.alpha = 0.3

    const laser = BABYLON.MeshBuilder.CreateBox('laser', {
      width: 4.5,
      height: 4,
      depth: 0.05
    }, scene)
    laser.position = new BABYLON.Vector3(0, 2, 0)
    laser.material = laserMat

    // Caméras industrielles ultra-détaillées
    const createIndustrialCamera = (name: string, position: BABYLON.Vector3, color: BABYLON.Color3, label: string) => {
      // Corps principal métallique
      const bodyMat = new BABYLON.StandardMaterial(`${name}BodyMat`, scene)
      bodyMat.diffuseColor = new BABYLON.Color3(0.15, 0.17, 0.2)
      bodyMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8)
      bodyMat.specularPower = 64

      const body = BABYLON.MeshBuilder.CreateBox(`${name}Body`, {
        width: 1,
        height: 0.7,
        depth: 0.8
      }, scene)
      body.position = position
      body.material = bodyMat

      // Panneau avant coloré
      const panelMat = new BABYLON.StandardMaterial(`${name}PanelMat`, scene)
      panelMat.diffuseColor = color
      panelMat.emissiveColor = color.scale(0.6)
      panelMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9)

      const panel = BABYLON.MeshBuilder.CreateBox(`${name}Panel`, {
        width: 0.9,
        height: 0.6,
        depth: 0.05
      }, scene)
      panel.position = new BABYLON.Vector3(position.x, position.y, position.z + 0.425)
      panel.material = panelMat

      // Lentille principale (grosse)
      const lensMat = new BABYLON.StandardMaterial(`${name}LensMat`, scene)
      lensMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.08)
      lensMat.emissiveColor = color.scale(1.2)
      lensMat.specularColor = new BABYLON.Color3(1, 1, 1)
      lensMat.specularPower = 128
      lensMat.alpha = 0.9

      const lens = BABYLON.MeshBuilder.CreateCylinder(`${name}Lens`, {
        diameter: 0.45,
        height: 0.15
      }, scene)
      lens.rotation.x = Math.PI / 2
      lens.position = new BABYLON.Vector3(position.x, position.y, position.z + 0.5)
      lens.material = lensMat

      // Anneau de lentille
      const ringMat = new BABYLON.StandardMaterial(`${name}RingMat`, scene)
      ringMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.12)
      ringMat.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7)

      const ring = BABYLON.MeshBuilder.CreateTorus(`${name}Ring`, {
        diameter: 0.5,
        thickness: 0.05,
        tessellation: 32
      }, scene)
      ring.rotation.y = Math.PI / 2
      ring.position = new BABYLON.Vector3(position.x, position.y, position.z + 0.5)
      ring.material = ringMat

      // Petite LED indicateur
      const ledMat = new BABYLON.StandardMaterial(`${name}LedMat`, scene)
      ledMat.emissiveColor = new BABYLON.Color3(0, 1, 0)
      ledMat.diffuseColor = new BABYLON.Color3(0, 0.5, 0)

      const led = BABYLON.MeshBuilder.CreateSphere(`${name}Led`, {
        diameter: 0.08
      }, scene)
      led.position = new BABYLON.Vector3(position.x + 0.4, position.y + 0.25, position.z + 0.4)
      led.material = ledMat

      // Animation clignotement LED
      let ledState = 0
      scene.registerBeforeRender(() => {
        ledState += 0.05
        ledMat.emissiveColor = new BABYLON.Color3(0, 0.5 + Math.sin(ledState) * 0.5, 0)
      })

      // Support articulé réaliste
      const supportMat = new BABYLON.StandardMaterial(`${name}SupportMat`, scene)
      supportMat.diffuseColor = new BABYLON.Color3(0.2, 0.22, 0.25)
      supportMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6)

      // Bras principal
      const mainArm = BABYLON.MeshBuilder.CreateCylinder(`${name}MainArm`, {
        diameter: 0.15,
        height: position.y - 1.5
      }, scene)
      mainArm.position = new BABYLON.Vector3(position.x, (position.y - 1.5) / 2 + 1.5, position.z)
      mainArm.material = supportMat

      // Joint
      const joint = BABYLON.MeshBuilder.CreateSphere(`${name}Joint`, {
        diameter: 0.25
      }, scene)
      joint.position = new BABYLON.Vector3(position.x, position.y - 0.5, position.z)
      joint.material = supportMat

      // Bras de connexion
      const connectArm = BABYLON.MeshBuilder.CreateCylinder(`${name}ConnectArm`, {
        diameter: 0.12,
        height: 0.6
      }, scene)
      connectArm.position = new BABYLON.Vector3(position.x, position.y - 0.15, position.z)
      connectArm.material = supportMat

      // Câbles
      const cableMat = new BABYLON.StandardMaterial(`${name}CableMat`, scene)
      cableMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1)

      const cable = BABYLON.MeshBuilder.CreateCylinder(`${name}Cable`, {
        diameter: 0.04,
        height: position.y - 1.5
      }, scene)
      cable.position = new BABYLON.Vector3(position.x + 0.1, (position.y - 1.5) / 2 + 1.5, position.z)
      cable.material = cableMat

      return body
    }

    createIndustrialCamera('rgbCamera', new BABYLON.Vector3(-2.5, 5, 0), new BABYLON.Color3(0.23, 0.51, 0.96), 'RGB-4K')
    createIndustrialCamera('nirCamera', new BABYLON.Vector3(0, 5.5, 0), new BABYLON.Color3(0.66, 0.13, 0.66), 'NIR')
    createIndustrialCamera('specCamera', new BABYLON.Vector3(2.5, 5, 0), new BABYLON.Color3(0.13, 0.66, 0.37), 'SPECTRAL')

    // Bras robotiques pneumatiques pour tri automatique
    const createRoboticArm = (side: 'left' | 'right', position: BABYLON.Vector3, targetType: 'accept' | 'reject') => {
      const armMat = new BABYLON.StandardMaterial(`arm${side}Mat`, scene)
      armMat.diffuseColor = new BABYLON.Color3(0.2, 0.22, 0.25)
      armMat.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7)
      armMat.specularPower = 64

      // Base fixe
      const base = BABYLON.MeshBuilder.CreateBox(`arm${side}Base`, {
        width: 0.6,
        height: 0.4,
        depth: 0.6
      }, scene)
      base.position = position
      base.material = armMat

      // Bras principal (pivot)
      const mainArm = BABYLON.MeshBuilder.CreateBox(`arm${side}Main`, {
        width: 0.15,
        height: 1.5,
        depth: 0.15
      }, scene)
      mainArm.position = new BABYLON.Vector3(position.x, position.y + 1, position.z)
      mainArm.material = armMat

      // Joint rotatif
      const joint = BABYLON.MeshBuilder.CreateSphere(`arm${side}Joint`, {
        diameter: 0.25
      }, scene)
      joint.position = new BABYLON.Vector3(position.x, position.y + 1.75, position.z)
      joint.material = armMat

      // Bras extensible (vérin pneumatique)
      const extendArm = BABYLON.MeshBuilder.CreateCylinder(`arm${side}Extend`, {
        diameter: 0.12,
        height: 2
      }, scene)
      extendArm.rotation.z = Math.PI / 2
      extendArm.position = new BABYLON.Vector3(
        position.x + (side === 'left' ? 1 : -1),
        position.y + 1.75,
        position.z
      )
      extendArm.material = armMat

      // Pince/Gripper
      const gripperMat = new BABYLON.StandardMaterial(`gripper${side}Mat`, scene)
      gripperMat.diffuseColor = targetType === 'reject' ? new BABYLON.Color3(0.8, 0.2, 0.2) : new BABYLON.Color3(0.2, 0.8, 0.3)
      gripperMat.emissiveColor = targetType === 'reject' ? new BABYLON.Color3(0.3, 0.05, 0.05) : new BABYLON.Color3(0.05, 0.3, 0.05)

      const gripper = BABYLON.MeshBuilder.CreateBox(`arm${side}Gripper`, {
        width: 0.3,
        height: 0.15,
        depth: 0.4
      }, scene)
      gripper.position = new BABYLON.Vector3(
        position.x + (side === 'left' ? 2 : -2),
        position.y + 1.75,
        position.z
      )
      gripper.material = gripperMat

      // Doigts de la pince
      const fingerMat = new BABYLON.StandardMaterial(`finger${side}Mat`, scene)
      fingerMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15)

      const finger1 = BABYLON.MeshBuilder.CreateBox(`arm${side}Finger1`, {
        width: 0.08,
        height: 0.3,
        depth: 0.08
      }, scene)
      finger1.position = new BABYLON.Vector3(
        gripper.position.x,
        gripper.position.y - 0.15,
        gripper.position.z - 0.15
      )
      finger1.material = fingerMat

      const finger2 = BABYLON.MeshBuilder.CreateBox(`arm${side}Finger2`, {
        width: 0.08,
        height: 0.3,
        depth: 0.08
      }, scene)
      finger2.position = new BABYLON.Vector3(
        gripper.position.x,
        gripper.position.y - 0.15,
        gripper.position.z + 0.15
      )
      finger2.material = fingerMat

      // Tuyaux pneumatiques
      const tubeMat = new BABYLON.StandardMaterial(`tube${side}Mat`, scene)
      tubeMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1)

      const tube = BABYLON.MeshBuilder.CreateCylinder(`arm${side}Tube`, {
        diameter: 0.05,
        height: 2
      }, scene)
      tube.rotation.z = Math.PI / 2
      tube.position = new BABYLON.Vector3(
        position.x + (side === 'left' ? 1 : -1),
        position.y + 1.9,
        position.z
      )
      tube.material = tubeMat

      return { mainArm, extendArm, gripper, finger1, finger2, joint, targetType, side }
    }

    // Créer 4 bras robotiques (2 pour accepter, 2 pour rejeter)
    const leftRejectArm = createRoboticArm('left', new BABYLON.Vector3(-3, 0.5, 2), 'reject')
    const rightAcceptArm = createRoboticArm('right', new BABYLON.Vector3(3, 0.5, 2), 'accept')
    const leftRejectArm2 = createRoboticArm('left', new BABYLON.Vector3(-3, 0.5, -2), 'reject')
    const rightAcceptArm2 = createRoboticArm('right', new BABYLON.Vector3(3, 0.5, -2), 'accept')

    roboticArmsRef.current = [leftRejectArm, rightAcceptArm, leftRejectArm2, rightAcceptArm2]

    // Sol avec grille
    const groundMat = new BABYLON.StandardMaterial('groundMat', scene)
    groundMat.diffuseColor = new BABYLON.Color3(0.08, 0.10, 0.15)
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0)

    const ground = BABYLON.MeshBuilder.CreateGround('ground', {
      width: 30,
      height: 30
    }, scene)
    ground.position.y = -1
    ground.material = groundMat

    // Grille au sol
    const gridMat = new GridMaterial('gridMat', scene)
    gridMat.majorUnitFrequency = 5
    gridMat.minorUnitVisibility = 0.3
    gridMat.gridRatio = 1
    gridMat.backFaceCulling = false
    gridMat.mainColor = new BABYLON.Color3(0.1, 0.15, 0.2)
    gridMat.lineColor = new BABYLON.Color3(0.2, 0.25, 0.3)
    gridMat.opacity = 0.8
    ground.material = gridMat

    // Boucle de rendu
    engine.runRenderLoop(() => {
      scene.render()
      setStats(prev => ({ ...prev, currentFPS: Math.round(engine.getFps()) }))
    })

    // Resize
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

  // Fonction pour créer un objet CSR ultra-détaillé
  const createCSRObject = () => {
    if (!sceneRef.current) return

    const material = materials[Math.floor(Math.random() * materials.length)]
    const scene = sceneRef.current

    // Créer des formes plus variées et réalistes
    const shapes = ['box', 'sphere', 'cylinder', 'torus', 'capsule', 'polyhedron']
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    
    let mesh: BABYLON.Mesh
    const size = 0.4 + Math.random() * 0.5

    if (shape === 'box') {
      // Boîtes irrégulières
      mesh = BABYLON.MeshBuilder.CreateBox(`csr_${Date.now()}`, {
        width: size * (0.8 + Math.random() * 0.4),
        height: size * (0.8 + Math.random() * 0.4),
        depth: size * (0.8 + Math.random() * 0.4)
      }, scene)
    } else if (shape === 'sphere') {
      mesh = BABYLON.MeshBuilder.CreateSphere(`csr_${Date.now()}`, {
        diameter: size,
        segments: 16
      }, scene)
    } else if (shape === 'cylinder') {
      mesh = BABYLON.MeshBuilder.CreateCylinder(`csr_${Date.now()}`, {
        diameter: size * 0.7,
        height: size * 1.5,
        tessellation: 12
      }, scene)
    } else if (shape === 'torus') {
      mesh = BABYLON.MeshBuilder.CreateTorus(`csr_${Date.now()}`, {
        diameter: size,
        thickness: size * 0.3,
        tessellation: 16
      }, scene)
    } else if (shape === 'capsule') {
      mesh = BABYLON.MeshBuilder.CreateCapsule(`csr_${Date.now()}`, {
        radius: size * 0.4,
        height: size * 1.2
      }, scene)
    } else {
      mesh = BABYLON.MeshBuilder.CreatePolyhedron(`csr_${Date.now()}`, {
        type: Math.floor(Math.random() * 5),
        size: size * 0.6
      }, scene)
    }

    // Position de départ
    mesh.position = new BABYLON.Vector3(
      (Math.random() - 0.5) * 3,
      2 + Math.random() * 2,
      -12
    )

    // Rotation aléatoire
    mesh.rotation = new BABYLON.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    // Matériau amélioré avec variations
    const objMat = new BABYLON.StandardMaterial(`mat_${Date.now()}`, scene)
    objMat.diffuseColor = material.color.scale(0.9 + Math.random() * 0.2)
    objMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4)
    objMat.specularPower = 32
    objMat.roughness = 0.5 + Math.random() * 0.3
    
    // Ajouter un peu de brillance pour certains matériaux
    if (material.name.includes('Métaux')) {
      objMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8)
      objMat.specularPower = 64
    } else if (material.name.includes('PE/PP')) {
      objMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6)
      objMat.specularPower = 48
    }
    
    mesh.material = objMat

    // Physique simple
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

    // Animation de l'objet
    scene.registerBeforeRender(() => {
      if (!mesh.isDisposed()) {
        mesh.position.z += speed
        mesh.rotation.addInPlace(rotationSpeed)

        // Gravité simple
        if (mesh.position.y > 0.5) {
          mesh.position.y -= 0.02
        }

        // Détection dans la zone
        if (mesh.position.z > -0.5 && mesh.position.z < 0.5 && !csrObject.detected) {
          csrObject.detected = true

          // Effet visuel de détection
          const detectionMat = mesh.material as BABYLON.StandardMaterial
          if (detectionMat) {
            detectionMat.emissiveColor = csrObject.reject 
              ? new BABYLON.Color3(0.93, 0.26, 0.26)
              : new BABYLON.Color3(0.13, 0.77, 0.37)
          }

          // Animation du bras robotique pour attraper l'objet
          const targetArm = roboticArmsRef.current.find((arm: any) => 
            (csrObject.reject && arm.targetType === 'reject' && Math.abs(arm.gripper.position.z - mesh.position.z) < 3) ||
            (!csrObject.reject && arm.targetType === 'accept' && Math.abs(arm.gripper.position.z - mesh.position.z) < 3)
          )

          if (targetArm) {
            // Animation d'extension du bras vers l'objet
            let animationProgress = 0
            const grabAnimation = setInterval(() => {
              animationProgress += 0.05
              
              if (animationProgress <= 0.5) {
                // Phase 1: Extension du bras vers l'objet
                const extension = animationProgress * 2
                targetArm.gripper.position.x = targetArm.side === 'left' 
                  ? -3 + extension * 1.5
                  : 3 - extension * 1.5
                targetArm.extendArm.scaling.y = 1 + extension * 0.5
                
                // Descendre la pince
                targetArm.gripper.position.y = 2.25 - extension * 0.5
                targetArm.finger1.position.y = targetArm.gripper.position.y - 0.15
                targetArm.finger2.position.y = targetArm.gripper.position.y - 0.15
                
                // Fermer les doigts
                targetArm.finger1.position.z = targetArm.gripper.position.z - 0.15 + extension * 0.1
                targetArm.finger2.position.z = targetArm.gripper.position.z + 0.15 - extension * 0.1
              } else if (animationProgress <= 1) {
                // Phase 2: Attraper et éjecter l'objet
                const retraction = (animationProgress - 0.5) * 2
                
                // Attacher l'objet à la pince
                if (!mesh.isDisposed()) {
                  mesh.position.x = targetArm.gripper.position.x
                  mesh.position.y = targetArm.gripper.position.y - 0.3
                  mesh.position.z = targetArm.gripper.position.z
                  
                  // Éjecter l'objet sur le côté
                  mesh.position.x += (targetArm.side === 'left' ? -1 : 1) * retraction * 3
                  mesh.position.y += retraction * 2
                  
                  // Faire disparaître l'objet
                  if (retraction > 0.8) {
                    mesh.dispose()
                  }
                }
                
                // Rétracter le bras
                targetArm.gripper.position.x = targetArm.side === 'left'
                  ? -3 + 1.5 - retraction * 1.5
                  : 3 - 1.5 + retraction * 1.5
                targetArm.extendArm.scaling.y = 1.5 - retraction * 0.5
                targetArm.gripper.position.y = 1.75 + retraction * 0.5
                targetArm.finger1.position.y = targetArm.gripper.position.y - 0.15
                targetArm.finger2.position.y = targetArm.gripper.position.y - 0.15
                
                // Ouvrir les doigts
                targetArm.finger1.position.z = targetArm.gripper.position.z - 0.05 - retraction * 0.1
                targetArm.finger2.position.z = targetArm.gripper.position.z + 0.05 + retraction * 0.1
              } else {
                clearInterval(grabAnimation)
              }
            }, 20)
          }

          // Mise à jour des stats
          setStats(prev => {
            const newTotal = prev.total + 1
            const newAccepted = prev.accepted + (csrObject.reject ? 0 : 1)
            const newRejected = prev.rejected + (csrObject.reject ? 1 : 0)
            
            // Calcul du taux de chlore basé sur les rejets
            const chloreReduction = (newRejected / newTotal) * 1.7
            const newChlore = Math.max(0.5, 1.2 - chloreReduction)
            
            // Calcul du PCI basé sur la qualité
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

  // Démarrer la simulation
  const startSimulation = () => {
    setIsRunning(true)
    
    // Générer des objets régulièrement
    animationRef.current = window.setInterval(() => {
      createCSRObject()
    }, 800)
  }

  // Arrêter la simulation
  const stopSimulation = () => {
    setIsRunning(false)
    if (animationRef.current) {
      clearInterval(animationRef.current)
      animationRef.current = null
    }
  }

  // Réinitialiser
  const resetSimulation = () => {
    stopSimulation()
    
    // Supprimer tous les objets
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

  // Réinitialiser la vue de la caméra
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
            <p className="text-slate-400">Visualisation réaliste du système de tri intelligent des CSR</p>
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

        {/* Statistiques */}
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

        {/* Canvas Babylon.js */}
        <div className="relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-lg" style={{ height: '600px' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          
          {/* Overlay infos */}
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
