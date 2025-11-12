# Data Model: Weekly Waste Collection Status Display

**Feature**: 001-collection-status-display
**Date**: 2025-11-12
**Phase**: 1 (Database Schema & Entity Relationships)

## Overview

This document defines the complete data model for the waste collection application, including database schema, entity relationships, validation rules, and state transitions. The model is optimized for date-range queries and aligns with Constitution Principles I (Data-Driven Accuracy) and V (Database as Single Source of Truth).

---

## Entity Relationship Diagram

```
┌─────────────────────────┐
│  CollecteCalendrier     │
│  (Collection Dates)     │
├─────────────────────────┤
│ • id (PK)               │
│ • date (UNIQUE)         │◄───────┐
│ • typeCollecte          │        │
│ • annee                 │        │ Foreign Key
│ • mois                  │        │ Reference
│ • jour                  │        │ (not enforced,
│ • estFerie ───────┐     │        │  lookup only)
│ • description      │     │        │
│ • createdAt        │     │        │
│ • updatedAt        │     │        │
└────────────────────┼────┘        │
                     │             │
         ┌───────────▼─────────────┼────────────┐
         │                         │            │
┌────────▼─────────┐     ┌─────────▼──────┐    │
│   JoursFeries    │     │  Utilisateur   │    │
│  (Holidays)      │     │  (Users)       │    │
├──────────────────┤     ├────────────────┤    │
│ • id (PK)        │     │ • id (PK)      │    │
│ • date (UNIQUE)  │     │ • email        │    │
│ • nom            │     │ • telephone    │    │
│ • annee          │     │ • notifEmail   │    │
└──────────────────┘     │ • notifSms     │    │
                         │ • timezone     │    │
                         │ • createdAt    │    │
                         └────────┬───────┘    │
                                  │            │
                                  │ One-to-Many│
                                  │            │
                         ┌────────▼────────────▼──┐
                         │  NotificationLog       │
                         │  (Notification History)│
                         ├────────────────────────┤
                         │ • id (PK)              │
                         │ • utilisateurId (FK)   │
                         │ • typeCollecte         │
                         │ • dateCollecte         │
                         │ • dateEnvoi            │
                         │ • canal                │
                         │ • statut               │
                         └────────────────────────┘

Legend:
  ─── : Direct relationship
  ◄── : Lookup relationship (not FK enforced)
  PK  : Primary Key
  FK  : Foreign Key
```

**Note**: `Utilisateur` and `NotificationLog` tables are **prepared but not implemented** in MVP (per Constitution VI: Progressive Enhancement). They support future notification features without schema changes.

---

## 1. CollecteCalendrier (Collection Dates)

### Purpose
Stores all waste collection dates for the year with type (yellow bin, grey bin, or both) and holiday flagging.

### Prisma Schema
```prisma
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

  @@index([date], name: "idx_date")
  @@index([annee, mois], name: "idx_annee_mois")
  @@index([typeCollecte], name: "idx_type_collecte")
  @@map("collecte_calendrier")
}
```

### Fields

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Surrogate key |
| `date` | DATE | UNIQUE, NOT NULL | Collection date (timezone-safe, no time component) |
| `typeCollecte` | VARCHAR(20) | NOT NULL, ENUM-like | Collection type: 'jaune', 'gris', 'both' |
| `annee` | YEAR | NOT NULL | Denormalized year for efficient filtering |
| `mois` | TINYINT | NOT NULL, 1-12 | Denormalized month for composite index |
| `jour` | TINYINT | NOT NULL, 1-31 | Denormalized day for display |
| `estFerie` | BOOLEAN | DEFAULT FALSE | Flags if collection falls on public holiday |
| `description` | VARCHAR(100) | NULLABLE | Human-readable description (e.g., "Collecte bac jaune - Emballages et papiers") |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit trail |
| `updatedAt` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Audit trail |

### Validation Rules

1. **Type Validation** (Application-Level):
   ```typescript
   const VALID_TYPES = ['jaune', 'gris', 'both'] as const;
   type TypeCollecte = typeof VALID_TYPES[number];
   ```

2. **Date Range Validation**:
   - Year: Must be 2025 for MVP (expandable per Clarification #4)
   - Month: 1-12
   - Day: 1-31 (validated by MySQL DATE type)

3. **Uniqueness**: Only one collection entry per date (enforced by UNIQUE constraint)

### Index Strategy

| Index | Columns | Purpose | Query Pattern |
|-------|---------|---------|---------------|
| `idx_date` | `date` | Primary lookup | `WHERE date BETWEEN ? AND ?` (current week) |
| `idx_annee_mois` | `annee, mois` | Monthly calendar | `WHERE annee = 2025 AND mois = ?` |
| `idx_type_collecte` | `typeCollecte` | Filter by type | `WHERE typeCollecte IN ('jaune', 'both')` (future) |

### State Transitions

**No state machine** - collection dates are immutable after seeding. Updates only occur during annual data refresh (per Constitution V).

### Retention Policy

- **Current year (2025)**: All records retained
- **Previous year (2024)**: Retained until March 31, 2025 (3-month grace period per Clarification #2)
- **Older years**: Purged annually via maintenance script

```sql
-- Maintenance query (run annually)
DELETE FROM collecte_calendrier
WHERE annee < YEAR(CURDATE()) - 1
  AND MONTH(CURDATE()) > 3;
```

---

## 2. JoursFeries (Public Holidays)

### Purpose
Tracks French national holidays that may affect collection schedules. Used for display purposes and `estFerie` flag population.

### Prisma Schema
```prisma
model JoursFeries {
  id     Int      @id @default(autoincrement())
  date   DateTime @unique @db.Date
  nom    String   @db.VarChar(100)
  annee  Int      @db.Year

  @@index([date], name: "idx_date")
  @@index([annee], name: "idx_annee")
  @@map("jours_feries")
}
```

### Fields

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Surrogate key |
| `date` | DATE | UNIQUE, NOT NULL | Holiday date |
| `nom` | VARCHAR(100) | NOT NULL | Holiday name in French (e.g., "Jour de l'an", "Fête du Travail") |
| `annee` | YEAR | NOT NULL | Year for filtering |

### French Public Holidays 2025

| Date | Name | Impact on Collection |
|------|------|----------------------|
| 2025-01-01 | Jour de l'an | Collection maintained (verified per PDF) |
| 2025-04-21 | Lundi de Pâques | TBD by municipality |
| 2025-05-01 | Fête du Travail | TBD by municipality |
| 2025-05-08 | Victoire 1945 | TBD by municipality |
| 2025-05-29 | Ascension | TBD by municipality |
| 2025-06-09 | Lundi de Pentecôte | TBD by municipality |
| 2025-07-14 | Fête Nationale | TBD by municipality |
| 2025-08-15 | Assomption | TBD by municipality |
| 2025-11-01 | Toussaint | Collection maintained (verified per PDF) |
| 2025-11-11 | Armistice 1918 | TBD by municipality |
| 2025-12-25 | Noël | TBD by municipality |

**Note**: `estFerie` flag in `CollecteCalendrier` is set during seeding by matching `date` against `JoursFeries`.

---

## 3. Utilisateur (Users - Future Feature)

### Purpose
**Not implemented in MVP.** Prepares for future notification features (email/SMS reminders). Schema included per Constitution VI (Progressive Enhancement).

### Prisma Schema
```prisma
model Utilisateur {
  id          Int      @id @default(autoincrement())
  email       String?  @unique @db.VarChar(255)
  telephone   String?  @db.VarChar(20)
  notifEmail  Boolean  @default(false) @map("notif_email")
  notifSms    Boolean  @default(false) @map("notif_sms")
  timezone    String   @default("Europe/Paris") @db.VarChar(50)
  createdAt   DateTime @default(now()) @map("created_at")

  notifications NotificationLog[]

  @@index([email], name: "idx_email")
  @@map("utilisateurs")
}
```

### Future Use Cases
- **User Story 4** (Roadmap): Residents subscribe for evening-before reminders
- **Admin Panel** (Roadmap): Municipality staff manage notification lists
- **Analytics** (Roadmap): Track reminder engagement rates

### Validation Rules (Future)
- Email: RFC 5322 format validation
- Telephone: E.164 format (French numbers: +33...)
- At least one of `email` or `telephone` required if notifications enabled

---

## 4. NotificationLog (Notification History - Future Feature)

### Purpose
**Not implemented in MVP.** Tracks sent notifications for audit and retry logic.

### Prisma Schema
```prisma
model NotificationLog {
  id             Int      @id @default(autoincrement())
  utilisateurId  Int      @map("utilisateur_id")
  typeCollecte   String   @map("type_collecte") @db.VarChar(20)
  dateCollecte   DateTime @map("date_collecte") @db.Date
  dateEnvoi      DateTime @default(now()) @map("date_envoi")
  canal          String   @db.VarChar(20)
  statut         String   @default("pending") @db.VarChar(20)

  utilisateur Utilisateur @relation(fields: [utilisateurId], references: [id], onDelete: Cascade)

  @@index([utilisateurId], name: "idx_utilisateur")
  @@index([dateEnvoi], name: "idx_date_envoi")
  @@map("notifications_log")
}
```

### State Machine (Future)
```
pending ──► sent ──► (terminal)
   │
   └──► failed ──► pending (retry)
```

---

## Query Patterns

### 1. Get Current Week Collections
```typescript
// src/lib/db-operations.ts
import { prisma } from './prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function getCollectesSemaine(debut: Date, fin: Date) {
  return await prisma.collecteCalendrier.findMany({
    where: {
      date: {
        gte: startOfDay(debut), // Monday 00:00:00
        lte: endOfDay(fin),     // Sunday 23:59:59
      },
    },
    orderBy: { date: 'asc' },
  });
}
```

**Indexes Used**: `idx_date` (range scan)

### 2. Get Monthly Calendar
```typescript
export async function getCollectesMois(annee: number, mois: number) {
  return await prisma.collecteCalendrier.findMany({
    where: {
      annee,
      mois,
    },
    orderBy: { date: 'asc' },
  });
}
```

**Indexes Used**: `idx_annee_mois` (composite index, very efficient)

### 3. Check Holiday Status
```typescript
export async function estJourFerie(date: Date): Promise<boolean> {
  const holiday = await prisma.joursFeries.findUnique({
    where: { date: startOfDay(date) },
  });
  return !!holiday;
}
```

**Indexes Used**: `idx_date` (unique lookup, O(1))

---

## Data Seeding

### Seed Script Strategy
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { collectes2025 } from '../src/lib/collecteData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed holidays first (for estFerie flag lookup)
  for (const ferie of collectes2025.feries) {
    await prisma.joursFeries.upsert({
      where: { date: new Date(ferie.date) },
      update: {},
      create: {
        date: new Date(ferie.date),
        nom: ferie.nom,
        annee: 2025,
      },
    });
  }

  // 2. Seed yellow bin collections
  for (const dateStr of collectes2025.jaune) {
    const date = new Date(dateStr);
    const estFerie = await estJourFerie(date);

    await prisma.collecteCalendrier.upsert({
      where: { date },
      update: {},
      create: {
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

  // 3. Seed grey bin collections (merge if yellow already exists)
  for (const dateStr of collectes2025.gris) {
    const date = new Date(dateStr);
    const existing = await prisma.collecteCalendrier.findUnique({ where: { date } });

    if (existing) {
      // Dual collection day - update to 'both'
      await prisma.collecteCalendrier.update({
        where: { date },
        data: {
          typeCollecte: 'both',
          description: 'Collecte bac jaune et gris',
        },
      });
    } else {
      // Grey-only collection
      const estFerie = await estJourFerie(date);
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

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Running Seeds
```bash
# Development
npx prisma db push  # Apply schema without migration
npx prisma db seed  # Run seed script

# Production
npx prisma migrate deploy  # Apply migrations
npx prisma db seed          # Seed production data
```

---

## TypeScript Type Definitions

### Generated Types (from Prisma)
```typescript
// node_modules/.prisma/client/index.d.ts (auto-generated)
export type CollecteCalendrier = {
  id: number;
  date: Date;
  typeCollecte: string;
  annee: number;
  mois: number;
  jour: number;
  estFerie: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
```

### Custom Application Types
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
}

export interface InfoMois {
  annee: number;
  mois: number;
  collectes: Collecte[];
  joursFeries: JourFerie[];
}
```

---

## Database Migration Strategy

### Initial Migration
```bash
# Create initial migration
npx prisma migrate dev --name init

# Generates: prisma/migrations/20251112_init/migration.sql
```

### Future Schema Changes
```bash
# Add new column example (future: add 'zone' for multi-sector support)
npx prisma migrate dev --name add_zone_column

# Prisma generates:
# - Migration SQL
# - Updated Prisma Client types
# - Rollback capability (via Prisma Migrate)
```

### Production Deployment
```bash
# Apply pending migrations (no prompt)
npx prisma migrate deploy

# Verify schema matches
npx prisma db pull  # Introspect actual DB
```

---

## Performance Considerations

### Index Effectiveness
- **Current week query**: Uses `idx_date` range scan (~7 rows scanned)
- **Monthly calendar query**: Uses `idx_annee_mois` (~30 rows scanned)
- **Holiday lookup**: Uses `idx_date` unique index (O(1))

### Query Optimization
```typescript
// ✅ GOOD: Uses indexes
prisma.collecteCalendrier.findMany({
  where: {
    annee: 2025,
    mois: 11,
  },
});

// ❌ BAD: Full table scan
prisma.collecteCalendrier.findMany({
  where: {
    description: { contains: 'jaune' },
  },
});
```

### Connection Pooling
```env
# .env.local
DATABASE_URL="mysql://user:pass@localhost:3306/collecte_poubelles?connection_limit=10&pool_timeout=30"
```

---

## Summary

- **4 entities** defined: 2 active (CollecteCalendrier, JoursFeries), 2 future-ready (Utilisateur, NotificationLog)
- **3 composite indexes** for efficient date range and monthly queries
- **Unique constraints** enforce data integrity (no duplicate collection dates)
- **Retention policy** documented (previous year retained 3 months)
- **Seeding strategy** handles dual-collection merging logic
- **Type safety** via Prisma-generated TypeScript types

All entity definitions validated against functional requirements (FR-001 through FR-017) and success criteria (SC-002: 100% accuracy). **Ready for Phase 1 API contracts generation**.
