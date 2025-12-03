# Projet Natran – Dashboard Next.js

Application Next.js + TypeScript qui agrège les écrans du dashboard CSR ainsi que les APIs (SQLite). Les anciennes pages statiques ont été migrées vers le routeur `app/` et l'API utilise désormais les route handlers intégrés à Next.

## Installation

```bash
npm install
```

Au démarrage (`npm run dev` ou `npm run start`), la base SQLite `dashboard.db` est créée automatiquement si elle n'existe pas encore et est peuplée avec les données simulées.

## Commandes

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Lance Next.js en mode développement |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Démarre le serveur Next.js en production |
| `npm run lint` | Vérifie le code avec ESLint |
## Structure

- `app/` : pages Next (dashboard, pré-traitement, réacteur, émissions, rapports, fiches CSR, tâches) et routes API.
- `components/` : layout partagé et composants clients (Dashboard, TasksBoard, Batches, etc.).
- `lib/` : connexion SQLite + simulateur de données temps réel.
- `types/` : modèles partagés entre le front et l'API.

## API interne

| Route | Description |
| ----- | ----------- |
| `GET /api/dashboard` | Dernières valeurs (qualité CSR, réacteur, flux, syngaz) |
| `GET /api/history/[type]` | Historique des mesures (`reactor`, `flow`, `syngas`, `csr_quality`) |
| `GET /api/stats` | Statistiques agrégées |
| `GET/POST /api/batches` | Fiches CSR (lecture + création) |
| `GET/POST /api/tasks` | Kanban des tâches |
| `PUT/DELETE /api/tasks/:id` | Mise à jour / suppression d'une tâche |

`lib/simulator.ts` continue d'insérer périodiquement de nouvelles mesures (température + débit) afin d'émuler un flux temps réel pendant le développement.
