# Guide de Déploiement sur Azure Static Web Apps

Ce guide vous aide à déployer l'application orduresMenage sur Azure Static Web Apps avec Azure Functions pour les APIs.

## Architecture

- **Frontend** : Next.js 15 avec export statique (hébergé sur Azure Static Web Apps)
- **Backend** : Azure Functions pour les routes API dynamiques (intégré à Static Web Apps)
- **Base de données** : MySQL Azure Database

## Prérequis

- Un compte Azure avec un abonnement actif
- Un dépôt GitHub avec le code source
- Base de données MySQL Azure configurée :
  - **Hostname** : gestordure.mysql.database.azure.com
  - **Port** : 3306
  - **Username** : admingest
  - **SSL** : Requis

## Configuration actuelle

Votre application est déjà déployée sur :
- **Service** : Azure Static Web Apps
- **Nom** : calendrierordure
- **URL** : https://kind-wave-0a7f2a603.3.azurestaticapps.net
- **Région** : West Europe
- **SKU** : Standard

## Étape 1 : Configurer les secrets GitHub

### Secrets nécessaires

Allez dans votre dépôt GitHub → **Settings** → **Secrets and variables** → **Actions**

1. **AZURE_STATIC_WEB_APPS_API_TOKEN_KIND_WAVE_0A7F2A603** ✅ (déjà configuré)
   - Token d'authentification pour le déploiement Azure Static Web Apps

2. **DATABASE_URL** (à ajouter si manquant)
   - Nom : `DATABASE_URL`
   - Valeur : `mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require`
   - ⚠️ Remplacez `{VOTRE_MOT_DE_PASSE}` par votre mot de passe réel

## Étape 2 : Configurer les variables d'environnement dans Azure

### Via le Portail Azure

1. **Accéder à votre Static Web App** : https://portal.azure.com
2. Recherchez "calendrierordure" dans la barre de recherche
3. Allez dans **Configuration** (menu de gauche)
4. Cliquez sur **+ Add** pour ajouter des variables d'environnement :

| Nom | Valeur |
|-----|--------|
| `DATABASE_URL` | `mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require` |
| `NODE_ENV` | `production` |
| `TZ` | `Europe/Paris` |

5. Cliquez sur **Save** pour enregistrer

### Via Azure CLI (Alternative)

```bash
# Se connecter à Azure
az login

# Configurer les variables d'environnement
az staticwebapp appsettings set \
  --name calendrierordure \
  --setting-names \
    DATABASE_URL="mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require" \
    NODE_ENV="production" \
    TZ="Europe/Paris"
```

## Étape 3 : Initialiser la base de données

Avant le premier déploiement, initialisez votre base de données MySQL Azure :

### Depuis votre machine locale

1. **Créer un fichier .env.production** :
   ```env
   DATABASE_URL="mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require"
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Générer Prisma Client** :
   ```bash
   npx prisma generate
   ```

4. **Exécuter les migrations** :
   ```bash
   npx prisma migrate deploy
   ```

5. **Optionnel - Remplir avec des données initiales** :
   ```bash
   npm run seed
   ```

## Étape 4 : Déployer l'application

### Déploiement automatique

Le workflow GitHub Actions se déclenche automatiquement sur chaque push vers `master` :

1. **Committer vos changements** :
   ```bash
   git add .
   git commit -m "Configure Azure Static Web Apps with Functions"
   ```

2. **Pousser vers GitHub** :
   ```bash
   git push origin master
   ```

3. **Suivre le déploiement** :
   - Allez sur GitHub → **Actions**
   - Vous verrez le workflow "Azure Static Web Apps CI/CD" en cours
   - Durée moyenne : 3-5 minutes

### Structure du workflow

Le fichier `.github/workflows/azure-static-web-apps-kind-wave-0a7f2a603.yml` gère :

1. **Build Next.js** : Export statique du frontend
2. **Déploiement Frontend** : Upload vers Azure Static Web Apps
3. **Déploiement API** : Déploiement des Azure Functions depuis le dossier `api/`

## Étape 5 : Vérifier le déploiement

### Accéder à l'application

```
https://kind-wave-0a7f2a603.3.azurestaticapps.net
```

### Tester les APIs

1. **API Semaine** :
   ```bash
   curl https://kind-wave-0a7f2a603.3.azurestaticapps.net/api/semaine
   ```

2. **API Calendrier** :
   ```bash
   curl https://kind-wave-0a7f2a603.3.azurestaticapps.net/api/calendrier/1
   ```

### Vérifier les logs en cas d'erreur

#### Via le Portail Azure

1. Allez dans votre Static Web App → **Functions**
2. Cliquez sur une fonction → **Monitor**
3. Consultez les logs d'exécution

#### Via Azure CLI

```bash
# Installer Azure Functions Core Tools
npm install -g azure-functions-core-tools@4

# Récupérer les logs
az staticwebapp functions list --name calendrierordure --resource-group site_web
```

## Structure du projet

```
orduresMenage/
├── .github/workflows/
│   └── azure-static-web-apps-kind-wave-0a7f2a603.yml  # Workflow de déploiement
├── api/                                                 # Azure Functions
│   ├── calendrier/                                      # Function: GET /api/calendrier/{mois}
│   │   ├── index.ts
│   │   └── function.json
│   ├── semaine/                                         # Function: GET /api/semaine
│   │   ├── index.ts
│   │   └── function.json
│   ├── lib/                                             # Utilitaires partagés
│   │   ├── prisma.ts
│   │   ├── db-operations.ts
│   │   └── dateUtils.ts
│   ├── prisma/                                          # Schéma Prisma (copie)
│   ├── package.json
│   ├── tsconfig.json
│   └── host.json
├── src/                                                 # Frontend Next.js
├── staticwebapp.config.json                             # Configuration Azure Static Web Apps
├── next.config.ts                                       # Configuration Next.js (export statique)
└── package.json
```

## Configuration Azure Static Web Apps

Le fichier `staticwebapp.config.json` configure :

- **Routing** : Redirection des requêtes `/api/*` vers Azure Functions
- **Fallback** : Gestion du 404
- **Headers** : Sécurité (CSP, X-Frame-Options, etc.)

## Dépannage

### L'application frontend ne se charge pas

1. **Vérifier le build Next.js** :
   ```bash
   npm run build
   ```
   - Le dossier `out/` doit être créé

2. **Vérifier les logs GitHub Actions** :
   - Recherchez des erreurs dans l'étape "Build Next.js"

### Les APIs retournent 500

1. **Vérifier la variable DATABASE_URL** :
   - Dans le portail Azure → Static Web App → Configuration
   - Format : `mysql://admingest:PASSWORD@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require`

2. **Vérifier les règles de pare-feu MySQL** :
   - Portail Azure → Serveur MySQL → Networking
   - Cochez **"Allow public access from any Azure service"**

3. **Consulter les logs Azure Functions** :
   - Portail Azure → Static Web App → Functions → Sélectionner une fonction → Monitor

### Erreur de connexion à la base de données

**Symptôme** : `Error: P1001: Can't reach database server`

**Solutions** :

1. **Activer l'accès Azure** :
   ```bash
   az mysql server firewall-rule create \
     --resource-group site_web \
     --server gestordure \
     --name AllowAllAzureIPs \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
   ```

2. **Vérifier le format SSL dans DATABASE_URL** :
   ```
   ?sslmode=require
   ```

### Le build échoue

1. **Erreur Prisma Client** :
   - Vérifiez que `npx prisma generate` s'exécute dans le workflow
   - Vérifiez que le schéma Prisma existe dans `prisma/schema.prisma`

2. **Erreur de dépendances** :
   ```bash
   # Nettoyer et réinstaller
   rm -rf node_modules package-lock.json
   npm install
   ```

## Mise à jour de l'application

### Workflow automatique

1. **Modifier le code** dans votre branche locale
2. **Committer** :
   ```bash
   git add .
   git commit -m "Description des modifications"
   ```
3. **Pousser** :
   ```bash
   git push origin master
   ```
4. Le déploiement se fait automatiquement via GitHub Actions

### Pull Requests

Le workflow supporte également les Pull Requests :
- Chaque PR crée un **environnement de staging temporaire**
- URL : `https://kind-wave-0a7f2a603-{pr-number}.westeurope.3.azurestaticapps.net`
- L'environnement est automatiquement supprimé à la fermeture de la PR

## Limitations d'Azure Static Web Apps

### ✅ Supporté

- Export statique Next.js (SSG)
- Azure Functions pour les APIs
- Connexion à des bases de données externes (MySQL, PostgreSQL)
- Variables d'environnement
- Domaines personnalisés
- SSL/TLS automatique

### ❌ Non supporté

- Server-Side Rendering (SSR) Next.js
- Middleware Next.js dynamique
- Routes API Next.js natives (remplacées par Azure Functions)
- Génération dynamique d'images Next.js

## Surveillance et monitoring

### Application Insights (recommandé)

1. **Créer une ressource Application Insights** :
   ```bash
   az monitor app-insights component create \
     --app ordures-menage-insights \
     --location westeurope \
     --resource-group site_web \
     --application-type web
   ```

2. **Lier à Static Web App** :
   - Portail Azure → Static Web App → Application Insights
   - Sélectionner votre ressource Application Insights

3. **Consulter les métriques** :
   - Temps de réponse des APIs
   - Erreurs et exceptions
   - Performances frontend

## Coûts estimés

### Azure Static Web Apps - Standard

- **Bande passante** : 100 GB/mois inclus
- **Functions** : 1 million d'exécutions incluses
- **Coût estimé** : ~9€/mois (selon usage)

### MySQL Azure Database

- Selon le tier choisi (Basic, Standard, etc.)
- Coût variable selon la taille et les performances

## Ressources supplémentaires

- [Documentation Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/)
- [Azure Functions avec TypeScript](https://learn.microsoft.com/azure/azure-functions/functions-reference-node)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Prisma avec Azure MySQL](https://www.prisma.io/docs/guides/database/azure-mysql)
- [GitHub Actions pour Azure](https://github.com/Azure/actions)

## Support

Pour toute question ou problème :
1. Consulter les logs GitHub Actions
2. Vérifier les logs Azure Functions dans le portail
3. Consulter la documentation officielle Azure
