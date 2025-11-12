# Research: Weekly Waste Collection Status Display

**Feature**: 001-collection-status-display
**Date**: 2025-11-12
**Phase**: 0 (Technology Research & Validation)

## Overview

This document consolidates research findings for technology choices, best practices, and implementation patterns for the waste collection status display application. All decisions align with the project constitution and clarified requirements.

---

## 1. Next.js 15+ App Router Decision

### Decision
Use **Next.js 15.1+ with App Router** (not Pages Router)

### Rationale
- **Server Components by default**: Reduces client-side JavaScript for better mobile performance (Constitution IV)
- **Built-in caching**: `fetch` cache, React Cache API for database queries
- **Route handlers**: Replace API routes with typed, modern route handlers
- **Streaming**: Progressive rendering for large calendar views
- **Metadata API**: SEO-friendly meta tags for municipal discoverability

### Alternatives Considered
- **Next.js Pages Router**: Rejected - legacy pattern, more client-side JS, no React Server Components
- **Remix**: Rejected - smaller ecosystem, less Vercel deployment optimization
- **Plain React + Express**: Rejected - violates Simplicity principle (manual SSR setup)

### Best Practices Applied
- Server Components for data fetching (no client-side API calls for P1 feature)
- Client Components only when interactivity required (calendar month selector)
- `force-dynamic` for `/api/semaine` (always fresh current week)
- ISR with `revalidate: 3600` for `/calendrier` pages (hourly refresh sufficient)

### Implementation Notes
- Use `export const dynamic = 'force-dynamic'` in current week route
- Cache Prisma queries with React Cache: `cache(async () => prisma.query())`
- Implement error boundaries for database failure (display cached fallback per Clarification #1)

---

## 2. MySQL + Prisma ORM

### Decision
Use **MySQL 8.0+ with Prisma 5.20+**

### Rationale
- **Constitution alignment**: "MySQL with Prisma ORM for straightforward relational data management" (Principle III)
- **DATE type support**: Native MySQL DATE type avoids timezone issues (Principle II)
- **Indexing**: Multi-column indexes (annee+mois) for efficient range queries
- **Migration safety**: Prisma Migrate tracks schema changes, prevents data loss
- **Type safety**: Generated TypeScript types from schema

### Alternatives Considered
- **PostgreSQL**: Rejected - no specific advantage for date queries, additional hosting complexity
- **SQLite**: Rejected - insufficient for multi-user concurrent access (100+ users expected)
- **MongoDB**: Rejected - overkill for relational data, poor date range query performance

### Best Practices Applied
- **Unique constraint** on `date` column prevents duplicate entries
- **Composite indexes**: `@@index([annee, mois])` for monthly calendar queries
- **Enum types** (via `@db.VarChar(20)` with validation) for `typeCollecte`
- **Prisma Client singleton** pattern (global variable in development, prevent connection exhaustion)

### Schema Validation
```prisma
model CollecteCalendrier {
  id            Int       @id @default(autoincrement())
  date          DateTime  @unique @db.Date  // ← Timezone-safe DATE type
  typeCollecte  String    @map("type_collecte") @db.VarChar(20)
  annee         Int       @db.Year
  mois          Int       @db.TinyInt
  jour          Int       @db.TinyInt
  estFerie      Boolean   @default(false) @map("est_ferie")
  description   String?   @db.VarChar(100)

  @@index([date])
  @@index([annee, mois])  // ← Multi-column index for /api/calendrier/[mois]
  @@index([typeCollecte])
  @@map("collecte_calendrier")
}
```

### Implementation Notes
- Use `prisma.$queryRaw` for complex date range queries if needed
- Implement connection pooling: `datasource db { url = env("DATABASE_URL")?pool_timeout=0&connection_limit=10 }`
- Seed script must use `upsert` to avoid duplicate errors on re-runs

---

## 3. date-fns for Date Manipulation

### Decision
Use **date-fns 3.0+ with French locale**

### Rationale
- **Immutable**: All functions return new Date objects (prevents mutation bugs)
- **Tree-shakeable**: Import only needed functions (reduces bundle size)
- **Locale support**: `import { fr } from 'date-fns/locale'` for French formatting
- **ISO 8601 week**: `startOfWeek(date, { weekStartsOn: 1 })` enforces Monday start (Constitution II)

### Alternatives Considered
- **Moment.js**: Rejected - deprecated, large bundle size, mutable API
- **Day.js**: Rejected - smaller but immature plugin ecosystem, fewer edge case tests
- **Temporal API** (JavaScript built-in): Rejected - not yet stable/widely supported

### Best Practices Applied
```typescript
import { startOfWeek, endOfWeek, isWithinInterval, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// ALWAYS pass locale for French formatting
format(date, 'EEEE d MMMM yyyy', { locale: fr })

// ALWAYS specify weekStartsOn: 1 (Monday per ISO 8601)
const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

// ALWAYS use startOfDay() for date comparisons (avoid time component issues)
import { startOfDay } from 'date-fns';
const isCollectionDate = isSameDay(startOfDay(date), startOfDay(collectionDate));
```

### Implementation Notes
- Centralize date logic in `src/lib/dateUtils.ts`
- Export typed functions: `getSemaineEnCours(): { premierJour: Date, dernierJour: Date, aujourdhui: Date }`
- Unit test week boundary edge cases (Sunday 23:59 → Monday 00:01 transition)

---

## 4. Tailwind CSS for Styling

### Decision
Use **Tailwind CSS 3.4+ with custom color palette**

### Rationale
- **Mobile-first by default**: `sm:`, `md:`, `lg:` breakpoints (Constitution IV)
- **Utility-first**: No CSS file maintenance, colocation with components
- **Purging**: Unused styles removed in production (smaller CSS bundle)
- **Dark mode ready**: `class` strategy for future feature (P3 roadmap)

### Alternatives Considered
- **CSS Modules**: Rejected - requires separate CSS files, naming conventions overhead
- **Styled-components**: Rejected - runtime CSS-in-JS impacts performance (Constitution III)
- **MUI/Chakra**: Rejected - heavy component library violates Simplicity principle

### Custom Configuration
```javascript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'yellow-bin': '#FFC107',  // Yellow bin indicator
        'grey-bin': '#757575',    // Grey bin indicator
        'alert-success': '#4CAF50', // No collection week
        'alert-warning': '#FF9800', // Both bins this week
      },
      minHeight: {
        'touch-target': '44px',  // Minimum touch target per Constitution IV
      },
    },
  },
};
```

### Best Practices Applied
- Use semantic color names (`yellow-bin`, not `warning-400`)
- Responsive classes: `class="w-full md:w-1/2 lg:w-1/3"`
- Accessibility: Always pair color with text/emoji (not color-only indicators)

---

## 5. Caching Strategy

### Decision
- **Current week page**: `export const dynamic = 'force-dynamic'` (no cache)
- **Monthly calendar pages**: `export const revalidate = 3600` (1-hour ISR)
- **Database queries**: React Cache API + Prisma
- **Offline fallback**: Service Worker caches last successful response (Clarification #1)

### Rationale
- Current week must always be accurate (Constitution I: Data-Driven Accuracy)
- Monthly calendars can be stale for 1 hour (schedules don't change intraday)
- Service Worker provides offline resilience per NFR-003, NFR-004

### Implementation Pattern
```typescript
// src/app/api/semaine/route.ts
export const dynamic = 'force-dynamic'; // Never cache

// src/app/calendrier/page.tsx
export const revalidate = 3600; // Revalidate hourly

// src/lib/db-operations.ts
import { cache } from 'react';
export const getCollectesSemaine = cache(async (debut: Date, fin: Date) => {
  return prisma.collecteCalendrier.findMany({
    where: { date: { gte: startOfDay(debut), lte: endOfDay(fin) } },
  });
});
```

### Service Worker Strategy (Future Enhancement)
```javascript
// public/sw.js (not in MVP, noted for Phase 2)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/semaine')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const cache = await caches.open('collecte-cache');
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => caches.match(event.request)) // Fallback to cache
    );
  }
});
```

---

## 6. Error Handling & Logging

### Decision
Use **Next.js built-in error handling + console logging** (no external service initially)

### Rationale
- **Simplicity First** (Constitution III): No Sentry/Datadog overhead for MVP
- **Observability requirements** (NFR-005 through NFR-008) met with structured console logs
- **Vercel Analytics**: Automatic if deployed to Vercel (web vitals, errors)

### Logging Strategy
```typescript
// src/lib/logger.ts
export const logger = {
  error: (context: string, error: unknown, metadata?: object) => {
    console.error(`[ERROR] ${context}`, {
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  },
  info: (context: string, message: string, metadata?: object) => {
    console.log(`[INFO] ${context}`, { message, timestamp: new Date().toISOString(), ...metadata });
  },
};

// Usage per NFR-005, NFR-006, NFR-007, NFR-008
logger.error('DB_CONNECTION', dbError, { query: 'getCollectesSemaine' });
logger.info('INVALID_DATE_REQUEST', 'Out-of-range month', { month: 13, year: 2025 });
logger.info('HIGH_TRAFFIC', 'Spike detected', { requestsPerMinute: 150 });
logger.info('SEED_OPERATION', 'Database seeded successfully', { recordCount: 365 });
```

### Error Boundaries
```typescript
// src/app/error.tsx (Next.js convention)
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur technique</h2>
        <p className="text-gray-700 mb-4">
          Impossible de charger les données de collecte. Veuillez réessayer.
        </p>
        <button onClick={reset} className="w-full bg-blue-600 text-white px-4 py-2 rounded">
          Réessayer
        </button>
      </div>
    </div>
  );
}
```

---

## 7. Deployment Strategy

### Decision
**Primary**: Vercel (recommended), **Fallback**: Docker + MySQL on VPS

### Rationale - Vercel
- **Zero-config Next.js deployment**: Git push → automatic build/deploy
- **Edge Functions**: Low-latency API routes (Europe region available)
- **Automatic HTTPS**: Free SSL certificates
- **Preview deployments**: Test PRs before merging
- **Cost**: Free tier supports 100 concurrent users (per constraints)

### Rationale - Docker (Alternative)
- **Full control**: Useful if municipality has existing VPS infrastructure
- **MySQL colocation**: Database on same server (lower latency)
- **Cost predictability**: Fixed VPS cost vs. Vercel usage-based

### Docker Configuration (if needed)
```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### MySQL Hosting
- **Vercel recommendation**: PlanetScale (MySQL-compatible, serverless)
- **Docker alternative**: MySQL 8.0 container on same VPS
- **Connection string**: Set `DATABASE_URL` in environment variables

---

## 8. Testing Strategy (Future Phase)

### Decision
**MVP**: Manual testing only. **Post-MVP**: Jest (unit) + Playwright (E2E)

### Rationale
- Constitution permits simplicity for MVP (no tests blocking P1 delivery)
- Prisma migrations provide schema validation (prevents SQL errors)
- TypeScript catches type errors at compile time

### Future Test Priorities
1. **Unit tests** (Jest): `dateUtils.ts` week boundary logic (critical per Constitution II)
2. **Integration tests**: Database queries (ensure indexes used correctly)
3. **E2E tests** (Playwright): P1 user story acceptance scenarios

```typescript
// tests/unit/dateUtils.test.ts (example for future)
import { getSemaineEnCours } from '@/lib/dateUtils';
import { setSystemTime } from 'jest-date-mock';

describe('getSemaineEnCours', () => {
  test('returns correct week for Sunday evening', () => {
    setSystemTime(new Date('2025-01-05T23:59:00')); // Sunday
    const { premierJour, dernierJour } = getSemaineEnCours();
    expect(premierJour).toEqual(new Date('2025-01-06')); // Monday
    expect(dernierJour).toEqual(new Date('2025-01-12')); // Sunday
  });
});
```

---

## Summary of Key Decisions

| Area | Technology | Rationale |
|------|------------|-----------|
| **Framework** | Next.js 15+ App Router | SSR, Server Components, built-in caching |
| **Database** | MySQL 8.0 + Prisma | DATE type, relational integrity, type safety |
| **Dates** | date-fns 3.0+ (French locale) | Immutable, ISO 8601 support, tree-shakeable |
| **Styling** | Tailwind CSS 3.4+ | Mobile-first, utility-first, small bundle |
| **Caching** | force-dynamic (week), ISR (calendar) | Balance accuracy vs. performance |
| **Deployment** | Vercel (primary), Docker (fallback) | Zero-config vs. full control |
| **Testing** | Manual (MVP), Jest+Playwright (future) | Simplicity for initial release |

All decisions validated against constitution principles and clarified requirements. No unresolved technical questions remain. **Ready for Phase 1 (Design & Contracts)**.
