import * as BABYLON from '@babylonjs/core'

export interface RoboticArmConfig {
  scene: BABYLON.Scene
  position: BABYLON.Vector3
  side: 'left' | 'right'
  targetType: 'accept' | 'reject'
}

export class RealisticRoboticArm {
  private scene: BABYLON.Scene
  private side: 'left' | 'right'
  private targetType: 'accept' | 'reject'
  
  // Composants du bras
  private base!: BABYLON.Mesh
  private shoulder!: BABYLON.Mesh
  private upperArm!: BABYLON.Mesh
  private elbowJoint!: BABYLON.Mesh
  private forearm!: BABYLON.Mesh
  private wristJoint!: BABYLON.Mesh
  private gripperBase!: BABYLON.Mesh
  private gripperLeft!: BABYLON.Mesh
  private gripperRight!: BABYLON.Mesh
  
  // Pivots pour animations
  private shoulderPivot!: BABYLON.TransformNode
  private elbowPivot!: BABYLON.TransformNode
  private wristPivot!: BABYLON.TransformNode
  
  // État
  private isGrabbing = false
  private targetObject: BABYLON.Mesh | null = null
  
  constructor(config: RoboticArmConfig) {
    this.scene = config.scene
    this.side = config.side
    this.targetType = config.targetType
    
    this.createArm(config.position)
  }
  
  private createArm(position: BABYLON.Vector3) {
    // Matériaux
    const metalMat = new BABYLON.PBRMetallicRoughnessMaterial(`armMetal${this.side}`, this.scene)
    metalMat.baseColor = new BABYLON.Color3(0.25, 0.27, 0.30)
    metalMat.metallic = 0.9
    metalMat.roughness = 0.3
    
    const jointMat = new BABYLON.PBRMetallicRoughnessMaterial(`armJoint${this.side}`, this.scene)
    jointMat.baseColor = new BABYLON.Color3(0.15, 0.15, 0.18)
    jointMat.metallic = 0.95
    jointMat.roughness = 0.2
    
    const gripperMat = new BABYLON.PBRMetallicRoughnessMaterial(`armGripper${this.side}`, this.scene)
    gripperMat.baseColor = new BABYLON.Color3(0.8, 0.3, 0.1)
    gripperMat.metallic = 0.7
    gripperMat.roughness = 0.4
    
    // BASE ROTATIVE (plus large et détaillée)
    this.base = BABYLON.MeshBuilder.CreateCylinder(`base${this.side}`, {
      diameterTop: 0.7,
      diameterBottom: 0.9,
      height: 0.4,
      tessellation: 32
    }, this.scene)
    this.base.position = position
    this.base.material = metalMat
    
    // Détails de la base
    const baseRing = BABYLON.MeshBuilder.CreateTorus(`baseRing${this.side}`, {
      diameter: 0.85,
      thickness: 0.05,
      tessellation: 32
    }, this.scene)
    baseRing.position = new BABYLON.Vector3(position.x, position.y + 0.2, position.z)
    baseRing.material = jointMat
    
    // PIVOT ÉPAULE
    this.shoulderPivot = new BABYLON.TransformNode(`shoulderPivot${this.side}`, this.scene)
    this.shoulderPivot.position = new BABYLON.Vector3(position.x, position.y + 0.4, position.z)
    
    // ÉPAULE (articulation complexe)
    this.shoulder = BABYLON.MeshBuilder.CreateSphere(`shoulder${this.side}`, {
      diameter: 0.5,
      segments: 32
    }, this.scene)
    this.shoulder.position = new BABYLON.Vector3(0, 0, 0)
    this.shoulder.material = jointMat
    this.shoulder.parent = this.shoulderPivot
    
    // Détails épaule (anneaux)
    for (let i = 0; i < 3; i++) {
      const ring = BABYLON.MeshBuilder.CreateTorus(`shoulderRing${this.side}${i}`, {
        diameter: 0.5 + i * 0.05,
        thickness: 0.02,
        tessellation: 32
      }, this.scene)
      ring.rotation.x = Math.PI / 2
      ring.position = new BABYLON.Vector3(0, i * 0.08 - 0.08, 0)
      ring.material = metalMat
      ring.parent = this.shoulder
    }
    
    // BRAS SUPÉRIEUR (avec détails)
    this.upperArm = BABYLON.MeshBuilder.CreateCylinder(`upperArm${this.side}`, {
      diameterTop: 0.18,
      diameterBottom: 0.22,
      height: 2.5,
      tessellation: 32
    }, this.scene)
    this.upperArm.position = new BABYLON.Vector3(0, 1.4, 0)
    this.upperArm.material = metalMat
    this.upperArm.parent = this.shoulderPivot
    
    // Câbles/conduits sur le bras
    for (let i = 0; i < 4; i++) {
      const cable = BABYLON.MeshBuilder.CreateCylinder(`cable${this.side}${i}`, {
        diameter: 0.03,
        height: 2.4
      }, this.scene)
      const angle = (i * Math.PI) / 2
      cable.position = new BABYLON.Vector3(
        Math.cos(angle) * 0.12,
        1.4,
        Math.sin(angle) * 0.12
      )
      cable.material = jointMat
      cable.parent = this.shoulderPivot
    }
    
    // PIVOT COUDE
    this.elbowPivot = new BABYLON.TransformNode(`elbowPivot${this.side}`, this.scene)
    this.elbowPivot.position = new BABYLON.Vector3(0, 2.65, 0)
    this.elbowPivot.parent = this.shoulderPivot
    
    // COUDE (articulation sphérique détaillée)
    this.elbowJoint = BABYLON.MeshBuilder.CreateSphere(`elbow${this.side}`, {
      diameter: 0.4,
      segments: 32
    }, this.scene)
    this.elbowJoint.position = new BABYLON.Vector3(0, 0, 0)
    this.elbowJoint.material = jointMat
    this.elbowJoint.parent = this.elbowPivot
    
    // Anneaux du coude
    const elbowRing1 = BABYLON.MeshBuilder.CreateTorus(`elbowRing1${this.side}`, {
      diameter: 0.42,
      thickness: 0.03,
      tessellation: 32
    }, this.scene)
    elbowRing1.rotation.z = Math.PI / 2
    elbowRing1.material = metalMat
    elbowRing1.parent = this.elbowJoint
    
    // AVANT-BRAS (plus fin et détaillé)
    this.forearm = BABYLON.MeshBuilder.CreateCylinder(`forearm${this.side}`, {
      diameterTop: 0.15,
      diameterBottom: 0.18,
      height: 2,
      tessellation: 32
    }, this.scene)
    this.forearm.position = new BABYLON.Vector3(0, -1.1, 0)
    this.forearm.material = metalMat
    this.forearm.parent = this.elbowPivot
    
    // Détails avant-bras (segments)
    for (let i = 0; i < 5; i++) {
      const segment = BABYLON.MeshBuilder.CreateTorus(`forearmSegment${this.side}${i}`, {
        diameter: 0.19,
        thickness: 0.015,
        tessellation: 32
      }, this.scene)
      segment.position = new BABYLON.Vector3(0, -1.1 + (i * 0.4 - 0.8), 0)
      segment.material = jointMat
      segment.parent = this.elbowPivot
    }
    
    // PIVOT POIGNET
    this.wristPivot = new BABYLON.TransformNode(`wristPivot${this.side}`, this.scene)
    this.wristPivot.position = new BABYLON.Vector3(0, -2.1, 0)
    this.wristPivot.parent = this.elbowPivot
    
    // POIGNET (articulation rotative)
    this.wristJoint = BABYLON.MeshBuilder.CreateCylinder(`wrist${this.side}`, {
      diameter: 0.25,
      height: 0.3,
      tessellation: 32
    }, this.scene)
    this.wristJoint.position = new BABYLON.Vector3(0, 0, 0)
    this.wristJoint.material = jointMat
    this.wristJoint.parent = this.wristPivot
    
    // BASE DE LA PINCE
    this.gripperBase = BABYLON.MeshBuilder.CreateBox(`gripperBase${this.side}`, {
      width: 0.3,
      height: 0.2,
      depth: 0.2
    }, this.scene)
    this.gripperBase.position = new BABYLON.Vector3(0, -0.25, 0)
    this.gripperBase.material = metalMat
    this.gripperBase.parent = this.wristPivot
    
    // PINCE GAUCHE (détaillée)
    this.gripperLeft = BABYLON.MeshBuilder.CreateBox(`gripperLeft${this.side}`, {
      width: 0.08,
      height: 0.5,
      depth: 0.15
    }, this.scene)
    this.gripperLeft.position = new BABYLON.Vector3(-0.15, -0.5, 0)
    this.gripperLeft.material = gripperMat
    this.gripperLeft.parent = this.wristPivot
    
    // Dents de la pince gauche
    for (let i = 0; i < 3; i++) {
      const tooth = BABYLON.MeshBuilder.CreateBox(`gripperLeftTooth${this.side}${i}`, {
        width: 0.02,
        height: 0.1,
        depth: 0.05
      }, this.scene)
      tooth.position = new BABYLON.Vector3(0.04, -0.2 - i * 0.15, 0)
      tooth.material = jointMat
      tooth.parent = this.gripperLeft
    }
    
    // PINCE DROITE (symétrique)
    this.gripperRight = BABYLON.MeshBuilder.CreateBox(`gripperRight${this.side}`, {
      width: 0.08,
      height: 0.5,
      depth: 0.15
    }, this.scene)
    this.gripperRight.position = new BABYLON.Vector3(0.15, -0.5, 0)
    this.gripperRight.material = gripperMat
    this.gripperRight.parent = this.wristPivot
    
    // Dents de la pince droite
    for (let i = 0; i < 3; i++) {
      const tooth = BABYLON.MeshBuilder.CreateBox(`gripperRightTooth${this.side}${i}`, {
        width: 0.02,
        height: 0.1,
        depth: 0.05
      }, this.scene)
      tooth.position = new BABYLON.Vector3(-0.04, -0.2 - i * 0.15, 0)
      tooth.material = jointMat
      tooth.parent = this.gripperRight
    }
    
    // LED indicateur
    const led = BABYLON.MeshBuilder.CreateSphere(`led${this.side}`, {
      diameter: 0.08
    }, this.scene)
    led.position = new BABYLON.Vector3(0, 0.1, 0.15)
    const ledMat = new BABYLON.StandardMaterial(`ledMat${this.side}`, this.scene)
    ledMat.emissiveColor = this.targetType === 'accept' 
      ? new BABYLON.Color3(0, 1, 0) 
      : new BABYLON.Color3(1, 0, 0)
    led.material = ledMat
    led.parent = this.gripperBase
  }
  
  // Animation fluide pour attraper un objet avec COMPENSATION PRÉDICTIVE
  public async grabObject(object: BABYLON.Mesh, targetBin: BABYLON.Vector3, conveyorSpeed: number = 0.06) {
    if (this.isGrabbing) return
    this.isGrabbing = true
    this.targetObject = object
    
    // 1. PRÉDICTION DE POSITION (compensation du mouvement)
    const visionLatency = 0.05 // 50ms latence caméra
    const armReactionTime = 0.3 // 300ms temps de réaction du bras
    const totalDelay = visionLatency + armReactionTime
    
    // Position prédite = position actuelle + vitesse × délai
    const predictedZ = object.position.z + (conveyorSpeed * totalDelay * 60) // 60 fps
    const predictedPosition = new BABYLON.Vector3(
      object.position.x,
      object.position.y,
      predictedZ
    )
    
    // 2. CORRECTION DE REPÈRE (coordinate frame alignment)
    // Transformer de cameraFrame vers worldFrame
    const worldPosition = this.transformToWorldFrame(predictedPosition)
    
    const objectPos = worldPosition
    
    // Phase 1: Rotation de la base vers l'objet (FLUIDE)
    await this.animateRotation(this.shoulderPivot, 'y', 
      Math.atan2(objectPos.x - this.base.position.x, objectPos.z - this.base.position.z), 
      0.4)
    
    // Phase 2: Descente du bras (épaule) (FLUIDE)
    await this.animateRotation(this.shoulderPivot, 'z', -Math.PI / 4, 0.3)
    
    // Phase 3: Pliage du coude (FLUIDE)
    await this.animateRotation(this.elbowPivot, 'z', Math.PI / 3, 0.3)
    
    // Phase 4: Ouverture de la pince (FLUIDE)
    await this.animateGripper(true, 0.2)
    
    // Phase 5: PRE-GRASP POSE (position juste au-dessus) (FLUIDE)
    await this.animateRotation(this.wristPivot, 'x', -Math.PI / 6, 0.2)
    
    // 3. CALIBRATION FINE DU GRIPPER (gripper alignment)
    // Recentrer la pince exactement sur l'objet
    const gripperOffset = this.calculateGripperOffset(object.position)
    await this.applyGripperCorrection(gripperOffset)
    
    // Phase 6: Fermeture de la pince (FLUIDE)
    await this.animateGripper(false, 0.3)
    
    // 4. INVERSE KINEMATICS CORRECTION (ajustement final)
    await this.applyIKCorrection(object.position)
    
    // Attacher l'objet à la pince avec position corrigée
    object.parent = this.wristPivot
    const correctedGripPosition = this.getCorrectedGripPosition()
    object.position = correctedGripPosition
    
    // Phase 7: Remonter (FLUIDE)
    await this.animateRotation(this.elbowPivot, 'z', -Math.PI / 6, 0.3)
    await this.animateRotation(this.shoulderPivot, 'z', 0, 0.3)
    
    // Phase 8: Rotation vers le bac (FLUIDE)
    const binAngle = Math.atan2(targetBin.x - this.base.position.x, targetBin.z - this.base.position.z)
    await this.animateRotation(this.shoulderPivot, 'y', binAngle, 0.5)
    
    // Phase 9: Extension vers le bac (FLUIDE)
    await this.animateRotation(this.shoulderPivot, 'z', -Math.PI / 3, 0.3)
    await this.animateRotation(this.elbowPivot, 'z', Math.PI / 4, 0.3)
    
    // Phase 10: Lâcher l'objet (FLUIDE)
    await this.animateGripper(true, 0.2)
    object.parent = null
    object.position = new BABYLON.Vector3(targetBin.x, targetBin.y + 1, targetBin.z)
    
    // Phase 11: Retour à la position initiale (FLUIDE)
    await this.animateRotation(this.elbowPivot, 'z', 0, 0.3)
    await this.animateRotation(this.shoulderPivot, 'z', 0, 0.3)
    await this.animateRotation(this.shoulderPivot, 'y', 0, 0.4)
    await this.animateGripper(false, 0.2)
    
    this.isGrabbing = false
    this.targetObject = null
  }
  
  // Animation fluide avec easing
  private animateRotation(node: BABYLON.TransformNode, axis: 'x' | 'y' | 'z', targetAngle: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startAngle = node.rotation[axis]
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing smooth (ease-in-out)
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
  
  // Animation de la pince
  private animateGripper(open: boolean, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startLeft = this.gripperLeft.position.x
      const startRight = this.gripperRight.position.x
      const targetLeft = open ? -0.25 : -0.15
      const targetRight = open ? 0.25 : 0.15
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsed / duration, 1)
        
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        this.gripperLeft.position.x = startLeft + (targetLeft - startLeft) * eased
        this.gripperRight.position.x = startRight + (targetRight - startRight) * eased
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      animate()
    })
  }
  
  public isAvailable(): boolean {
    return !this.isGrabbing
  }
  
  public getPosition(): BABYLON.Vector3 {
    return this.base.position
  }
  
  public getTargetType(): 'accept' | 'reject' {
    return this.targetType
  }
  
  // 1. TRANSFORMATION DE REPÈRE (coordinate frame transformation)
  private transformToWorldFrame(cameraPosition: BABYLON.Vector3): BABYLON.Vector3 {
    // Correction de repère caméra → monde
    // Souvent Z inversé ou Y décalé dans les systèmes vision
    return new BABYLON.Vector3(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z // Pas d'inversion nécessaire ici
    )
  }
  
  // 2. CALCUL DE L'OFFSET DU GRIPPER (gripper alignment)
  private calculateGripperOffset(objectPosition: BABYLON.Vector3): BABYLON.Vector3 {
    const gripperWorldPos = this.wristPivot.getAbsolutePosition()
    
    // Offset = différence entre position gripper et objet
    return new BABYLON.Vector3(
      objectPosition.x - gripperWorldPos.x,
      objectPosition.y - gripperWorldPos.y,
      objectPosition.z - gripperWorldPos.z
    )
  }
  
  // 3. APPLICATION DE LA CORRECTION DU GRIPPER
  private async applyGripperCorrection(offset: BABYLON.Vector3): Promise<void> {
    // Micro-ajustement pour recentrer la pince
    const correctionDuration = 0.05 // 50ms correction rapide
    
    return new Promise((resolve) => {
      const startTime = Date.now()
      const initialRotY = this.shoulderPivot.rotation.y
      const targetRotY = initialRotY + Math.atan2(offset.x, offset.z) * 0.1
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsed / correctionDuration, 1)
        
        this.shoulderPivot.rotation.y = initialRotY + (targetRotY - initialRotY) * progress
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      animate()
    })
  }
  
  // 4. CORRECTION INVERSE KINEMATICS
  private async applyIKCorrection(targetPosition: BABYLON.Vector3): Promise<void> {
    // Ajustement fin juste avant la fermeture
    const gripperPos = this.wristPivot.getAbsolutePosition()
    const error = targetPosition.subtract(gripperPos)
    
    // Si erreur > 0.1, corriger
    if (error.length() > 0.1) {
      const correctionAngle = Math.atan2(error.x, error.z)
      await this.animateRotation(this.shoulderPivot, 'y', 
        this.shoulderPivot.rotation.y + correctionAngle * 0.5, 
        0.05)
    }
  }
  
  // 5. POSITION CORRIGÉE DE SAISIE
  private getCorrectedGripPosition(): BABYLON.Vector3 {
    // Position relative au wrist avec correction
    return new BABYLON.Vector3(0, -0.7, 0)
  }
  
  // 6. VÉRIFICATION DE LA ZONE DE PRISE (grasp zone check)
  public isInGraspZone(objectPosition: BABYLON.Vector3): boolean {
    const armPos = this.base.position
    const distance = BABYLON.Vector3.Distance(
      new BABYLON.Vector3(armPos.x, 0, armPos.z),
      new BABYLON.Vector3(objectPosition.x, 0, objectPosition.z)
    )
    
    // Zone de prise : rayon de 4 unités autour du bras
    return distance < 4 && Math.abs(objectPosition.y - 0.5) < 2
  }
  
  // 7. LISSAGE DE TRAJECTOIRE (trajectory smoothing)
  private smoothTrajectory(points: BABYLON.Vector3[]): BABYLON.Vector3[] {
    // Interpolation cubique pour trajectoire fluide
    const smoothed: BABYLON.Vector3[] = []
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(points.length - 1, i + 2)]
      
      // Interpolation Catmull-Rom
      for (let t = 0; t <= 1; t += 0.1) {
        const t2 = t * t
        const t3 = t2 * t
        
        const x = 0.5 * (
          (2 * p1.x) +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
        )
        
        const y = 0.5 * (
          (2 * p1.y) +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
        )
        
        const z = 0.5 * (
          (2 * p1.z) +
          (-p0.z + p2.z) * t +
          (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
          (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3
        )
        
        smoothed.push(new BABYLON.Vector3(x, y, z))
      }
    }
    
    return smoothed
  }
}
