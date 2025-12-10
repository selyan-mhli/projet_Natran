import { useSimulation } from '../context/SimulationContext'

export default function Impact() {
  const { stats } = useSimulation()
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Récapitulatif de la Solution</h1>
        <p className="text-slate-600">Tri prédictif des CSR par IA pour la pyro-gazéification</p>
      </div>

      {stats.total > 0 && (
        <div className="bg-slate-900 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Résultats Simulation</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400">Conformes</p>
              <p className="text-xl font-bold text-green-400">{stats.accepted}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400">Rejetés</p>
              <p className="text-xl font-bold text-red-400">{stats.rejected}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400">Chlore</p>
              <p className="text-xl font-bold text-amber-400">{stats.chlore.toFixed(2)}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400">PCI</p>
              <p className="text-xl font-bold text-blue-400">{stats.pci.toFixed(1)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400">Syngas</p>
              <p className="text-xl font-bold text-green-400">{stats.syngasQuality.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      )}

      <Section title="1. Caractéristiques CSR" subtitle="Sources: ADEME, Norme EN 15359">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4">
            <h4 className="font-semibold mb-3">PCI (Pouvoir Calorifique)</h4>
            <p className="text-sm">Plage: <strong>8 - 27 MJ/kg</strong> (ADEME)</p>
            <p className="text-sm">Moyenne France: <strong>~14 MJ/kg</strong></p>
            <p className="text-sm">Objectif: <strong>20-25 MJ/kg</strong></p>
          </div>
          <div className="border rounded-xl p-4">
            <h4 className="font-semibold mb-3">Chlore</h4>
            <p className="text-sm text-red-600">Max observé: <strong>3.3%</strong> (avec PVC)</p>
            <p className="text-sm">Limite cimenteries: <strong>&lt; 0.5%</strong></p>
            <p className="text-sm text-green-600">Classe 1: <strong>&lt; 0.2%</strong></p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-3">Classes EN 15359 (Chlore)</h4>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            <div className="bg-green-100 text-green-800 rounded p-2"><strong>Classe 1</strong><br/>&lt; 0.2%</div>
            <div className="bg-lime-100 text-lime-800 rounded p-2"><strong>Classe 2</strong><br/>&lt; 0.6%</div>
            <div className="bg-amber-100 text-amber-800 rounded p-2"><strong>Classe 3</strong><br/>&lt; 1.0%</div>
            <div className="bg-orange-100 text-orange-800 rounded p-2"><strong>Classe 4</strong><br/>&lt; 1.5%</div>
            <div className="bg-red-100 text-red-800 rounded p-2"><strong>Classe 5</strong><br/>&lt; 3.0%</div>
          </div>
        </div>
      </Section>

      <Section title="2. Problématique" subtitle="Contaminants critiques">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-900">PVC (Chlore)</h4>
            <p className="text-sm text-red-800">57% de chlore - HCl corrosif</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-900">Caoutchouc</h4>
            <p className="text-sm text-red-800">Soufre - H2S dans syngas</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-900">Métaux lourds</h4>
            <p className="text-sm text-red-800">Résidus REFIOM toxiques</p>
          </div>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-xl p-4">
          <p className="text-red-800 font-medium">Le PVC est visuellement INDISTINGUABLE du PE/PP - Impossible à détecter manuellement</p>
        </div>
      </Section>

      <Section title="3. Solution : Tri IA Multi-spectral" subtitle="RGB + NIR">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Caméra RGB</h4>
            <ul className="text-sm text-blue-800">
              <li>Bois, carton, textile</li>
              <li>Métaux (reflets)</li>
              <li className="text-red-600">Ne distingue PAS PVC/PE</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Caméra NIR</h4>
            <ul className="text-sm text-purple-800">
              <li className="text-green-700 font-medium">Distingue PVC du PE/PP</li>
              <li>Signature spectrale C-Cl</li>
              <li>Essentiel contre HCl</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-4">
          <h4 className="font-semibold mb-3">Performances IA (Source: PMC 2024)</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><p className="text-2xl font-bold">71%</p><p className="text-xs text-slate-400">YOLOv8</p></div>
            <div><p className="text-2xl font-bold text-green-400">74.5%</p><p className="text-xs text-slate-400">MRS-YOLO</p></div>
            <div><p className="text-2xl font-bold text-blue-400">75-85%</p><p className="text-xs text-slate-400">RGB+NIR (est.)</p></div>
            <div><p className="text-2xl font-bold">2.7ms</p><p className="text-xs text-slate-400">/frame</p></div>
          </div>
        </div>
      </Section>

      <Section title="4. Comparaison Tri Manuel vs IA" subtitle="Estimations">
        <table className="w-full text-sm border mb-4">
          <thead className="bg-slate-100">
            <tr><th className="p-2 text-left">Critère</th><th className="p-2 text-red-600">Manuel</th><th className="p-2 text-green-600">IA</th></tr>
          </thead>
          <tbody>
            <tr className="border-t"><td className="p-2">Détection PVC</td><td className="p-2 text-center text-red-600">&lt; 30%</td><td className="p-2 text-center text-green-600 font-bold">80-90%</td></tr>
            <tr className="border-t"><td className="p-2">Précision globale</td><td className="p-2 text-center">70-80%</td><td className="p-2 text-center text-green-600 font-bold">75-85%</td></tr>
            <tr className="border-t"><td className="p-2">Débit</td><td className="p-2 text-center text-red-600">2-5 t/h</td><td className="p-2 text-center text-green-600 font-bold">10-20 t/h</td></tr>
            <tr className="border-t"><td className="p-2">Fatigue</td><td className="p-2 text-center text-red-600">Oui</td><td className="p-2 text-center text-green-600">Non</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="5. Impact sur Qualité CSR" subtitle="Simulation">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-900 mb-2">Sans tri</h4>
            <p className="text-sm">Chlore: ~1.5%</p>
            <p className="text-sm">PCI: 14 MJ/kg</p>
            <p className="text-sm font-semibold">Classe 4-5</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Tri manuel</h4>
            <p className="text-sm">Chlore: ~1.05%</p>
            <p className="text-sm">PCI: 16 MJ/kg</p>
            <p className="text-sm font-semibold">Classe 4</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2">Tri IA</h4>
            <p className="text-sm">Chlore: ~0.22%</p>
            <p className="text-sm">PCI: 18-22 MJ/kg</p>
            <p className="text-sm font-semibold">Classe 1-2</p>
          </div>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-2">Gains estimés</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><p className="text-2xl font-bold text-green-700">-85%</p><p className="text-sm">Chlore</p></div>
            <div><p className="text-2xl font-bold text-green-700">+43%</p><p className="text-sm">PCI</p></div>
            <div><p className="text-2xl font-bold text-green-700">x4-5</p><p className="text-sm">Débit</p></div>
            <div><p className="text-2xl font-bold text-green-700">+50%</p><p className="text-sm">Détection PVC</p></div>
          </div>
        </div>
      </Section>

      <Section title="6. Sources" subtitle="Références">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2">Données vérifiées</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>Caractéristiques CSR (ADEME, EN 15359)</li>
              <li>Problème chlore/PVC</li>
              <li>Performances YOLO (~74% mAP50)</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Estimations</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>Précision YOLO sur CSR</li>
              <li>Performances tri manuel</li>
              <li>Impact sur syngas</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl p-4">
          <ul className="text-sm text-slate-600 space-y-1">
            <li><strong>EN 15359</strong> - Classification CSR</li>
            <li><strong>ADEME</strong> - PCI 8-27 MJ/kg</li>
            <li><strong>PMC 2024</strong> - MRS-YOLO 74.5% mAP50</li>
            <li><strong>Actu-Environnement</strong> - Limite chlore 0.5%</li>
          </ul>
        </div>
      </Section>

      <div className="bg-slate-900 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
        <p className="text-slate-300 mb-4">
          Notre solution de tri IA multi-spectrale (RGB + NIR) répond à la problématique de variabilité des CSR. 
          Avantage clé: détection du PVC impossible visuellement.
        </p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3"><p className="text-green-400 font-bold">Classe 1-2</p><p className="text-xs">Qualité</p></div>
          <div className="bg-white/10 rounded-lg p-3"><p className="text-green-400 font-bold">&lt; 0.5%</p><p className="text-xs">Chlore</p></div>
          <div className="bg-white/10 rounded-lg p-3"><p className="text-green-400 font-bold">75-85%</p><p className="text-xs">Précision</p></div>
          <div className="bg-white/10 rounded-lg p-3"><p className="text-green-400 font-bold">2.7ms</p><p className="text-xs">Temps réel</p></div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b px-6 py-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
