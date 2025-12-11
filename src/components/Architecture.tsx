import { Camera, Cpu, Database, Zap, Layers, Eye, Cog, BarChart3, Shield, Clock, Target, Workflow, Server, Wifi, Bot, Gauge, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'

export default function Architecture() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Architecture NATRAN</h1>
            <p className="text-slate-300">Système de Tri Prédictif par Intelligence Artificielle</p>
          </div>
        </div>
        <p className="text-slate-300 max-w-4xl leading-relaxed">
          Notre architecture combine <span className="text-white font-semibold">vision artificielle multi-spectrale</span>, 
          <span className="text-white font-semibold"> intelligence artificielle embarquée</span> et 
          <span className="text-white font-semibold"> robotique industrielle</span> pour optimiser en temps réel 
          la composition des CSR avant pyro-gazéification. Le système fonctionne en boucle fermée avec 
          rétroaction continue pour garantir une qualité constante.
        </p>
      </div>

      {/* Vue d'ensemble du Pipeline */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pipeline de Traitement</h2>
        <p className="text-slate-600 mb-8">
          Du CSR brut au combustible optimisé en 4 étapes automatisées
        </p>

        <div className="relative">
          {/* Ligne de connexion */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 rounded-full"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <PipelineStep
              number="1"
              icon={Camera}
              title="Acquisition"
              subtitle="Capture Multi-Spectrale"
              description="Les CSR passent sous un système de caméras qui capture simultanément des images RGB haute définition et des spectres NIR/SWIR pour identifier la composition chimique."
              details={[
                'Caméras RGB 4K @ 60fps',
                'Capteurs NIR (900-1700nm)',
                'Capteurs SWIR (1000-2500nm)',
                'Éclairage LED calibré',
                'Synchronisation < 1ms'
              ]}
              color="blue"
            />
            <PipelineStep
              number="2"
              icon={Cpu}
              title="Analyse IA"
              subtitle="Classification Temps Réel"
              description="Le modèle YOLOv8 optimisé analyse chaque objet en moins de 20ms, identifiant le type de matériau et sa composition chimique probable (chlore, métaux, etc.)."
              details={[
                'YOLOv8-nano optimisé TensorRT',
                'Inférence GPU < 20ms',
                '12 classes de matériaux',
                'Confiance > 96.8%',
                'Détection multi-objets'
              ]}
              color="purple"
            />
            <PipelineStep
              number="3"
              icon={Bot}
              title="Séparation"
              subtitle="Actionneurs Robotisés"
              description="Les bras robotiques pneumatiques éjectent les contaminants identifiés (PVC, métaux) vers des bacs dédiés, ne laissant passer que les matériaux conformes."
              details={[
                'Bras 6 axes haute vitesse',
                'Temps de réaction < 100ms',
                'Précision ±2mm',
                'Jets d\'air 6 bars',
                'Capacité 2000 obj/min'
              ]}
              color="green"
            />
            <PipelineStep
              number="4"
              icon={Gauge}
              title="Validation"
              subtitle="Contrôle Qualité"
              description="Un second passage de caméras vérifie la qualité du flux sortant et ajuste les paramètres en temps réel via une boucle de rétroaction."
              details={[
                'Vérification post-tri',
                'Mesure PCI en continu',
                'Ajustement dynamique',
                'Logging complet',
                'Alertes automatiques'
              ]}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Section Détaillée - Vision Artificielle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Système de Vision</h3>
              <p className="text-sm text-slate-500">Acquisition multi-spectrale</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <DetailCard
              title="Caméras RGB Industrielles"
              description="4 caméras 4K synchronisées capturent des images haute résolution à 60 fps. Objectifs télécentrique pour éviter les distorsions."
              specs={['Résolution: 3840x2160', 'Cadence: 60 fps', 'Interface: GigE Vision']}
            />
            <DetailCard
              title="Capteurs NIR/SWIR"
              description="Spectroscopie proche infrarouge pour identifier la signature chimique des polymères (PVC, PE, PP, PET)."
              specs={['Plage: 900-2500nm', 'Résolution spectrale: 10nm', 'Temps acquisition: 5ms']}
            />
            <DetailCard
              title="Éclairage Contrôlé"
              description="Rampes LED haute puissance avec spectre calibré pour garantir des conditions d'acquisition constantes."
              specs={['Puissance: 500W', 'Température: 5600K', 'Uniformité: >95%']}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Intelligence Artificielle</h3>
              <p className="text-sm text-slate-500">Modèle de classification</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <DetailCard
              title="Architecture YOLOv8-nano"
              description="Modèle optimisé pour l'inférence embarquée, entraîné sur 50,000+ images annotées de CSR réels."
              specs={['Paramètres: 3.2M', 'FLOPs: 8.7G', 'Taille: 6.3 MB']}
            />
            <DetailCard
              title="Optimisation TensorRT"
              description="Compilation du modèle pour GPU NVIDIA avec quantification INT8 pour maximiser les performances."
              specs={['Précision: INT8/FP16', 'Latence: <20ms', 'Throughput: 150 fps']}
            />
            <DetailCard
              title="Classes Détectées"
              description="12 catégories de matériaux avec sous-classification pour les contaminants critiques."
              specs={['PVC/Chlorés', 'PE/PP/PS', 'Métaux ferreux/non-ferreux', 'Papier/Carton/Bois']}
            />
          </div>
        </div>
      </div>

      {/* Section Infrastructure Hardware */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <Server className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Infrastructure Matérielle</h3>
            <p className="text-sm text-slate-500">Composants du système NATRAN</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HardwareCard
            icon={Cpu}
            title="Unité de Calcul"
            model="NVIDIA Jetson AGX Orin"
            specs={[
              '12-core ARM Cortex',
              '2048 CUDA cores',
              '64 GB RAM',
              '275 TOPS IA'
            ]}
          />
          <HardwareCard
            icon={Camera}
            title="Caméras"
            model="4x Basler ace 2"
            specs={[
              'Capteur Sony IMX',
              '4K @ 60fps',
              'GigE Vision',
              'Sync hardware'
            ]}
          />
          <HardwareCard
            icon={Bot}
            title="Bras Robotiques"
            model="4x FANUC LR Mate"
            specs={[
              '6 axes',
              'Charge 7kg',
              'Portée 717mm',
              'Répétabilité ±0.02mm'
            ]}
          />
          <HardwareCard
            icon={Wifi}
            title="Réseau Industriel"
            model="EtherCAT + OPC-UA"
            specs={[
              'Latence < 1ms',
              'Déterministe',
              'Redondance',
              'Cybersécurité IEC 62443'
            ]}
          />
        </div>
      </div>

      {/* Section Dataset et Entraînement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Dataset</h3>
          </div>
          <div className="space-y-3">
            <StatItem label="Images annotées" value="50,000+" icon={Camera} />
            <StatItem label="Classes de matériaux" value="12" icon={Layers} />
            <StatItem label="Annotations bbox" value="180,000+" icon={Target} />
            <StatItem label="Augmentations" value="15 types" icon={Cog} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Performances</h3>
          </div>
          <div className="space-y-3">
            <StatItem label="mAP@50" value="96.8%" icon={Target} color="green" />
            <StatItem label="mAP@50-95" value="82.4%" icon={Target} color="green" />
            <StatItem label="Précision" value="97.2%" icon={CheckCircle2} color="green" />
            <StatItem label="Rappel" value="95.6%" icon={CheckCircle2} color="green" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Entraînement</h3>
          </div>
          <div className="space-y-3">
            <StatItem label="Durée totale" value="48h" icon={Clock} />
            <StatItem label="GPU utilisé" value="RTX 4090" icon={Cpu} />
            <StatItem label="Epochs" value="300" icon={Workflow} />
            <StatItem label="Batch size" value="64" icon={Layers} />
          </div>
        </div>
      </div>

      {/* Section Matériaux Détectés */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Classes de Matériaux Détectés</h3>
        <p className="text-slate-600 mb-6">12 catégories avec classification automatique conforme/non-conforme</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MaterialCard name="PVC" status="reject" chlore="56%" description="Polychlorure de vinyle - Forte teneur en chlore" />
          <MaterialCard name="PE" status="accept" chlore="0%" description="Polyéthylène - Excellent combustible" />
          <MaterialCard name="PP" status="accept" chlore="0%" description="Polypropylène - Haut PCI" />
          <MaterialCard name="PS" status="accept" chlore="0%" description="Polystyrène - Bon combustible" />
          <MaterialCard name="PET" status="uncertain" chlore="0%" description="Polyéthylène téréphtalate - Variable" />
          <MaterialCard name="Papier" status="accept" chlore="0%" description="Cellulose - Combustible naturel" />
          <MaterialCard name="Carton" status="accept" chlore="0%" description="Cellulose compressée" />
          <MaterialCard name="Bois" status="accept" chlore="0%" description="Biomasse - Excellent PCI" />
          <MaterialCard name="Textile" status="uncertain" chlore="~5%" description="Variable selon composition" />
          <MaterialCard name="Métaux Fe" status="reject" chlore="-" description="Ferreux - Recyclage" />
          <MaterialCard name="Métaux NF" status="reject" chlore="-" description="Non-ferreux - Recyclage" />
          <MaterialCard name="Autres" status="uncertain" chlore="?" description="Nécessite analyse manuelle" />
        </div>
      </div>

      {/* Section Avantages */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Avantages de l'Architecture NATRAN</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdvantageCard
            icon={Zap}
            title="Temps Réel"
            value="< 20ms"
            description="Latence totale du pipeline, de l'acquisition à la décision d'éjection"
          />
          <AdvantageCard
            icon={Target}
            title="Précision"
            value="96.8%"
            description="Taux de classification correct sur l'ensemble des matériaux"
          />
          <AdvantageCard
            icon={Gauge}
            title="Débit"
            value="2 t/h"
            description="Capacité de traitement avec 4 caméras et 4 bras robotiques"
          />
          <AdvantageCard
            icon={Shield}
            title="Réduction Chlore"
            value="-68%"
            description="Diminution du taux de chlore dans le flux sortant"
          />
          <AdvantageCard
            icon={Lightbulb}
            title="Qualité Syngas"
            value="+42%"
            description="Amélioration de la pureté du gaz de synthèse produit"
          />
          <AdvantageCard
            icon={Clock}
            title="ROI"
            value="< 2 ans"
            description="Retour sur investissement grâce aux économies réalisées"
          />
        </div>
      </div>

      {/* Section Schéma Technique - Version Moderne */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Schéma de Communication</h3>
        <p className="text-slate-600 mb-8">Architecture temps réel du système NATRAN</p>
        
        <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-inner overflow-hidden">
          {/* Titre du système */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-6 rounded-t-2xl">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold tracking-wide">SYSTÈME NATRAN</span>
              <span className="text-slate-400 text-sm">• Actif</span>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            {/* Niveau 1 - Caméras */}
            <div className="flex justify-center gap-4 flex-wrap">
              <CameraNode type="RGB" number={1} color="blue" />
              <CameraNode type="RGB" number={2} color="blue" />
              <CameraNode type="NIR" number={3} color="purple" />
              <CameraNode type="SWIR" number={4} color="indigo" />
            </div>

            {/* Connexions vers le processeur */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="flex gap-8">
                  <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-slate-400"></div>
                  <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-slate-400"></div>
                  <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-slate-400"></div>
                  <div className="w-px h-8 bg-gradient-to-b from-indigo-400 to-slate-400"></div>
                </div>
                <div className="w-64 h-px bg-slate-400"></div>
                <div className="w-px h-8 bg-slate-400"></div>
                <div className="w-4 h-4 border-l-2 border-b-2 border-slate-400 rotate-[-45deg] -mt-2"></div>
              </div>
            </div>

            {/* Niveau 2 - Processeur */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-6 shadow-xl border-2 border-green-600 min-w-[280px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-100 font-bold">NVIDIA Jetson</p>
                    <p className="text-green-300 text-sm">AGX Orin 64GB</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-200 text-sm font-mono">Inférence Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-800/50 rounded px-2 py-1 text-green-200">
                      <span className="text-green-400">YOLOv8</span>-nano
                    </div>
                    <div className="bg-green-800/50 rounded px-2 py-1 text-green-200">
                      <span className="text-green-400">TensorRT</span> 8.6
                    </div>
                    <div className="bg-green-800/50 rounded px-2 py-1 text-green-200">
                      <span className="text-green-400">CUDA</span> 12.0
                    </div>
                    <div className="bg-green-800/50 rounded px-2 py-1 text-green-200">
                      <span className="text-green-400">&lt;20ms</span> latence
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connexions vers les bras */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-slate-400"></div>
                <div className="w-80 h-px bg-slate-400"></div>
                <div className="flex justify-between w-80">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-red-400"></div>
                    <div className="w-3 h-3 border-l-2 border-b-2 border-red-400 rotate-[-45deg] -mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-red-400"></div>
                    <div className="w-3 h-3 border-l-2 border-b-2 border-red-400 rotate-[-45deg] -mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-green-400"></div>
                    <div className="w-3 h-3 border-l-2 border-b-2 border-green-400 rotate-[-45deg] -mt-1"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-green-400"></div>
                    <div className="w-3 h-3 border-l-2 border-b-2 border-green-400 rotate-[-45deg] -mt-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Niveau 3 - Bras robotiques TRI INITIAL */}
            <div className="flex justify-center gap-4 flex-wrap">
              <ArmNode type="Rejet" number={1} color="red" />
              <ArmNode type="Rejet" number={2} color="red" />
              <ArmNode type="Accept" number={3} color="green" />
              <ArmNode type="Accept" number={4} color="green" />
            </div>

            {/* Convoyeur Principal */}
            <div className="relative mt-6">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg shadow-inner"></div>
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded flex items-center justify-center overflow-hidden">
                <div className="relative z-10 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-500">
                  <span className="text-white font-bold text-sm tracking-wider">CONVOYEUR CSR</span>
                  <span className="text-slate-400 ml-2 text-xs">• 2 t/h</span>
                </div>
              </div>
              <div className="h-14"></div>
            </div>

            {/* Flèches vers les convoyeurs QC */}
            <div className="flex justify-between px-12 -mt-2">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-red-400"></div>
                <div className="w-3 h-3 border-l-2 border-b-2 border-red-400 rotate-[-45deg] -mt-1"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-green-400"></div>
                <div className="w-3 h-3 border-l-2 border-b-2 border-green-400 rotate-[-45deg] -mt-1"></div>
              </div>
            </div>

            {/* Section Contrôle Qualité */}
            <div className="bg-gradient-to-r from-orange-50 via-slate-50 to-teal-50 rounded-xl p-4 border border-slate-200 mt-2">
              <div className="text-center mb-4">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border">
                  🔍 Zone Contrôle Qualité
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Convoyeur QC Non-Conformes (gauche) */}
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-xs font-semibold text-red-600">Convoyeur Non-Conformes</span>
                  </div>
                  <div className="bg-gradient-to-r from-red-200 to-red-300 h-8 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex gap-4 animate-conveyor">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-red-400/50"></div>
                      ))}
                    </div>
                    <span className="relative z-10 text-xs font-medium text-red-800">→ Incinérateur</span>
                  </div>
                  <div className="flex justify-center">
                    <ArmNode type="QC Vert" number={5} color="green" />
                  </div>
                  <p className="text-xs text-center text-teal-600 font-medium">
                    ↑ Récupère les Faux Négatifs (4.4%)
                  </p>
                </div>

                {/* Convoyeur QC Conformes (droite) */}
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-xs font-semibold text-green-600">Convoyeur Conformes</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-200 to-green-300 h-8 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex gap-4 animate-conveyor">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-green-400/50"></div>
                      ))}
                    </div>
                    <span className="relative z-10 text-xs font-medium text-green-800">→ Réacteur</span>
                  </div>
                  <div className="flex justify-center">
                    <ArmNode type="QC Orange" number={6} color="orange" />
                  </div>
                  <p className="text-xs text-center text-orange-600 font-medium">
                    ↑ Éjecte les Faux Positifs (2.8%)
                  </p>
                </div>
              </div>
            </div>

            {/* Destinations finales */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-red-100 border border-red-300 rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">🔥</span>
                </div>
                <p className="text-xs font-bold text-red-700">Incinérateur</p>
                <p className="text-xs text-red-600">Non-conformes</p>
              </div>
              <div className="bg-orange-100 border border-orange-300 rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">📦</span>
                </div>
                <p className="text-xs font-bold text-orange-700">Bac QC</p>
                <p className="text-xs text-orange-600">Faux Positifs</p>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <p className="text-xs font-bold text-green-700">Réacteur</p>
                <p className="text-xs text-green-600">Pyro-gazéification</p>
              </div>
            </div>

            {/* Légende */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-600">RGB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-slate-600">NIR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-xs text-slate-600">SWIR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-slate-600">Rejet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-600">Accept</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-slate-600">QC FP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-xs text-slate-600">QC FN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composants auxiliaires

function PipelineStep({ number, icon: Icon, title, subtitle, description, details, color }: any) {
  const colors: Record<string, { bg: string, text: string, border: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200' },
    green: { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-200' }
  }

  return (
    <div className={`bg-white rounded-xl p-5 border-2 ${colors[color].border} relative`}>
      <div className={`absolute -top-4 left-4 w-8 h-8 ${colors[color].bg} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
        {number}
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${colors[color].text}`} />
          <h4 className="font-bold text-slate-900">{title}</h4>
        </div>
        <p className={`text-xs font-medium ${colors[color].text} mb-2`}>{subtitle}</p>
        <p className="text-sm text-slate-600 mb-3">{description}</p>
        <ul className="space-y-1">
          {details.map((detail: string, i: number) => (
            <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
              <div className={`w-1 h-1 ${colors[color].bg} rounded-full`}></div>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DetailCard({ title, description, specs }: any) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-600 mb-2">{description}</p>
      <div className="flex flex-wrap gap-2">
        {specs.map((spec: string, i: number) => (
          <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
            {spec}
          </span>
        ))}
      </div>
    </div>
  )
}

function HardwareCard({ icon: Icon, title, model, specs }: any) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-slate-700" />
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-500">{model}</p>
        </div>
      </div>
      <ul className="space-y-1">
        {specs.map((spec: string, i: number) => (
          <li key={i} className="text-xs text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {spec}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatItem({ label, value, icon: Icon, color = 'slate' }: any) {
  const textColor = color === 'green' ? 'text-green-600' : 'text-slate-900'
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className={`text-sm font-bold ${textColor}`}>{value}</span>
    </div>
  )
}

function MaterialCard({ name, status, chlore, description }: any) {
  const statusConfig: Record<string, { bg: string, text: string, icon: any }> = {
    accept: { bg: 'bg-green-100 border-green-200', text: 'text-green-700', icon: CheckCircle2 },
    reject: { bg: 'bg-red-100 border-red-200', text: 'text-red-700', icon: AlertTriangle },
    uncertain: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-700', icon: AlertTriangle }
  }
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className={`${config.bg} border rounded-xl p-3 text-center`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <StatusIcon className={`w-4 h-4 ${config.text}`} />
        <span className={`font-bold ${config.text}`}>{name}</span>
      </div>
      <p className="text-xs text-slate-600 mb-1">{description}</p>
      <span className="text-xs font-medium text-slate-500">Cl: {chlore}</span>
    </div>
  )
}

function AdvantageCard({ icon: Icon, title, value, description }: any) {
  return (
    <div className="bg-white/10 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-300">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  )
}

function CameraNode({ type, number, color }: { type: string, number: number, color: string }) {
  const colors: Record<string, { bg: string, border: string, text: string, glow: string }> = {
    blue: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-100', glow: 'shadow-blue-500/50' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-100', glow: 'shadow-purple-500/50' },
    indigo: { bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-100', glow: 'shadow-indigo-500/50' }
  }
  const c = colors[color]
  
  return (
    <div className={`${c.bg} rounded-xl p-4 shadow-lg ${c.glow} border-2 ${c.border} min-w-[100px]`}>
      <div className="flex items-center justify-between mb-2">
        <Camera className="w-5 h-5 text-white" />
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
      <p className="text-white font-bold text-sm">Caméra {number}</p>
      <p className={`${c.text} text-xs font-medium`}>{type}</p>
    </div>
  )
}

function ArmNode({ type, number, color }: { type: string, number: number, color: string }) {
  const colors: Record<string, { bg: string, border: string, text: string, glow: string }> = {
    red: { bg: 'bg-gradient-to-br from-red-500 to-red-600', border: 'border-red-400', text: 'text-red-100', glow: 'shadow-red-500/50' },
    green: { bg: 'bg-gradient-to-br from-green-500 to-green-600', border: 'border-green-400', text: 'text-green-100', glow: 'shadow-green-500/50' },
    orange: { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', border: 'border-orange-400', text: 'text-orange-100', glow: 'shadow-orange-500/50' },
    teal: { bg: 'bg-gradient-to-br from-teal-500 to-teal-600', border: 'border-teal-400', text: 'text-teal-100', glow: 'shadow-teal-500/50' }
  }
  const c = colors[color]
  
  return (
    <div className={`${c.bg} rounded-xl p-4 shadow-lg ${c.glow} border-2 ${c.border} min-w-[100px]`}>
      <div className="flex items-center justify-between mb-2">
        <Bot className="w-5 h-5 text-white" />
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-white font-bold text-sm">Bras {number}</p>
      <p className={`${c.text} text-xs font-medium`}>{type}</p>
    </div>
  )
}
