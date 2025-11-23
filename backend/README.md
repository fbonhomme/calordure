# Backend - API Ordures Ménagères

API REST Express.js pour l'application de calendrier de collecte.

## Installation

```bash
npm install
cp .env.example .env
# Éditer .env avec vos paramètres
npm run prisma:generate
npm run dev
```

## Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/semaine` | Collectes de la semaine |
| GET | `/api/calendrier/:mois` | Collectes du mois |
| GET | `/api/jours-feries/:annee` | Jours fériés |
| GET | `/api/collecte/:date` | Collecte par date |
| GET | `/api/prochaine-collecte` | Prochaine collecte |
| GET | `/health` | Health check |

## Déploiement Azure App Service

1. Créer un App Service Node.js 20
2. Configurer les variables d'environnement (DATABASE_URL, etc.)
3. Déployer via GitHub Actions ou Azure CLI
