# 🗑️ orduresMenage - Calendrier de Collecte des Déchets

Application web pour afficher le calendrier de collecte des poubelles à Pont-sur-Yonne (Bourg).

## 📋 Fonctionnalités

- **Affichage hebdomadaire** : Vue de la semaine en cours avec alertes pour les collectes
- **Calendrier mensuel** : Vue complète du mois avec toutes les dates de collecte
- **Légende** : Explication des types de bacs et rappel des changements 2025
- **Responsive** : Fonctionne sur mobile, tablette et desktop
- **Jours fériés** : Affichage des jours fériés français

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- MySQL 8.0+

### Installation

1. **Cloner le projet**
   ```bash
   git clone <repo-url>
   cd calordure
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**

   Copier `.env.example` vers `.env.local` et configurer :
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/ordures_menage"
   NODE_ENV="development"
   TZ="Europe/Paris"
   ```

4. **Créer la base de données**
   ```sql
   CREATE DATABASE ordures_menage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Exécuter les migrations Prisma**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

6. **Peupler la base de données**
   ```bash
   npm run seed
   ```

7. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

8. **Ouvrir l'application**

   Naviguer vers [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm start` - Démarrer le serveur de production
- `npm run lint` - Exécuter ESLint
- `npm run type-check` - Vérifier les types TypeScript
- `npm run seed` - Peupler la base de données

## 📁 Structure du projet

```
calordure/
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.ts            # Script de peuplement
├── src/
│   ├── app/
│   │   ├── api/           # Routes API
│   │   ├── calendrier/    # Page calendrier mensuel
│   │   ├── layout.tsx     # Layout racine
│   │   └── page.tsx       # Page d'accueil
│   ├── components/
│   │   ├── ui/            # Composants UI réutilisables
│   │   ├── AlerteCollecte.tsx
│   │   ├── CalendrierMensuel.tsx
│   │   ├── CalendrierWidget.tsx
│   │   ├── JourCollecte.tsx
│   │   └── Legende.tsx
│   ├── lib/
│   │   ├── collecteData.ts     # Données 2025
│   │   ├── dateUtils.ts        # Utilitaires de date
│   │   ├── db-operations.ts    # Opérations DB
│   │   └── prisma.ts           # Client Prisma
│   └── types/
│       └── collecte.ts         # Types TypeScript
├── public/
│   └── icons/             # Icônes SVG
├── .env.local             # Variables d'environnement
├── next.config.ts         # Configuration Next.js
├── tailwind.config.ts     # Configuration Tailwind
└── tsconfig.json          # Configuration TypeScript
```

## 🎨 Technologies

- **Framework** : Next.js 15+ (App Router)
- **Language** : TypeScript 5.x
- **UI** : React 19, Tailwind CSS
- **Base de données** : MySQL 8.0 + Prisma ORM
- **Dates** : date-fns avec locale française

## 📅 Données 2025

L'application contient les données de collecte pour l'année 2025 :

- **Bac jaune** (🟡) : Emballages + Journaux/Papiers (nouveauté 2025)
- **Bac gris** (⚫) : Ordures ménagères

### Rappel important
Depuis le 1er janvier 2025, les journaux et papiers vont dans le **bac jaune** !

## 🚀 Déploiement

### Build de production

```bash
npm run build
npm start
```

### Docker (optionnel)

Le projet est configuré avec `output: 'standalone'` dans `next.config.ts` pour faciliter le déploiement Docker.

## 📊 Disponibilité

L'application vise une disponibilité de **99% mensuel** avec un préavis de **48 heures** pour les maintenances planifiées.

## 🤝 Contribution

Ce projet est développé pour la Communauté de Communes Yonne Nord.

## 📝 Licence

Propriétaire - Communauté de Communes Yonne Nord

## 📞 Contact

Pour les mises à jour du calendrier ou les questions, contactez la mairie de Pont-sur-Yonne.

---

**Communauté de Communes Yonne Nord**
