import { AlertTriangle, Flame, Recycle, Zap, CheckCircle, XCircle } from 'lucide-react'

export default function AboutCSR() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="glass-effect rounded-xl p-8 border-l-4 border-primary-500">
        <h1 className="text-3xl font-bold text-white mb-4">Qu'est-ce que les CSR ?</h1>
        <p className="text-xl text-slate-300 mb-4">
          <strong className="text-primary-400">CSR = Combustibles Solides de Récupération</strong>
        </p>
        <p className="text-lg text-slate-400">
          Ce sont des <strong>déchets non-recyclables</strong> transformés en combustible pour produire de l'énergie.
          Au lieu d'aller en décharge, on les gazéifie pour créer du gaz de synthèse (H₂, CO, CH₄).
        </p>
      </div>

      {/* Composition */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Recycle className="w-8 h-8 text-primary-400" />
          <h2 className="text-2xl font-bold text-white">Composition Typique des CSR</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CompositionCard
            percentage="35%"
            title="Plastiques"
            items={['Films plastiques', 'Emballages', 'PVC (⚠️ Problème)', 'PE/PP (✓ OK)']}
            color="blue"
          />
          <CompositionCard
            percentage="28%"
            title="Papier/Carton"
            items={['Cartons souillés', 'Papiers gras', 'Non-recyclables', '✓ Bon combustible']}
            color="yellow"
          />
          <CompositionCard
            percentage="20%"
            title="Bois"
            items={['Palettes', 'Meubles cassés', 'Déchets bois', '✓ Bon combustible']}
            color="amber"
          />
          <CompositionCard
            percentage="12%"
            title="Textiles"
            items={['Vêtements usés', 'Tissus', 'Non-recyclables', '✓ Acceptable']}
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
      <div className="glass-effect rounded-xl p-6 border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Les Problèmes en Pyro-gazéification</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-3">1. Hétérogénéité</h3>
            <ProblemItem
              icon={XCircle}
              text="Composition change constamment"
              detail="Impossible de prévoir la qualité"
            />
            <ProblemItem
              icon={XCircle}
              text="PCI variable (16-22 MJ/kg)"
              detail="Difficile de contrôler la température"
            />
            <ProblemItem
              icon={XCircle}
              text="Granulométrie différente"
              detail="Mauvaise circulation dans le réacteur"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-3">2. Polluants Majeurs</h3>
            <PollutantItem
              name="Chlore (PVC)"
              problem="Produit HCl → Corrosion"
              impact="Détruit le réacteur"
              color="red"
            />
            <PollutantItem
              name="Soufre"
              problem="Produit H₂S → Toxique"
              impact="Pollue le gaz"
              color="orange"
            />
            <PollutantItem
              name="Métaux lourds"
              problem="Cendres toxiques"
              impact="Déchets dangereux"
              color="gray"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
          <h4 className="font-bold text-red-400 mb-2">Conséquences :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
            <div>❌ Corrosion du réacteur</div>
            <div>❌ Gaz de mauvaise qualité</div>
            <div>❌ Encrassement (goudrons, cendres)</div>
            <div>❌ Coûts de maintenance élevés</div>
          </div>
        </div>
      </div>

      {/* Notre Solution */}
      <div className="glass-effect rounded-xl p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Notre Solution : Tri Intelligent par IA</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Le Concept</h3>
            <p className="text-slate-300 mb-4">
              <strong className="text-green-400">Détecter et retirer les polluants AVANT</strong> qu'ils entrent dans le réacteur
            </p>

            <div className="space-y-3">
              <SolutionStep
                number="1"
                title="Caméras 4K + Capteurs NIR"
                description="Filment le flux de CSR sur le convoyeur"
              />
              <SolutionStep
                number="2"
                title="IA (YOLOv8 personnalisé)"
                description="Détecte en temps réel : PVC, métaux, plastiques OK, papier, bois"
              />
              <SolutionStep
                number="3"
                title="Tri Automatique"
                description="Jets d'air pneumatiques rejettent automatiquement les polluants"
              />
              <SolutionStep
                number="4"
                title="CSR Optimisé"
                description="Homogène et propre → Vers pyro-gazéification"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Résultats</h3>
            <div className="space-y-3">
              <ResultItem icon={CheckCircle} text="CSR homogène et propre" color="green" />
              <ResultItem icon={CheckCircle} text="Chlore réduit de 65% (2.5% → 0.8%)" color="green" />
              <ResultItem icon={CheckCircle} text="Qualité du gaz +42%" color="green" />
              <ResultItem icon={CheckCircle} text="Moins de maintenance" color="green" />
              <ResultItem icon={CheckCircle} text="ROI < 2 ans" color="green" />
              <ResultItem icon={CheckCircle} text="Économies €450k/an" color="green" />
            </div>

            <div className="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
              <h4 className="font-bold text-green-400 mb-2">Performance IA :</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Précision</p>
                  <p className="text-xl font-bold text-white">96.8%</p>
                </div>
                <div>
                  <p className="text-slate-400">Vitesse</p>
                  <p className="text-xl font-bold text-white">45 FPS</p>
                </div>
                <div>
                  <p className="text-slate-400">Latence</p>
                  <p className="text-xl font-bold text-white">{'<'} 20ms</p>
                </div>
                <div>
                  <p className="text-slate-400">Classes</p>
                  <p className="text-xl font-bold text-white">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulaire */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Flame className="w-8 h-8 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">Vocabulaire Clé</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VocabItem
            term="Pyro-gazéification"
            definition="Processus thermique qui transforme les CSR en gaz de synthèse à 800-1000°C avec peu d'oxygène"
          />
          <VocabItem
            term="PCI (Pouvoir Calorifique)"
            definition="Énergie libérée par combustion. CSR : 16-22 MJ/kg (objectif : 18-20 MJ/kg stable)"
          />
          <VocabItem
            term="Syngas (Gaz de Synthèse)"
            definition="Mélange de H₂, CO, CH₄ utilisable pour l'énergie ou la chimie"
          />
          <VocabItem
            term="HCl (Acide Chlorhydrique)"
            definition="Gaz corrosif produit par le PVC qui détruit les équipements"
          />
        </div>
      </div>
    </div>
  )
}

function CompositionCard({ percentage, title, items, color }: any) {
  const colors: Record<string, string> = {
    blue: 'border-blue-500 bg-blue-500/10',
    yellow: 'border-yellow-500 bg-yellow-500/10',
    amber: 'border-amber-700 bg-amber-700/10',
    purple: 'border-purple-500 bg-purple-500/10',
    slate: 'border-slate-500 bg-slate-500/10'
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${colors[color]}`}>
      <div className="text-3xl font-bold text-white mb-2">{percentage}</div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
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
    <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
      <Icon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-white font-medium">{text}</p>
        <p className="text-sm text-slate-400">{detail}</p>
      </div>
    </div>
  )
}

function PollutantItem({ name, problem, impact, color }: any) {
  const colors: Record<string, string> = {
    red: 'border-red-500 bg-red-500/10',
    orange: 'border-orange-500 bg-orange-500/10',
    gray: 'border-gray-500 bg-gray-500/10'
  }

  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <h4 className="font-bold text-white mb-1">{name}</h4>
      <p className="text-sm text-slate-300 mb-1">{problem}</p>
      <p className="text-xs text-slate-400">→ {impact}</p>
    </div>
  )
}

function SolutionStep({ number, title, description }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  )
}

function ResultItem({ icon: Icon, text, color }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <span className="text-slate-300">{text}</span>
    </div>
  )
}

function VocabItem({ term, definition }: any) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg">
      <h4 className="font-bold text-primary-400 mb-2">{term}</h4>
      <p className="text-sm text-slate-300">{definition}</p>
    </div>
  )
}
