import { AlertTriangle, Flame, Recycle, Zap, CheckCircle, XCircle } from 'lucide-react'

export default function AboutCSR() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Combustibles Solides de Récupération</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Optimisation du tri des CSR par intelligence artificielle pour la pyro-gazéification industrielle
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Contexte industriel</h2>
            <p className="text-slate-600 leading-relaxed">
              Les CSR constituent une fraction valorisable des déchets non-recyclables, transformés en combustible alternatif pour la production énergétique.
              Le procédé de <strong>pyro-gazéification</strong> permet leur conversion thermochimique en gaz de synthèse (H₂, CO, CH₄) à haute valeur énergétique.
            </p>
          </div>
        </div>
      </div>

      {/* Composition */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Recycle className="w-6 h-6 text-slate-900" />
          <h2 className="text-2xl font-bold text-slate-900">Composition massique des CSR</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CompositionCard percentage="35%" title="Plastiques" color="slate" />
          <CompositionCard percentage="28%" title="Papier/Carton" color="slate" />
          <CompositionCard percentage="20%" title="Bois" color="slate" />
          <CompositionCard percentage="12%" title="Textiles" color="slate" />
          <CompositionCard percentage="5%" title="Autres" color="slate" />
        </div>
      </div>

      {/* Problèmes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">Problématiques techniques</h2>
          </div>
          <div className="space-y-4">
            <ProblemItem icon={XCircle} text="Variabilité compositionnelle élevée" detail="Prédiction de qualité difficile" />
            <ProblemItem icon={XCircle} text="PCI variable (16-22 MJ/kg)" detail="Régulation thermique complexe" />
            <ProblemItem icon={XCircle} text="Distribution granulométrique hétérogène" detail="Perturbation de la fluidisation" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-6">Contaminants critiques</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 rounded-xl">
              <h4 className="font-semibold">Chlore (PVC)</h4>
              <p className="text-sm text-slate-300">Formation de HCl gazeux → Corrosion</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl">
              <h4 className="font-semibold">Soufre</h4>
              <p className="text-sm text-slate-300">Émission de H₂S → Contamination syngas</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl">
              <h4 className="font-semibold">Métaux lourds</h4>
              <p className="text-sm text-slate-300">Accumulation → Résidus REFIOM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notre Solution */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-6 h-6 text-slate-900" />
          <h2 className="text-2xl font-bold text-slate-900">Solution : Tri prédictif par IA</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Principe de fonctionnement</h3>
            <div className="space-y-4">
              <SolutionStep number="1" title="Acquisition multi-spectral" description="Caméras 4K + capteurs NIR" />
              <SolutionStep number="2" title="Détection YOLOv8" description="Classification temps réel" />
              <SolutionStep number="3" title="Séparation pneumatique" description="Jets d'air automatisés" />
              <SolutionStep number="4" title="Charge optimisée" description="CSR décontaminé" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Performances du modèle</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">Précision</p>
                <p className="text-3xl font-bold text-slate-900">96.8%</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">Vitesse</p>
                <p className="text-3xl font-bold text-slate-900">45 FPS</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">Latence</p>
                <p className="text-3xl font-bold text-slate-900">{'<'}20ms</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">Classes</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-slate-900">-65%</p>
          <p className="text-sm text-slate-500">Taux de chlore</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-slate-900">+42%</p>
          <p className="text-sm text-slate-500">Qualité syngas</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-slate-900">450k€</p>
          <p className="text-sm text-slate-500">Gains annuels</p>
        </div>
      </div>

      {/* Glossaire */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Glossaire technique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VocabItem term="Pyro-gazéification" definition="Conversion thermochimique des CSR en gaz de synthèse (800-1000°C)" />
          <VocabItem term="PCI" definition="Pouvoir Calorifique Inférieur - CSR : 16-22 MJ/kg" />
          <VocabItem term="Syngas" definition="Mélange gazeux (H₂, CO, CH₄) valorisable" />
          <VocabItem term="HCl" definition="Acide chlorhydrique issu du PVC, corrosif" />
        </div>
      </div>
    </div>
  )
}

function CompositionCard({ percentage, title }: { percentage: string, title: string, color?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-slate-900">{percentage}</p>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  )
}

function ProblemItem({ icon: Icon, text, detail }: { icon: any, text: string, detail: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <Icon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-slate-900 font-medium">{text}</p>
        <p className="text-sm text-slate-500">{detail}</p>
      </div>
    </div>
  )
}

function SolutionStep({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-medium text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function VocabItem({ term, definition }: { term: string, definition: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h4 className="font-semibold text-slate-900 mb-1">{term}</h4>
      <p className="text-sm text-slate-500">{definition}</p>
    </div>
  )
}
