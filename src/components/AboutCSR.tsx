import { AlertTriangle, Flame, Recycle, Zap, CheckCircle, XCircle } from 'lucide-react'

export default function AboutCSR() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="glass-effect rounded-xl p-8 border-l-4 border-slate-500">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Combustibles Solides de Récupération (CSR)</h1>
        <p className="text-xl text-slate-300 mb-4">
          <strong className="text-slate-400">Définition et contexte industriel</strong>
        </p>
        <p className="text-lg text-slate-400">
          Les CSR constituent une fraction valorisable des déchets non-recyclables, transformés en combustible alternatif pour la production énergétique.
          Le procédé de pyro-gazéification permet leur conversion thermochimique en gaz de synthèse (H₂, CO, CH₄) à haute valeur énergétique.
        </p>
      </div>

      {/* Composition */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Recycle className="w-8 h-8 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Caractérisation de la composition massique</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CompositionCard
            percentage="35%"
            title="Plastiques"
            items={['Films plastiques', 'Emballages multicouches', 'PVC (polluant chloré)', 'PE/PP (valorisables)']}
            color="blue"
          />
          <CompositionCard
            percentage="28%"
            title="Papier/Carton"
            items={['Cartons souillés', 'Papiers contaminés', 'Fraction non-recyclable', 'Bon pouvoir calorifique']}
            color="yellow"
          />
          <CompositionCard
            percentage="20%"
            title="Bois"
            items={['Palettes usagées', 'Mobilier hors d\'usage', 'Fraction ligneuse', 'Combustion stable']}
            color="amber"
          />
          <CompositionCard
            percentage="12%"
            title="Textiles"
            items={['Textiles usagés', 'Fibres synthétiques', 'Fraction non-recyclable', 'Valorisation acceptable']}
            color="purple"
          />
          <CompositionCard
            percentage="5%"
            title="Autres"
            items={['Mousse', 'Caoutchouc', 'Résidus divers', 'Variable']}
            color="slate"
          />
        </div>
      </div>

      {/* Problèmes */}
      <div className="glass-effect rounded-xl p-6 border-l-4 border-slate-600">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Problématiques techniques de la pyro-gazéification</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Hétérogénéité de la charge</h3>
            <ProblemItem
              icon={XCircle}
              text="Variabilité compositionnelle élevée"
              detail="Prédiction de qualité difficile"
            />
            <ProblemItem
              icon={XCircle}
              text="PCI variable (16-22 MJ/kg)"
              detail="Régulation thermique complexe"
            />
            <ProblemItem
              icon={XCircle}
              text="Distribution granulométrique hétérogène"
              detail="Perturbation de la fluidisation"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Contaminants critiques</h3>
            <PollutantItem
              name="Chlore (PVC)"
              problem="Formation de HCl gazeux"
              impact="Corrosion des équipements"
              color="red"
            />
            <PollutantItem
              name="Soufre"
              problem="Émission de H₂S"
              impact="Contamination du syngas"
              color="orange"
            />
            <PollutantItem
              name="Métaux lourds"
              problem="Accumulation dans les cendres"
              impact="Résidus REFIOM"
              color="gray"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-900/20 rounded-lg border border-slate-500/30">
          <h4 className="font-bold text-slate-300 mb-2">Impacts opérationnels :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
            <div>• Corrosion accélérée des équipements</div>
            <div>• Dégradation de la qualité du syngas</div>
            <div>• Encrassement (goudrons, cendres volantes)</div>
            <div>• Augmentation des coûts de maintenance</div>
          </div>
        </div>
      </div>

      {/* Notre Solution */}
      <div className="glass-effect rounded-xl p-6 border-l-4 border-slate-400">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-900">Solution proposée : Tri prédictif par vision artificielle</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Principe de fonctionnement</h3>
            <p className="text-slate-300 mb-4">
              <strong className="text-slate-400">Séparation en amont des contaminants</strong> avant introduction dans le réacteur de pyro-gazéification
            </p>

            <div className="space-y-3">
              <SolutionStep
                number="1"
                title="Système d'acquisition multi-spectral"
                description="Caméras 4K et capteurs NIR sur ligne de convoyage"
              />
              <SolutionStep
                number="2"
                title="Modèle de détection YOLOv8 adapté"
                description="Classification temps réel : PVC, métaux, polyéthylène, cellulose, lignine"
              />
              <SolutionStep
                number="3"
                title="Séparation pneumatique automatisée"
                description="Système de jets d'air pilotés pour éjection sélective"
              />
              <SolutionStep
                number="4"
                title="Charge optimisée"
                description="CSR homogénéisé et décontaminé pour alimentation réacteur"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Résultats attendus</h3>
            <div className="space-y-3">
              <ResultItem icon={CheckCircle} text="Homogénéisation de la charge CSR" color="green" />
              <ResultItem icon={CheckCircle} text="Réduction du taux de chlore de 65% (2.5% → 0.8%)" color="green" />
              <ResultItem icon={CheckCircle} text="Amélioration de la qualité du syngas (+42%)" color="green" />
              <ResultItem icon={CheckCircle} text="Réduction des arrêts maintenance" color="green" />
              <ResultItem icon={CheckCircle} text="Retour sur investissement inférieur à 2 ans" color="green" />
              <ResultItem icon={CheckCircle} text="Gains opérationnels estimés : 450 k€/an" color="green" />
            </div>

            <div className="mt-6 p-4 bg-slate-800/20 rounded-lg border border-slate-400/30">
              <h4 className="font-bold text-slate-200 mb-2">Performances du modèle :</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Précision</p>
                  <p className="text-xl font-bold text-slate-900">96.8%</p>
                </div>
                <div>
                  <p className="text-slate-400">Vitesse</p>
                  <p className="text-xl font-bold text-slate-900">45 FPS</p>
                </div>
                <div>
                  <p className="text-slate-400">Latence</p>
                  <p className="text-xl font-bold text-slate-900">{'<'} 20ms</p>
                </div>
                <div>
                  <p className="text-slate-400">Classes</p>
                  <p className="text-xl font-bold text-slate-900">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulaire */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Flame className="w-8 h-8 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900">Glossaire technique</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VocabItem
            term="Pyro-gazéification"
            definition="Procédé thermochimique de conversion des CSR en gaz de synthèse (800-1000°C) en atmosphère sous-stœchiométrique"
          />
          <VocabItem
            term="PCI (Pouvoir Calorifique)"
            definition="Pouvoir Calorifique Inférieur - Énergie massique libérée. CSR : 16-22 MJ/kg (cible : 18-20 MJ/kg stabilisé)"
          />
          <VocabItem
            term="Syngas (Gaz de Synthèse)"
            definition="Mélange gazeux (H₂, CO, CH₄) valorisable en production énergétique ou synthèse chimique"
          />
          <VocabItem
            term="HCl (Acide Chlorhydrique)"
            definition="Acide chlorhydrique gazeux issu de la décomposition du PVC, hautement corrosif pour les installations métalliques"
          />
        </div>
      </div>
    </div>
  )
}

function CompositionCard({ percentage, title, items, color }: any) {
  const colors: Record<string, string> = {
    blue: 'border-slate-500 bg-slate-500/10',
    yellow: 'border-slate-400 bg-slate-400/10',
    amber: 'border-slate-600 bg-slate-600/10',
    purple: 'border-slate-500 bg-slate-500/10',
    slate: 'border-slate-500 bg-slate-500/10'
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${colors[color]}`}>
      <div className="text-3xl font-bold text-slate-900 mb-2">{percentage}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
      <ul className="space-y-1 text-sm text-slate-300">
        {items.map((item: string, i: number) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

function ProblemItem({ icon: Icon, text, detail }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-100/80 rounded-lg">
      <Icon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-slate-900 font-medium">{text}</p>
        <p className="text-sm text-slate-400">{detail}</p>
      </div>
    </div>
  )
}

function PollutantItem({ name, problem, impact, color }: any) {
  const colors: Record<string, string> = {
    red: 'border-slate-600 bg-slate-600/10',
    orange: 'border-slate-500 bg-slate-500/10',
    gray: 'border-slate-500 bg-slate-500/10'
  }

  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <h4 className="font-bold text-slate-900 mb-1">{name}</h4>
      <p className="text-sm text-slate-300 mb-1">{problem}</p>
      <p className="text-xs text-slate-400">→ {impact}</p>
    </div>
  )
}

function SolutionStep({ number, title, description }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-slate-900 font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  )
}

function ResultItem({ icon: Icon, text, color }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-100/80 rounded-lg">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <span className="text-slate-300">{text}</span>
    </div>
  )
}

function VocabItem({ term, definition }: any) {
  return (
    <div className="p-4 bg-slate-100/80 rounded-lg">
      <h4 className="font-bold text-slate-400 mb-2">{term}</h4>
      <p className="text-sm text-slate-300">{definition}</p>
    </div>
  )
}
