# Guide de Déploiement sur Azure Web App

Ce guide vous aide à déployer l'application orduresMenage sur Azure Web App depuis GitHub.

## Prérequis

- Un compte Azure avec un abonnement actif
- Un dépôt GitHub avec le code source
- Base de données MySQL Azure configurée :
  - **Hostname**: gestordure.mysql.database.azure.com
  - **Port**: 3306
  - **Username**: admingest
  - **SSL**: Requis

## Étape 1 : Créer une Azure Web App

### Via le Portail Azure

1. **Connectez-vous au portail Azure** : https://portal.azure.com

2. **Créer une ressource Web App** :
   - Cliquez sur "Créer une ressource"
   - Recherchez "Web App" et sélectionnez-le
   - Cliquez sur "Créer"

3. **Configurer les paramètres de base** :
   - **Groupe de ressources** : Créez-en un nouveau ou utilisez un existant (ex: `rg-ordures-menage`)
   - **Nom** : `ordures-menage-app` (ou votre nom préféré, doit être unique)
   - **Publier** : `Code`
   - **Pile d'exécution** : `Node 20 LTS`
   - **Système d'exploitation** : `Linux`
   - **Région** : Choisissez la plus proche (ex: `West Europe`)
   - **Plan Linux** : Créez-en un nouveau ou utilisez un existant
   - **Plan tarifaire** : `B1` (Basic) minimum recommandé

4. **Configurer le déploiement** :
   - Onglet "Déploiement" : Pour l'instant, laissez par défaut
   - Nous configurerons GitHub Actions manuellement

5. **Créer la Web App** :
   - Cliquez sur "Vérifier + créer"
   - Puis "Créer"

### Via Azure CLI (Alternative)

```bash
# Créer un groupe de ressources
az group create --name rg-ordures-menage --location westeurope

# Créer un plan App Service
az appservice plan create \
  --name plan-ordures-menage \
  --resource-group rg-ordures-menage \
  --sku B1 \
  --is-linux

# Créer la Web App
az webapp create \
  --name ordures-menage-app \
  --resource-group rg-ordures-menage \
  --plan plan-ordures-menage \
  --runtime "NODE:20-lts"
```

## Étape 2 : Configurer les variables d'environnement dans Azure

1. **Accéder à la Web App** dans le portail Azure

2. **Aller dans "Configuration"** (dans le menu de gauche sous "Settings")

3. **Ajouter les variables d'environnement** :

   Cliquez sur "+ Nouvelle chaîne de connexion" ou "+ Nouveau paramètre d'application" :

   | Nom | Valeur | Type |
   |-----|--------|------|
   | `DATABASE_URL` | `mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require` | Chaîne de connexion |
   | `NODE_ENV` | `production` | Paramètre d'application |
   | `TZ` | `Europe/Paris` | Paramètre d'application |
   | `WEBSITE_NODE_DEFAULT_VERSION` | `20-lts` | Paramètre d'application |

   **Important** : Remplacez `{VOTRE_MOT_DE_PASSE}` par le mot de passe réel de votre base de données.

4. **Enregistrer** les modifications

## Étape 3 : Télécharger le profil de publication

1. Dans le portail Azure, allez dans votre Web App

2. Cliquez sur **"Obtenir le profil de publication"** (en haut de la page)

3. Un fichier `.PublishSettings` sera téléchargé - **gardez-le en sécurité**

## Étape 4 : Configurer les secrets GitHub

1. **Aller sur votre dépôt GitHub** : https://github.com/[votre-username]/orduresMenage

2. **Aller dans Settings → Secrets and variables → Actions**

3. **Ajouter les secrets suivants** :

   **Secret 1 : AZURE_WEBAPP_PUBLISH_PROFILE**
   - Cliquez sur "New repository secret"
   - Nom : `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Valeur : Ouvrez le fichier `.PublishSettings` téléchargé et copiez tout son contenu
   - Cliquez sur "Add secret"

   **Secret 2 : DATABASE_URL**
   - Cliquez sur "New repository secret"
   - Nom : `DATABASE_URL`
   - Valeur : `mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require`
   - Cliquez sur "Add secret"

## Étape 5 : Mettre à jour le workflow GitHub Actions

1. **Ouvrir le fichier** `.github/workflows/azure-webapp-deploy.yml`

2. **Modifier la ligne 10** avec le nom de votre Azure Web App :
   ```yaml
   AZURE_WEBAPP_NAME: ordures-menage-app  # Remplacer par VOTRE nom
   ```

3. **Commenter ou supprimer la section des migrations Prisma** (lignes 68-75) pour l'instant :
   ```yaml
   # Nous exécuterons les migrations manuellement la première fois
   # - name: Run Prisma migrations
   #   uses: azure/CLI@v2
   #   ...
   ```

## Étape 6 : Initialiser la base de données

Avant le premier déploiement, initialisez votre base de données Azure MySQL :

### Option A : Depuis votre machine locale

1. **Mettre à jour votre fichier .env local** :
   ```env
   DATABASE_URL="mysql://admingest:{VOTRE_MOT_DE_PASSE}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require"
   ```

2. **Exécuter les migrations** :
   ```bash
   npx prisma migrate deploy
   ```

3. **Optionnel - Remplir avec des données initiales** :
   ```bash
   npm run seed
   ```

### Option B : Via Azure Cloud Shell

1. Ouvrir Azure Cloud Shell dans le portail Azure

2. Installer Node.js et cloner votre projet

3. Exécuter les migrations Prisma

## Étape 7 : Déployer l'application

1. **Committer les changements** :
   ```bash
   git add .
   git commit -m "Configure Azure Web App deployment"
   ```

2. **Pousser vers GitHub** :
   ```bash
   git push origin master
   ```

3. **Vérifier le déploiement** :
   - Allez sur GitHub → Actions
   - Vous devriez voir le workflow "Deploy to Azure Web App" en cours d'exécution
   - Attendez que le déploiement se termine (environ 3-5 minutes)

## Étape 8 : Vérifier le déploiement

1. **Accéder à votre application** :
   ```
   https://ordures-menage-app.azurewebsites.net
   ```
   (Remplacez par le nom de votre Web App)

2. **Vérifier les logs en cas d'erreur** :
   - Dans le portail Azure → Votre Web App → "Log stream"
   - Ou utilisez Azure CLI :
     ```bash
     az webapp log tail --name ordures-menage-app --resource-group rg-ordures-menage
     ```

## Configuration de la commande de démarrage (Important pour Next.js)

Dans le portail Azure :

1. Allez dans votre Web App → **Configuration** → **Paramètres généraux**

2. **Commande de démarrage** :
   ```bash
   node_modules/.bin/next start -p 8080
   ```

   Ou pour standalone build (recommandé) :
   ```bash
   node .next/standalone/server.js
   ```

3. Enregistrer les modifications

## Dépannage

### L'application ne démarre pas

1. **Vérifier les logs** :
   ```bash
   az webapp log tail --name ordures-menage-app --resource-group rg-ordures-menage
   ```

2. **Vérifier les variables d'environnement** dans Configuration

3. **Vérifier que Prisma Client est généré** pendant le build

### Erreur de connexion à la base de données

1. **Vérifier les règles de pare-feu MySQL** :
   - Dans le portail Azure → Votre serveur MySQL → Sécurité de la connexion
   - Ajoutez l'adresse IP sortante de votre Web App
   - Ou activez "Autoriser l'accès aux services Azure"

2. **Vérifier le format de DATABASE_URL** :
   ```
   mysql://admingest:{password}@gestordure.mysql.database.azure.com:3306/ordures_menage?sslmode=require
   ```

### Le build échoue

1. Vérifier que toutes les dépendances sont dans `package.json`
2. Vérifier que le build fonctionne localement : `npm run build`
3. Vérifier les logs GitHub Actions pour plus de détails

## Mise à jour de l'application

Pour mettre à jour l'application après le déploiement initial :

1. Faites vos modifications dans le code
2. Committez et poussez vers master :
   ```bash
   git add .
   git commit -m "Description des modifications"
   git push origin master
   ```
3. Le workflow GitHub Actions se déclenchera automatiquement
4. Attendez la fin du déploiement

## Ressources supplémentaires

- [Documentation Azure Web App](https://docs.microsoft.com/azure/app-service/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Azure MySQL](https://www.prisma.io/docs/guides/database/azure-mysql)
