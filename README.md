# 🗑️ orduresMenage - Calendrier de Collecte des Déchets

Application web pour afficher le calendrier de collecte des poubelles à Pont-sur-Yonne (Bourg).

**Architecture trois tiers** pour déploiement Azure :
- **Frontend** → Azure Static Web Apps
- **Backend** → Azure App Service
- **Database** → Azure MySQL

## 📋 Fonctionnalités

- **Affichage hebdomadaire** : Vue de la semaine en cours avec alertes pour les collectes
- **Calendrier mensuel** : Vue complète du mois avec toutes les dates de collecte
- **Légende** : Explication des types de bacs et rappel des changements 2025
- **Responsive** : Fonctionne sur mobile, tablette et desktop
- **Jours fériés** : Affichage des jours fériés français

## 📁 Structure du projet

```
orduresMenage/
├── backend/                    # API REST (Azure App Service)
│   ├── src/
│   │   ├── controllers/       # Contrôleurs HTTP
│   │   ├── services/          # Logique métier & accès données
│   │   ├── routes/            # Routes Express
│   │   ├── middleware/        # Middleware (erreurs, etc.)
│   │   ├── lib/               # Utilitaires (Prisma, dates)
│   │   └── types/             # Types TypeScript
│   ├── prisma/                # Schema Prisma
│   └── package.json
│
├── frontend/                   # Interface Web (Azure Static Web Apps)
│   ├── src/
│   │   ├── app/               # Pages Next.js (App Router)
│   │   ├── components/        # Composants React
│   │   ├── lib/               # API client, utilitaires
│   │   └── types/             # Types TypeScript
│   └── package.json
│
├── prisma/                    # Schema Prisma (référence legacy)
├── .github/workflows/         # CI/CD GitHub Actions
└── src/                       # Code legacy (à supprimer)
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- MySQL 8.0+

### Installation Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec DATABASE_URL

npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Le backend démarre sur http://localhost:3001

### Installation Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Éditer .env avec NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```

Le frontend démarre sur http://localhost:3000

## 🎨 Technologies

### Backend
- **Runtime** : Node.js 20+ avec Express.js
- **Language** : TypeScript 5.x
- **ORM** : Prisma (MySQL)
- **Dates** : date-fns

### Frontend
- **Framework** : Next.js 15 (App Router, export statique)
- **UI** : React 19, Tailwind CSS, shadcn/ui
- **Language** : TypeScript 5.x
- **Dates** : date-fns (locale française)

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/semaine` | Collectes de la semaine en cours |
| GET | `/api/calendrier/:mois` | Collectes d'un mois (1-12) |
| GET | `/api/jours-feries/:annee` | Jours fériés d'une année |
| GET | `/api/collecte/:date` | Collecte pour une date |
| GET | `/api/prochaine-collecte` | Prochaine collecte |
| GET | `/health` | Health check |

## 🛠️ Scripts

### Backend
```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Production
npm run prisma:generate  # Générer client Prisma
npm run prisma:migrate   # Appliquer migrations
```

### Frontend
```bash
npm run dev          # Développement
npm run build        # Build statique (out/)
npm run lint         # Linting ESLint
npm run type-check   # Vérification TypeScript
```

## 🚀 Déploiement Azure

### Services Azure

| Composant | Service Azure | Configuration |
|-----------|---------------|---------------|
| Frontend | Static Web Apps | Export Next.js statique |
| Backend | App Service | Node.js 20 LTS |
| Database | Azure MySQL | MySQL 8.0 |

### GitHub Actions

Les workflows CI/CD sont dans `.github/workflows/`:
- `azure-backend.yml` - Déploie sur App Service
- `azure-frontend.yml` - Déploie sur Static Web Apps

### Secrets GitHub requis

- `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `BACKEND_API_URL`

## 📅 Données 2025

- **Bac jaune** (🟡) : Emballages + Journaux/Papiers (nouveauté 2025)
- **Bac gris** (⚫) : Ordures ménagères

### Rappel important
Depuis le 1er janvier 2025, les journaux et papiers vont dans le **bac jaune** !

## 📊 Disponibilité

L'application vise une disponibilité de **99% mensuel** avec un préavis de **48 heures** pour les maintenances planifiées.

## 🤝 Contribution

Ce projet est développé pour la Communauté de Communes Yonne Nord.

## 📝 Licence

Propriétaire - Communauté de Communes Yonne Nord

---

**Communauté de Communes Yonne Nord**
