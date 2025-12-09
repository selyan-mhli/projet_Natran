import { Camera, Cpu, Database, Zap, ArrowRight, Layers } from 'lucide-react'

export default function Architecture() {
  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Architecture du système de tri prédictif</h2>
        <p className="text-slate-400 mb-6">
          Infrastructure intégrée de caractérisation et séparation des CSR par vision artificielle
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SystemCard
            icon={Camera}
            title="Acquisition"
            description="Système d'acquisition multi-spectral haute résolution"
            features={[
              'Caméras RGB 4K',
              'Capteurs NIR/SWIR',
              'Détection thermique',
              'Capteurs de poids'
            ]}
          />
          <SystemCard
            icon={Cpu}
            title="Traitement IA"
            description="Unité de traitement et classification temps réel"
            features={[
              'YOLOv8 optimisé',
              'Classification multi-classe',
              'Inférence < 20ms',
              'Edge Computing'
            ]}
          />
          <SystemCard
            icon={Zap}
            title="Action"
            description="Système de séparation automatisée et contrôle qualité"
            features={[
              'Jets d\'air pneumatiques',
              'Actionneurs robotisés',
              'Convoyage piloté',
              'Boucle de rétroaction'
            ]}
          />
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <FlowStep
              number="1"
              title="Alimentation CSR"
              description="Charge brute sur ligne de convoyage"
              color="blue"
            />
            <ArrowRight className="hidden lg:block w-8 h-8 text-slate-500" />
            <FlowStep
              number="2"
              title="Analyse IA"
              description="Caractérisation temps réel"
              color="purple"
            />
            <ArrowRight className="hidden lg:block w-8 h-8 text-slate-500" />
            <FlowStep
              number="3"
              title="Séparation automatisée"
              description="Éjection des contaminants"
              color="green"
            />
            <ArrowRight className="hidden lg:block w-8 h-8 text-slate-500" />
            <FlowStep
              number="4"
              title="Charge optimisée"
              description="Alimentation réacteur"
              color="orange"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900">Dataset d'Entraînement</h3>
          </div>
          <div className="space-y-3">
            <DatasetItem label="Images annotées" value="50,000+" />
            <DatasetItem label="Classes de matériaux" value="12" />
            <DatasetItem label="Précision moyenne" value="96.8%" />
            <DatasetItem label="Temps d'entraînement" value="48h" />
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900">Infrastructure</h3>
          </div>
          <div className="space-y-3">
            <DatasetItem label="GPU Edge" value="NVIDIA Jetson AGX" />
            <DatasetItem label="Caméras" value="4x industrielles" />
            <DatasetItem label="Capteurs IoT" value="8x multi-spectraux" />
            <DatasetItem label="Débit traitement" value="2 tonnes/h" />
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Avantages de la Solution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BenefitCard
            title="Réduction Polluants"
            value="-65%"
            description="Chlore, soufre, métaux lourds"
            color="green"
          />
          <BenefitCard
            title="Amélioration PCI"
            value="+18%"
            description="Pouvoir calorifique inférieur"
            color="blue"
          />
          <BenefitCard
            title="Qualité Gaz"
            value="+42%"
            description="Pureté du syngas produit"
            color="purple"
          />
          <BenefitCard
            title="Réduction Cendres"
            value="-38%"
            description="Moins d'encrassement"
            color="orange"
          />
          <BenefitCard
            title="Stabilité Process"
            value="+55%"
            description="Moins de variations"
            color="cyan"
          />
          <BenefitCard
            title="ROI"
            value="< 2 ans"
            description="Retour sur investissement"
            color="yellow"
          />
        </div>
      </div>
    </div>
  )
}

function SystemCard({ icon: Icon, title, description, features }: any) {
  return (
    <div className="glass-effect rounded-xl p-6 border-t-4 border-slate-500">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-slate-500/20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FlowStep({ number, title, description, color }: any) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    green: 'from-green-500 to-green-700',
    orange: 'from-orange-500 to-orange-700'
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-16 h-16 bg-gradient-to-br ${colors[color]} rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 mb-3 glow-effect`}>
        {number}
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

function DatasetItem({ label, value }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-100/80 rounded-lg">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  )
}

function BenefitCard({ title, value, description, color }: any) {
  const colors: Record<string, string> = {
    green: 'text-slate-400 border-slate-500',
    blue: 'text-slate-400 border-slate-500',
    purple: 'text-slate-400 border-purple-500',
    orange: 'text-slate-400 border-orange-500',
    cyan: 'text-slate-400 border-cyan-500',
    yellow: 'text-slate-400 border-yellow-500'
  }

  return (
    <div className={`glass-effect rounded-xl p-4 border-l-4 ${colors[color]}`}>
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className={`text-3xl font-bold mb-1 ${colors[color]}`}>{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  )
}
