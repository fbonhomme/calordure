# Plan Application Next.js - Gestionnaire de Collecte des Poubelles
## Pont-sur-Yonne (Bourg) - 2025

---

## 📋 Vue d'ensemble du projet

**Objectif**: Application Next.js qui indique si les poubelles jaunes et/ou grises doivent être sorties dans la semaine en cours, basée sur le calendrier de collecte 2025.

**Localisation**: Pont-sur-Yonne (Bourg)  
**Année**: 2025  
**Types de collecte**: 
- 🟡 Bac jaune (emballages + journaux/papiers)
- ⚫ Bac gris (ordures ménagères)

---

## 🏗️ Architecture technique

### Stack technologique
- **Framework**: Next.js 15/16 (App Router)
- **Runtime**: Node.js
- **Base de données**: MySQL
- **ORM**: Prisma
- **UI**: React avec TypeScript
- **Styling**: Tailwind CSS
- **Déploiement**: Vercel / Docker
- **Tunneling**: Potentiellement caddy/nginx pour reverse proxy

---

## 📊 Structure de la base de données MySQL

### Configuration MySQL

```sql
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS collecte_poubelles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE collecte_poubelles;

-- Table principale des collectes
CREATE TABLE collecte_calendrier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  type_collecte ENUM('jaune', 'gris', 'both') NOT NULL,
  annee YEAR NOT NULL DEFAULT 2025,
  mois TINYINT NOT NULL,
  jour TINYINT NOT NULL,
  est_ferie BOOLEAN DEFAULT FALSE,
  description VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_annee_mois (annee, mois),
  INDEX idx_type_collecte (type_collecte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des jours fériés
CREATE TABLE jours_feries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  nom VARCHAR(100) NOT NULL,
  annee YEAR NOT NULL,
  INDEX idx_date (date),
  INDEX idx_annee (annee)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des utilisateurs (optionnel pour notifications futures)
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  telephone VARCHAR(20),
  notif_email BOOLEAN DEFAULT FALSE,
  notif_sms BOOLEAN DEFAULT FALSE,
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs de notifications (optionnel)
CREATE TABLE notifications_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT,
  type_collecte VARCHAR(20),
  date_collecte DATE,
  date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  canal ENUM('email', 'sms', 'push') NOT NULL,
  statut ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_utilisateur (utilisateur_id),
  INDEX idx_date_envoi (date_envoi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Schema Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model CollecteCalendrier {
  id            Int       @id @default(autoincrement())
  date          DateTime  @unique @db.Date
  typeCollecte  String    @map("type_collecte") @db.VarChar(20)
  annee         Int       @db.Year
  mois          Int       @db.TinyInt
  jour          Int       @db.TinyInt
  estFerie      Boolean   @default(false) @map("est_ferie")
  description   String?   @db.VarChar(100)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@index([date])
  @@index([annee, mois])
  @@index([typeCollecte])
  @@map("collecte_calendrier")
}

model JoursFeries {
  id     Int      @id @default(autoincrement())
  date   DateTime @unique @db.Date
  nom    String   @db.VarChar(100)
  annee  Int      @db.Year

  @@index([date])
  @@index([annee])
  @@map("jours_feries")
}

model Utilisateur {
  id          Int      @id @default(autoincrement())
  email       String?  @unique @db.VarChar(255)
  telephone   String?  @db.VarChar(20)
  notifEmail  Boolean  @default(false) @map("notif_email")
  notifSms    Boolean  @default(false) @map("notif_sms")
  timezone    String   @default("Europe/Paris") @db.VarChar(50)
  createdAt   DateTime @default(now()) @map("created_at")

  notifications NotificationLog[]

  @@index([email])
  @@map("utilisateurs")
}

model NotificationLog {
  id             Int      @id @default(autoincrement())
  utilisateurId  Int      @map("utilisateur_id")
  typeCollecte   String   @map("type_collecte") @db.VarChar(20)
  dateCollecte   DateTime @map("date_collecte") @db.Date
  dateEnvoi      DateTime @default(now()) @map("date_envoi")
  canal          String   @db.VarChar(20)
  statut         String   @default("pending") @db.VarChar(20)

  utilisateur Utilisateur @relation(fields: [utilisateurId], references: [id], onDelete: Cascade)

  @@index([utilisateurId])
  @@index([dateEnvoi])
  @@map("notifications_log")
}
```

---

## 🗂️ Structure du projet Next.js

```
pont-sur-yonne-poubelles/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── icons/
│   │   ├── poubelle-jaune.svg
│   │   └── poubelle-grise.svg
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── api/
│   │   │   ├── collectes/
│   │   │   │   └── route.ts
│   │   │   ├── semaine/
│   │   │   │   └── route.ts
│   │   │   ├── calendrier/
│   │   │   │   └── [mois]/
│   │   │   │       └── route.ts
│   │   │   └── seed/
│   │   │       └── route.ts
│   │   ├── calendrier/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   ├── components/
│   │   ├── AlerteCollecte.tsx
│   │   ├── CalendrierWidget.tsx
│   │   ├── CalendrierMensuel.tsx
│   │   ├── JourCollecte.tsx
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Button.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── dateUtils.ts
│   │   ├── collecteData.ts
│   │   └── db-operations.ts
│   ├── types/
│   │   └── collecte.ts
│   └── scripts/
│       ├── seed-database.ts
│       └── extract-dates.ts
└── README.md
```

---

## 📝 Données extraites du PDF

### Fichier de données brutes

```typescript
// src/lib/collecteData.ts

/**
 * Données extraites du calendrier de collecte 2025
 * Pont-sur-Yonne (Bourg)
 */

export const collectes2025 = {
  jaune: [
    // JANVIER - mercredis
    '2025-01-08',
    '2025-01-22',
    
    // FEVRIER - mercredis
    '2025-02-05',
    '2025-02-19',
    
    // MARS - mercredis
    '2025-03-05',
    '2025-03-19',
    
    // AVRIL - mercredis
    '2025-04-02',
    '2025-04-16',
    '2025-04-30',
    
    // MAI - mercredis
    '2025-05-14',
    '2025-05-28',
    
    // JUIN - mercredis
    '2025-06-11',
    '2025-06-25',
    
    // JUILLET - mercredis
    '2025-07-09',
    '2025-07-23',
    
    // AOUT - mercredis
    '2025-08-06',
    '2025-08-20',
    
    // SEPTEMBRE - mercredis
    '2025-09-03',
    '2025-09-17',
    
    // OCTOBRE - mercredis
    '2025-10-01',
    '2025-10-15',
    '2025-10-29',
    
    // NOVEMBRE - mercredis
    '2025-11-12',
    '2025-11-26',
    
    // DECEMBRE - mercredis
    '2025-12-10',
    '2025-12-24',
  ],
  
  gris: [
    // JANVIER - mercredis + samedis
    '2025-01-01', // Mercredi - FERIE
    '2025-01-04', // Samedi
    '2025-01-11', // Samedi
    '2025-01-15', // Mercredi
    '2025-01-18', // Samedi
    '2025-01-25', // Samedi
    '2025-01-29', // Mercredi
    
    // FEVRIER
    '2025-02-01', // Samedi
    '2025-02-08', // Samedi
    '2025-02-12', // Mercredi
    '2025-02-15', // Samedi
    '2025-02-22', // Samedi
    '2025-02-26', // Mercredi
    
    // MARS
    '2025-03-01', // Samedi
    '2025-03-08', // Samedi
    '2025-03-12', // Mercredi
    '2025-03-15', // Samedi
    '2025-03-22', // Samedi
    '2025-03-26', // Mercredi
    '2025-03-29', // Samedi
    
    // AVRIL
    '2025-04-05', // Samedi
    '2025-04-09', // Mercredi
    '2025-04-12', // Samedi
    '2025-04-19', // Samedi
    '2025-04-23', // Mercredi
    '2025-04-26', // Samedi
    
    // MAI
    '2025-05-03', // Samedi
    '2025-05-07', // Mercredi
    '2025-05-10', // Samedi
    '2025-05-17', // Samedi
    '2025-05-21', // Mercredi
    '2025-05-24', // Samedi
    '2025-05-31', // Samedi
    
    // JUIN
    '2025-06-04', // Mercredi
    '2025-06-07', // Samedi
    '2025-06-14', // Samedi
    '2025-06-18', // Mercredi
    '2025-06-21', // Samedi
    '2025-06-28', // Samedi
    
    // JUILLET
    '2025-07-02', // Mercredi
    '2025-07-05', // Samedi
    '2025-07-12', // Samedi
    '2025-07-16', // Mercredi
    '2025-07-19', // Samedi
    '2025-07-26', // Samedi
    '2025-07-30', // Mercredi
    
    // AOUT
    '2025-08-02', // Samedi
    '2025-08-09', // Samedi
    '2025-08-13', // Mercredi
    '2025-08-16', // Samedi
    '2025-08-23', // Samedi
    '2025-08-27', // Mercredi
    '2025-08-30', // Samedi
    
    // SEPTEMBRE
    '2025-09-06', // Samedi
    '2025-09-10', // Mercredi
    '2025-09-13', // Samedi
    '2025-09-20', // Samedi
    '2025-09-24', // Mercredi
    '2025-09-27', // Samedi
    
    // OCTOBRE
    '2025-10-04', // Samedi
    '2025-10-08', // Mercredi
    '2025-10-11', // Samedi
    '2025-10-18', // Samedi
    '2025-10-22', // Mercredi
    '2025-10-25', // Samedi
    
    // NOVEMBRE
    '2025-11-01', // Samedi - FERIE
    '2025-11-05', // Mercredi
    '2025-11-08', // Samedi
    '2025-11-15', // Samedi
    '2025-11-19', // Mercredi
    '2025-11-22', // Samedi
    '2025-11-29', // Samedi
    
    // DECEMBRE
    '2025-12-03', // Mercredi
    '2025-12-06', // Samedi
    '2025-12-13', // Samedi
    '2025-12-17', // Mercredi
    '2025-12-20', // Samedi
    '2025-12-27', // Samedi
  ],
  
  feries: [
    { date: '2025-01-01', nom: 'Jour de l\'an' },
    { date: '2025-04-21', nom: 'Lundi de Pâques' },
    { date: '2025-05-01', nom: 'Fête du Travail' },
    { date: '2025-05-08', nom: 'Victoire 1945' },
    { date: '2025-05-29', nom: 'Ascension' },
    { date: '2025-06-09', nom: 'Lundi de Pentecôte' },
    { date: '2025-07-14', nom: 'Fête Nationale' },
    { date: '2025-08-15', nom: 'Assomption' },
    { date: '2025-11-01', nom: 'Toussaint' },
    { date: '2025-11-11', nom: 'Armistice 1918' },
    { date: '2025-12-25', nom: 'Noël' },
  ]
};

export const infoCollecte = {
  commune: 'Pont-sur-Yonne',
  secteur: 'Bourg',
  annee: 2025,
  communaute: 'Communauté de Communes Yonne Nord',
  region: 'Portes de Bourgogne',
  nouveaute: 'À partir du 1er janvier, les journaux et papiers se déposent dans le bac jaune !'
};
```

---

## 🔧 Configuration et Installation

### 1. Variables d'environnement

```env
# .env.local

# Database MySQL
DATABASE_URL="mysql://user:password@localhost:3306/collecte_poubelles"

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Timezone
TZ=Europe/Paris

# Optional: Pour notifications futures
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASSWORD=
```

### 2. Package.json

```json
{
  "name": "pont-sur-yonne-poubelles",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "tsx src/scripts/seed-database.ts"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.20.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "prisma": "^5.20.0",
    "tsx": "^4.7.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "^15.0.0"
  }
}
```

### 3. Installation

```bash
# Créer le projet
npx create-next-app@latest pont-sur-yonne-poubelles --typescript --tailwind --app

cd pont-sur-yonne-poubelles

# Installer Prisma
npm install @prisma/client
npm install -D prisma tsx

# Initialiser Prisma avec MySQL
npx prisma init --datasource-provider mysql

# Installer date-fns pour la gestion des dates
npm install date-fns

# Installer utilitaires CSS
npm install clsx tailwind-merge
```

---

## 💻 Implémentation du code

### 1. Configuration Prisma

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 2. Utilitaires de dates

```typescript
// src/lib/dateUtils.ts
import { 
  startOfWeek, 
  endOfWeek, 
  isWithinInterval, 
  format, 
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Récupère le lundi et dimanche de la semaine en cours
 */
export function getSemaineEnCours() {
  const aujourd'hui = new Date();
  const premierJour = startOfWeek(aujourd'hui, { weekStartsOn: 1 }); // Lundi
  const dernierJour = endOfWeek(aujourd'hui, { weekStartsOn: 1 }); // Dimanche
  
  return { 
    premierJour, 
    dernierJour,
    aujourdhui: aujourd'hui
  };
}

/**
 * Récupère les collectes pour une période donnée
 */
export function getCollectesDansPeriode(
  collectes: Array<{ date: Date; typeCollecte: string }>,
  debut: Date,
  fin: Date
) {
  return collectes.filter(collecte => 
    isWithinInterval(collecte.date, { start: debut, end: fin })
  );
}

/**
 * Formate une date en français
 */
export function formaterDate(date: Date, formatStr: string = 'EEEE d MMMM yyyy') {
  return format(date, formatStr, { locale: fr });
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function estAujourdhui(date: Date) {
  return isSameDay(date, new Date());
}

/**
 * Récupère tous les jours d'un mois
 */
export function getJoursDuMois(annee: number, mois: number) {
  const debut = startOfMonth(new Date(annee, mois - 1));
  const fin = endOfMonth(debut);
  return eachDayOfInterval({ start: debut, end: fin });
}

/**
 * Convertit une date string en Date
 */
export function parseDate(dateStr: string): Date {
  return parseISO(dateStr);
}
```

### 3. Opérations base de données

```typescript
// src/lib/db-operations.ts
import { prisma } from './prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function getCollectesSemaine(debut: Date, fin: Date) {
  return await prisma.collecteCalendrier.findMany({
    where: {
      date: {
        gte: startOfDay(debut),
        lte: endOfDay(fin),
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function getCollectesMois(annee: number, mois: number) {
  return await prisma.collecteCalendrier.findMany({
    where: {
      annee,
      mois,
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function getCollecteParDate(date: Date) {
  return await prisma.collecteCalendrier.findUnique({
    where: {
      date: startOfDay(date),
    },
  });
}

export async function getJoursFeries(annee: number) {
  return await prisma.joursFeries.findMany({
    where: {
      annee,
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function getProchainCollecte(typeCollecte?: string) {
  const aujourd'hui = startOfDay(new Date());
  
  return await prisma.collecteCalendrier.findFirst({
    where: {
      date: {
        gte: aujourd'hui,
      },
      ...(typeCollecte && { typeCollecte }),
    },
    orderBy: {
      date: 'asc',
    },
  });
}
```

### 4. Types TypeScript

```typescript
// src/types/collecte.ts

export type TypeCollecte = 'jaune' | 'gris' | 'both';

export interface Collecte {
  id: number;
  date: Date;
  typeCollecte: TypeCollecte;
  annee: number;
  mois: number;
  jour: number;
  estFerie: boolean;
  description?: string;
}

export interface JourFerie {
  id: number;
  date: Date;
  nom: string;
  annee: number;
}

export interface InfoSemaine {
  premierJour: Date;
  dernierJour: Date;
  aujourdhui: Date;
  collectes: Collecte[];
  aCollecteJaune: boolean;
  aCollecteGrise: boolean;
  prochainCollecte?: Collecte;
}

export interface InfoMois {
  annee: number;
  mois: number;
  collectes: Collecte[];
  joursFeries: JourFerie[];
}
```

### 5. Script de seed

```typescript
// src/scripts/seed-database.ts
import { PrismaClient } from '@prisma/client';
import { collectes2025 } from '../lib/collecteData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // Nettoyer les données existantes
  await prisma.collecteCalendrier.deleteMany({});
  await prisma.joursFeries.deleteMany({});
  console.log('✅ Données existantes supprimées');

  // Insérer les jours fériés
  console.log('📅 Insertion des jours fériés...');
  for (const ferie of collectes2025.feries) {
    const date = new Date(ferie.date);
    await prisma.joursFeries.create({
      data: {
        date,
        nom: ferie.nom,
        annee: date.getFullYear(),
      },
    });
  }
  console.log(`✅ ${collectes2025.feries.length} jours fériés insérés`);

  // Insérer les collectes jaunes
  console.log('🟡 Insertion des collectes jaunes...');
  for (const dateStr of collectes2025.jaune) {
    const date = new Date(dateStr);
    const estFerie = collectes2025.feries.some(f => f.date === dateStr);
    
    await prisma.collecteCalendrier.create({
      data: {
        date,
        typeCollecte: 'jaune',
        annee: date.getFullYear(),
        mois: date.getMonth() + 1,
        jour: date.getDate(),
        estFerie,
        description: 'Collecte bac jaune - Emballages et papiers',
      },
    });
  }
  console.log(`✅ ${collectes2025.jaune.length} collectes jaunes insérées`);

  // Insérer les collectes grises
  console.log('⚫ Insertion des collectes grises...');
  for (const dateStr of collectes2025.gris) {
    const date = new Date(dateStr);
    const estFerie = collectes2025.feries.some(f => f.date === dateStr);
    
    // Vérifier si une collecte jaune existe déjà ce jour
    const collecteExistante = await prisma.collecteCalendrier.findUnique({
      where: { date },
    });

    if (collecteExistante) {
      // Mettre à jour pour avoir les deux collectes
      await prisma.collecteCalendrier.update({
        where: { date },
        data: {
          typeCollecte: 'both',
          description: 'Collecte bac jaune et gris',
        },
      });
    } else {
      // Créer une nouvelle collecte grise
      await prisma.collecteCalendrier.create({
        data: {
          date,
          typeCollecte: 'gris',
          annee: date.getFullYear(),
          mois: date.getMonth() + 1,
          jour: date.getDate(),
          estFerie,
          description: 'Collecte bac gris - Ordures ménagères',
        },
      });
    }
  }
  console.log(`✅ ${collectes2025.gris.length} collectes grises insérées`);

  // Statistiques finales
  const totalCollectes = await prisma.collecteCalendrier.count();
  const collectesBoth = await prisma.collecteCalendrier.count({
    where: { typeCollecte: 'both' },
  });

  console.log('\n📊 Statistiques:');
  console.log(`   - Total collectes: ${totalCollectes}`);
  console.log(`   - Collectes doubles (jaune + gris): ${collectesBoth}`);
  console.log(`   - Jours fériés: ${collectes2025.feries.length}`);
  console.log('\n✅ Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 6. API Routes

#### API Semaine en cours

```typescript
// src/app/api/semaine/route.ts
import { NextResponse } from 'next/server';
import { getSemaineEnCours } from '@/lib/dateUtils';
import { getCollectesSemaine } from '@/lib/db-operations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { premierJour, dernierJour, aujourdhui } = getSemaineEnCours();
    
    const collectes = await getCollectesSemaine(premierJour, dernierJour);
    
    const aCollecteJaune = collectes.some(c => 
      c.typeCollecte === 'jaune' || c.typeCollecte === 'both'
    );
    
    const aCollecteGrise = collectes.some(c => 
      c.typeCollecte === 'gris' || c.typeCollecte === 'both'
    );
    
    return NextResponse.json({
      semaine: {
        debut: premierJour,
        fin: dernierJour,
        aujourdhui,
      },
      collectes,
      aCollecteJaune,
      aCollecteGrise,
    });
  } catch (error) {
    console.error('Erreur API /semaine:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des collectes' },
      { status: 500 }
    );
  }
}
```

#### API Calendrier mensuel

```typescript
// src/app/api/calendrier/[mois]/route.ts
import { NextResponse } from 'next/server';
import { getCollectesMois, getJoursFeries } from '@/lib/db-operations';

export async function GET(
  request: Request,
  { params }: { params: { mois: string } }
) {
  try {
    const moisNum = parseInt(params.mois);
    const annee = 2025; // Ou extraire de query params
    
    if (isNaN(moisNum) || moisNum < 1 || moisNum > 12) {
      return NextResponse.json(
        { error: 'Mois invalide' },
        { status: 400 }
      );
    }
    
    const collectes = await getCollectesMois(annee, moisNum);
    const joursFeries = await getJoursFeries(annee);
    
    return NextResponse.json({
      annee,
      mois: moisNum,
      collectes,
      joursFeries: joursFeries.filter(j => j.date.getMonth() + 1 === moisNum),
    });
  } catch (error) {
    console.error('Erreur API /calendrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du calendrier' },
      { status: 500 }
    );
  }
}
```

### 7. Composants React

#### Composant Alerte Collecte

```typescript
// src/components/AlerteCollecte.tsx
'use client';

import { formaterDate, estAujourdhui } from '@/lib/dateUtils';
import type { Collecte } from '@/types/collecte';

interface AlerteCollecteProps {
  aCollecteJaune: boolean;
  aCollecteGrise: boolean;
  collectes: Collecte[];
}

export default function AlerteCollecte({ 
  aCollecteJaune, 
  aCollecteGrise, 
  collectes 
}: AlerteCollecteProps) {
  const getIconePoubelle = (type: string) => {
    if (type === 'jaune' || type === 'both') return '🟡';
    if (type === 'gris') return '⚫';
    return '🗑️';
  };

  const getMessage = () => {
    if (!aCollecteJaune && !aCollecteGrise) {
      return {
        titre: '😌 Aucune collecte cette semaine',
        message: 'Profitez de cette semaine sans sortir les poubelles !',
        couleur: 'bg-green-50 border-green-200',
        texteCouleur: 'text-green-800',
      };
    }

    if (aCollecteJaune && aCollecteGrise) {
      return {
        titre: '🗑️ Collectes jaune ET grise cette semaine',
        message: 'Pensez à sortir vos deux poubelles !',
        couleur: 'bg-orange-50 border-orange-200',
        texteCouleur: 'text-orange-800',
      };
    }

    if (aCollecteJaune) {
      return {
        titre: '🟡 Collecte bac jaune cette semaine',
        message: 'Emballages et papiers à sortir',
        couleur: 'bg-yellow-50 border-yellow-200',
        texteCouleur: 'text-yellow-800',
      };
    }

    return {
      titre: '⚫ Collecte bac gris cette semaine',
      message: 'Ordures ménagères à sortir',
      couleur: 'bg-gray-50 border-gray-200',
      texteCouleur: 'text-gray-800',
    };
  };

  const info = getMessage();

  return (
    <div className={`rounded-xl border-2 p-6 shadow-lg ${info.couleur}`}>
      <h2 className={`text-2xl font-bold mb-3 ${info.texteCouleur}`}>
        {info.titre}
      </h2>
      <p className={`text-lg mb-4 ${info.texteCouleur}`}>
        {info.message}
      </p>

      {collectes.length > 0 && (
        <div className="space-y-2">
          <h3 className={`font-semibold ${info.texteCouleur}`}>
            Détails des collectes :
          </h3>
          {collectes.map((collecte) => (
            <div 
              key={collecte.id} 
              className={`flex items-center gap-3 p-3 rounded-lg ${
                estAujourdhui(collecte.date) 
                  ? 'bg-white border-2 border-blue-400 shadow-md' 
                  : 'bg-white/50'
              }`}
            >
              <span className="text-2xl">
                {getIconePoubelle(collecte.typeCollecte)}
              </span>
              <div className="flex-1">
                <div className="font-semibold">
                  {formaterDate(collecte.date, 'EEEE d MMMM')}
                  {estAujourdhui(collecte.date) && (
                    <span className="ml-2 text-blue-600 text-sm">
                      (Aujourd'hui !)
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {collecte.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-white/70 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Rappel :</strong> Depuis le 1er janvier 2025, 
          les journaux et papiers vont dans le bac jaune !
        </p>
      </div>
    </div>
  );
}
```

#### Composant Calendrier Widget

```typescript
// src/components/CalendrierWidget.tsx
'use client';

import { formaterDate } from '@/lib/dateUtils';

interface CalendrierWidgetProps {
  semaine: {
    debut: Date;
    fin: Date;
    aujourdhui: Date;
  };
}

export default function CalendrierWidget({ semaine }: CalendrierWidgetProps) {
  return (
    <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        📅 Semaine en cours
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Début</div>
          <div className="font-semibold text-gray-800">
            {formaterDate(semaine.debut, 'EEEE d MMM')}
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-400">
          <div className="text-sm text-gray-600 mb-1">Aujourd'hui</div>
          <div className="font-semibold text-gray-800">
            {formaterDate(semaine.aujourdhui, 'EEEE d MMM')}
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Fin</div>
          <div className="font-semibold text-gray-800">
            {formaterDate(semaine.fin, 'EEEE d MMM')}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 8. Page principale

```typescript
// src/app/page.tsx
import AlerteCollecte from '@/components/AlerteCollecte';
import CalendrierWidget from '@/components/CalendrierWidget';
import Link from 'next/link';

async function getDataSemaine() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/semaine`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }
  
  return res.json();
}

export default async function Home() {
  const data = await getDataSemaine();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🗑️ Collecte des Poubelles
          </h1>
          <p className="text-xl text-gray-600">
            Pont-sur-Yonne (Bourg)
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Communauté de Communes Yonne Nord
          </p>
        </header>

        {/* Alerte principale */}
        <AlerteCollecte
          aCollecteJaune={data.aCollecteJaune}
          aCollecteGrise={data.aCollecteGrise}
          collectes={data.collectes}
        />

        {/* Widget semaine */}
        <CalendrierWidget semaine={data.semaine} />

        {/* Légende */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            📝 Légende
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🟡</span>
              <div>
                <div className="font-semibold">Bac jaune</div>
                <div className="text-sm text-gray-600">
                  Emballages + Journaux/Papiers
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚫</span>
              <div>
                <div className="font-semibold">Bac gris</div>
                <div className="text-sm text-gray-600">
                  Ordures ménagères
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liens */}
        <div className="mt-6 text-center">
          <Link 
            href="/calendrier"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            📅 Voir le calendrier complet 2025
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© 2025 Communauté de Communes Yonne Nord</p>
          <p className="mt-1">Portes de Bourgogne</p>
        </footer>
      </div>
    </main>
  );
}
```

---

## 🚀 Étapes de déploiement

### 1. Préparation

```bash
# Installation des dépendances
npm install

# Configuration de la base de données
# Créer la base MySQL et configurer .env.local

# Générer le client Prisma
npm run prisma:generate

# Créer les migrations
npx prisma migrate dev --name init

# Seed de la base de données
npm run seed
```

### 2. Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

### 3. Production avec Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Générer Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: poubelles-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: collecte_poubelles
      MYSQL_USER: poubelles_user
      MYSQL_PASSWORD: poubelles_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - poubelles-network

  app:
    build: .
    container_name: poubelles-app
    environment:
      DATABASE_URL: "mysql://poubelles_user:poubelles_password@mysql:3306/collecte_poubelles"
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - poubelles-network

volumes:
  mysql_data:

networks:
  poubelles-network:
    driver: bridge
```

### 4. Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

**Configuration Vercel:**
- Ajouter la variable `DATABASE_URL` dans les settings
- Si MySQL distant, utiliser PlanetScale, Railway, ou autre provider

---

## 📱 Fonctionnalités futures (Roadmap)

### Version 1.1
- [ ] PWA (Progressive Web App)
- [ ] Notifications push la veille
- [ ] Mode sombre
- [ ] Vue calendrier mensuel complet

### Version 1.2
- [ ] Rappels par email
- [ ] Export iCal
- [ ] Intégration n8n pour automatisation
- [ ] API publique

### Version 2.0
- [ ] Multi-communes
- [ ] Application mobile native
- [ ] Statistiques personnelles
- [ ] Gamification (badges)

---

## 🛠️ Intégration n8n (Optionnel)

### Workflow d'exemple : Notification quotidienne

```json
{
  "name": "Rappel Poubelles",
  "nodes": [
    {
      "name": "Cron Quotidien",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "hour": 20,
          "minute": 0
        }
      }
    },
    {
      "name": "HTTP Request - API Semaine",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://votre-app.vercel.app/api/semaine",
        "method": "GET"
      }
    },
    {
      "name": "Condition - Collecte demain",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.aCollecteJaune || $json.aCollecteGrise}}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "name": "Email - Notification",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "votre@email.com",
        "subject": "🗑️ Rappel : Sortir les poubelles",
        "text": "N'oubliez pas de sortir vos poubelles ce soir !"
      }
    }
  ]
}
```

---

## 📚 Ressources et documentation

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **MySQL**: https://dev.mysql.com/doc/
- **date-fns**: https://date-fns.org/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🤝 Contribution et maintenance

### Structure Git

```
main
├── dev
├── feature/notifications
└── feature/pwa
```

### Commandes utiles

```bash
# Vérifier le schéma Prisma
npx prisma validate

# Formater le schéma
npx prisma format

# Voir la base de données
npx prisma studio

# Reset complet
npx prisma migrate reset

# Linter
npm run lint

# Build de production
npm run build
```

---

## 📝 Notes importantes

1. **Timezone**: Toujours utiliser `Europe/Paris` pour les dates
2. **Jours fériés**: Vérifier si la collecte est maintenue ou reportée
3. **Nouveauté 2025**: Papiers et journaux dans le bac jaune depuis le 1er janvier
4. **Mise à jour annuelle**: Prévoir l'ajout du calendrier 2026

---

**Auteur**: Projet Pont-sur-Yonne  
**Version**: 1.0.0  
**Date**: 2025  
**License**: MIT
