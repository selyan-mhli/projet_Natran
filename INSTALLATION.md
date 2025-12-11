# 🚀 Guide d'Installation - NATRAN CSR AI

## ⚠️ Prérequis

Node.js n'est pas installé sur votre système. Vous devez l'installer pour exécuter ce projet.

## 📥 Installation de Node.js

### Option 1 : Installation Recommandée (LTS)

1. Téléchargez Node.js depuis le site officiel :
   **https://nodejs.org/fr**

2. Choisissez la version **LTS (Long Term Support)** - actuellement v20.x

3. Lancez l'installateur et suivez les instructions

4. Redémarrez votre terminal/PowerShell après l'installation

### Option 2 : Via Chocolatey (si installé)

```powershell
choco install nodejs-lts
```

### Option 3 : Via Winget

```powershell
winget install OpenJS.NodeJS.LTS
```

## ✅ Vérification de l'installation

Après l'installation, ouvrez un nouveau terminal et vérifiez :

```powershell
node --version
npm --version
```

Vous devriez voir les numéros de version s'afficher.

## 📦 Installation du Projet

Une fois Node.js installé, dans le dossier du projet :

```powershell
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

## 🎯 Structure du Projet

```
Natran/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # En-tête et navigation
│   │   ├── Dashboard.tsx       # Monitoring temps réel
│   │   ├── Simulation.tsx      # Simulation IA interactive
│   │   ├── Architecture.tsx    # Architecture système
│   │   └── Impact.tsx          # Analyse d'impact
│   ├── App.tsx                 # Composant principal
│   ├── main.tsx                # Point d'entrée
│   └── index.css               # Styles globaux
├── package.json                # Dépendances
├── vite.config.ts              # Configuration Vite
├── tailwind.config.js          # Configuration TailwindCSS
└── README.md                   # Documentation
```

## 🛠️ Commandes Disponibles

```powershell
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile pour la production
npm run preview      # Prévisualise la version de production
```

## 📊 Fonctionnalités du Site

### 1. **Monitoring** (Dashboard)
- Détections en temps réel des matériaux
- Métriques de qualité (chlore, PCI, humidité, métaux)
- Graphiques de composition et qualité du gaz

### 2. **Simulation IA**
- Démonstration interactive du tri intelligent
- Visualisation de la détection d'objets
- Statistiques de performance du modèle

### 3. **Architecture**
- Schéma du système complet
- Détails techniques (caméras, capteurs, IA)
- Avantages et bénéfices de la solution

### 4. **Impact**
- Comparaison avant/après tri IA
- Graphiques d'impact environnemental
- ROI et économies réalisées

## 🎨 Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Styling moderne
- **Recharts** - Graphiques interactifs
- **Lucide React** - Icônes

## 💡 Conseils pour la Présentation

1. **Démarrez avec le Dashboard** pour montrer le monitoring en temps réel
2. **Passez à la Simulation** pour démontrer l'IA en action
3. **Expliquez l'Architecture** pour détailler la solution technique
4. **Terminez avec l'Impact** pour montrer les bénéfices concrets

## 🆘 Problèmes Courants

### Le site ne se lance pas
- Vérifiez que Node.js est bien installé : `node --version`
- Supprimez `node_modules` et relancez `npm install`
- Vérifiez que le port 3000 n'est pas déjà utilisé

### Erreurs de compilation
- Assurez-vous d'avoir la dernière version de Node.js LTS
- Videz le cache : `npm cache clean --force`

## 📞 Support

Pour toute question sur le projet NATRAN, contactez votre équipe.

---

**Bonne chance pour le concours NATRAN ! 🔥**
