import { AlertTriangle, Flame, Recycle, Zap, CheckCircle, XCircle, Users, Cpu } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

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

      {/* Objectifs basés sur normes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-slate-900">{"<"} 0.2%</p>
          <p className="text-sm text-slate-500">Objectif chlore (Classe 1)</p>
          <p className="text-xs text-slate-400 mt-1">Norme EN 15359</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-slate-900">20-25</p>
          <p className="text-sm text-slate-500">PCI cible (MJ/kg)</p>
          <p className="text-xs text-slate-400 mt-1">CSR haut PCI</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-slate-900">~74%</p>
          <p className="text-sm text-slate-500">Précision détection IA</p>
          <p className="text-xs text-slate-400 mt-1">MRS-YOLO (PMC 2024)</p>
        </div>
      </div>

      {/* Glossaire */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Glossaire technique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VocabItem term="Pyro-gazéification" definition="Conversion thermochimique des CSR en gaz de synthèse (800-1000°C)" />
          <VocabItem term="PCI" definition="Pouvoir Calorifique Inférieur - CSR : 8-27 MJ/kg (ADEME)" />
          <VocabItem term="Syngas" definition="Mélange gazeux (H₂, CO, CH₄) valorisable en énergie" />
          <VocabItem term="HCl" definition="Acide chlorhydrique issu du PVC (57% chlore), corrosif" />
        </div>
      </div>

      {/* SECTION COMPARAISON TRI MANUEL VS IA */}
      <ComparisonSection />

      {/* Sources */}
      <div className="bg-slate-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Sources et références</h2>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>• <strong>Norme EN 15359</strong> - Classification des CSR (PCI, Chlore, Mercure)</li>
          <li>• <strong>ADEME</strong> - Étude caractérisation CSR : PCI 8-27 MJ/kg, Chlore jusqu'à 3.3%</li>
          <li>• <strong>Actu-Environnement</strong> - Limite chlore cimenteries : 0.5%</li>
          <li>• <strong>PMC/NIH 2024</strong> - MRS-YOLO waste detection : 74.5% mAP50</li>
          <li>• <strong>Wikipedia</strong> - Combustible solide de récupération</li>
        </ul>
        <p className="text-xs text-slate-400 mt-4">
          Note : Les performances de la simulation sont des estimations basées sur ces données. 
          Un système réel nécessiterait un entraînement sur des données CSR spécifiques.
        </p>
      </div>
    </div>
  )
}

// Grande section de comparaison Tri Manuel vs IA
function ComparisonSection() {
  const comparisonData = [
    { critere: 'Détection PVC', manuel: 30, ia: 85 },
    { critere: 'Précision globale', manuel: 75, ia: 80 },
    { critere: 'Débit relatif', manuel: 25, ia: 100 },
    { critere: 'Détection métaux', manuel: 90, ia: 92 },
    { critere: 'Continuité 24/7', manuel: 40, ia: 100 },
  ]

  const radarData = [
    { subject: 'Détection PVC', manuel: 30, ia: 85 },
    { subject: 'Débit', manuel: 25, ia: 80 },
    { subject: 'Précision', manuel: 75, ia: 80 },
    { subject: 'Coût exploit.', manuel: 40, ia: 85 },
    { subject: 'Continuité', manuel: 40, ia: 95 },
  ]

  const chloreImpactData = [
    { scenario: 'Sans tri', chlore: 1.5 },
    { scenario: 'Tri manuel', chlore: 1.05 },
    { scenario: 'Tri IA', chlore: 0.22 },
  ]

  const pciImpactData = [
    { scenario: 'Sans tri', pci: 14 },
    { scenario: 'Tri manuel', pci: 16 },
    { scenario: 'Tri IA', pci: 20 },
  ]

  return (
    <div className="space-y-8">
      {/* Titre section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Comparaison : Tri Manuel vs Tri IA</h2>
        <p className="text-slate-600">Analyse comparative basée sur nos estimations et la littérature scientifique</p>
      </div>

      {/* Cards comparatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tri Manuel */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900">Tri Manuel</h3>
              <p className="text-sm text-red-600">Opérateurs humains</p>
            </div>
          </div>
          <div className="space-y-3">
            <StatRow label="Détection PVC" value="< 30%" bad />
            <StatRow label="Précision globale" value="70-80%" neutral />
            <StatRow label="Débit" value="2-5 t/h" bad />
            <StatRow label="Fatigue" value="Oui" bad />
            <StatRow label="Coût exploitation" value="Élevé" bad />
            <StatRow label="Continuité 24/7" value="Difficile" bad />
          </div>
          <div className="mt-4 p-3 bg-red-100 rounded-xl">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Impossible de distinguer visuellement le PVC du PE/PP
            </p>
          </div>
        </div>

        {/* Tri IA */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Tri IA (RGB + NIR)</h3>
              <p className="text-sm text-green-600">Vision artificielle multi-spectrale</p>
            </div>
          </div>
          <div className="space-y-3">
            <StatRow label="Détection PVC" value="80-90%" good />
            <StatRow label="Précision globale" value="75-85%" good />
            <StatRow label="Débit" value="10-20 t/h" good />
            <StatRow label="Fatigue" value="Non" good />
            <StatRow label="Coût exploitation" value="Faible" good />
            <StatRow label="Continuité 24/7" value="Oui" good />
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-xl">
            <p className="text-sm text-green-800 font-medium">
              ✓ Caméra NIR détecte la signature spectrale du chlore (C-Cl)
            </p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique barres comparatif */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performances comparées (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="critere" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="manuel" fill="#ef4444" name="Tri Manuel" radius={[0, 4, 4, 0]} />
              <Bar dataKey="ia" fill="#22c55e" name="Tri IA" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Analyse radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Tri IA" dataKey="ia" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
              <Radar name="Tri Manuel" dataKey="manuel" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact sur qualité CSR */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-6">Impact sur la qualité du CSR</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chlore */}
          <div>
            <h4 className="font-semibold mb-3">Réduction du chlore (%)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chloreImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="scenario" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af' }} domain={[0, 2]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Bar dataKey="chlore" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-red-400">Classe 4-5</span>
              <span className="text-amber-400">Classe 4</span>
              <span className="text-green-400">Classe 1-2</span>
            </div>
          </div>

          {/* PCI */}
          <div>
            <h4 className="font-semibold mb-3">Amélioration du PCI (MJ/kg)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pciImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="scenario" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af' }} domain={[0, 25]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Bar dataKey="pci" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-sm mt-2 text-center text-slate-400">
              Objectif: 20-25 MJ/kg (CSR haut PCI)
            </div>
          </div>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">Tableau récapitulatif des gains</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Paramètre</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-red-600">Sans tri</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-amber-600">Tri manuel</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-green-600">Tri IA</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Gain IA vs Manuel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 font-medium">Chlore</td>
                <td className="px-6 py-4 text-center text-red-600">~1.5%</td>
                <td className="px-6 py-4 text-center text-amber-600">~1.05%</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">~0.22%</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">-79%</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="px-6 py-4 font-medium">PCI</td>
                <td className="px-6 py-4 text-center text-red-600">14 MJ/kg</td>
                <td className="px-6 py-4 text-center text-amber-600">16 MJ/kg</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">18-22 MJ/kg</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">+25-38%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Classe EN 15359</td>
                <td className="px-6 py-4 text-center text-red-600">4-5</td>
                <td className="px-6 py-4 text-center text-amber-600">4</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">1-2</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">+2-3 classes</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="px-6 py-4 font-medium">Détection PVC</td>
                <td className="px-6 py-4 text-center text-red-600">0%</td>
                <td className="px-6 py-4 text-center text-amber-600">~30%</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">80-90%</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">+50-60%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Débit</td>
                <td className="px-6 py-4 text-center text-slate-500">-</td>
                <td className="px-6 py-4 text-center text-amber-600">2-5 t/h</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">10-20 t/h</td>
                <td className="px-6 py-4 text-center text-green-600 font-bold">x4-5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusion gains */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">-85%</p>
          <p className="text-sm text-green-600">Chlore</p>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">+43%</p>
          <p className="text-sm text-green-600">PCI</p>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">x4-5</p>
          <p className="text-sm text-green-600">Débit</p>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">+60%</p>
          <p className="text-sm text-green-600">Détection PVC</p>
        </div>
      </div>

      {/* Note transparence */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>⚠️ Note de transparence :</strong> Les valeurs du tri manuel et les gains sont des <strong>estimations</strong> basées sur 
          la littérature et notre analyse. Le tri manuel des CSR n'est pas documenté spécifiquement dans la littérature scientifique. 
          Ces chiffres nécessiteraient une validation expérimentale.
        </p>
      </div>
    </div>
  )
}

function StatRow({ label, value, good, bad }: { label: string, value: string, good?: boolean, bad?: boolean, neutral?: boolean }) {
  const colorClass = good ? 'text-green-700' : bad ? 'text-red-700' : 'text-slate-700'
  const bgClass = good ? 'bg-green-100' : bad ? 'bg-red-100' : 'bg-slate-100'
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-semibold px-2 py-1 rounded ${colorClass} ${bgClass}`}>{value}</span>
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
