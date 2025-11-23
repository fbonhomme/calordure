# Frontend - Ordures Ménagères

Interface utilisateur Next.js pour l'application de calendrier de collecte.

## Installation

```bash
npm install
cp .env.example .env
# Éditer .env avec NEXT_PUBLIC_API_URL
npm run dev
```

## Pages

- `/` - Page d'accueil avec les collectes de la semaine
- `/calendrier` - Calendrier mensuel complet

## Build

```bash
npm run build
# Génère le dossier out/ avec les fichiers statiques
```

## Déploiement Azure Static Web Apps

Le site est configuré pour être déployé sur Azure Static Web Apps.

1. Le build génère un export statique dans `out/`
2. `staticwebapp.config.json` configure le routage
3. GitHub Actions déploie automatiquement

## Configuration

La variable `NEXT_PUBLIC_API_URL` doit pointer vers l'URL du backend :
- Développement : `http://localhost:3001`
- Production : `https://your-backend.azurewebsites.net`
