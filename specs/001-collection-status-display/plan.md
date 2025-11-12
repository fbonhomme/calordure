# Implementation Plan: Weekly Waste Collection Status Display

**Branch**: `001-collection-status-display` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-collection-status-display/spec.md`

## Summary

Build a mobile-first web application for Pont-sur-Yonne residents to check current week waste collection schedules and view the full 2025 calendar. Primary requirement: Display which bins (yellow for recyclables/paper, grey for general waste) need to be taken out this week with 100% calendar accuracy. Technical approach: Next.js 15+ with App Router, MySQL database via Prisma ORM, Tailwind CSS for responsive design, server-side rendering with caching for performance.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15+ (App Router), Node.js 20+ runtime
**Primary Dependencies**: Next.js, React 19, Prisma (MySQL ORM), date-fns (date manipulation with French locale), Tailwind CSS
**Storage**: MySQL 8.0+ database with indexed date lookups, local cache for offline resilience
**Testing**: Jest + React Testing Library (component tests), Playwright (E2E), Prisma migrations (schema validation)
**Target Platform**: Web (responsive 320px-2560px), deployed to Vercel or Docker containers
**Project Type**: Single web application (Next.js monorepo)
**Performance Goals**: <2s initial page load (LCP), <200ms API response time, support 100 concurrent users
**Constraints**: Europe/Paris timezone only, current year (2025) calendar scope, French language, no authentication
**Scale/Scope**: Single municipality (Pont-sur-Yonne Bourg), ~500-1000 expected monthly active users, 365 collection dates/year

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Data-Driven Accuracy
- **Status**: PASS
- Collection dates stored in MySQL with unique DATE constraints (per schema)
- Database seeding from official 2025 calendar data (collecteData.ts)
- Week calculation logic separated in dateUtils.ts (testable, not hardcoded)
- Primary interface displays current week status (FR-001, FR-002)

### ✅ II. Timezone Consistency
- **Status**: PASS
- Prisma schema uses `@db.Date` type (no time component ambiguity)
- date-fns configured with Europe/Paris timezone and French locale (fr)
- ISO 8601 week boundaries (Monday start) enforced in dateUtils (FR-013)
- Server-side date calculations prevent client timezone interference

### ✅ III. Performance & Simplicity First
- **Status**: PASS
- Next.js App Router for SSR (appropriate for dynamic dates)
- Prisma direct queries (no repository abstraction layer per constitution)
- No authentication complexity (public access, per assumptions)
- Tailwind utility classes (no CSS-in-JS overhead)
- Caching strategy: ISR for calendar pages, force-dynamic for current week

### ✅ IV. Mobile-First Responsive Design
- **Status**: PASS
- Tailwind CSS responsive breakpoints (320px minimum per SC-010)
- Component structure prioritizes mobile layout (AlerteCollecte, CalendrierWidget)
- Touch targets 44px minimum (per UI principle)
- Emoji visual indicators (🟡 yellow, ⚫ grey) for quick recognition (FR-004)
- Progressive enhancement: core HTML renders without JavaScript

### ✅ V. Database as Single Source of Truth
- **Status**: PASS
- Seed script loads collecteData.ts into MySQL (one-time initialization)
- Application code queries database, never reads collecteData.ts directly
- Annual updates via seed script only (no code deployment)
- Indexed queries (date, annee+mois, type_collecte) for performance

### ✅ VI. Progressive Enhancement & Future Readiness
- **Status**: PASS
- Optional tables prepared (utilisateurs, notifications_log) but not implemented
- API routes designed for both public and future authenticated access
- Schema supports multi-year data (annee column, retention policy 3 months)
- Component architecture allows notification features without refactoring

### Summary: ALL GATES PASSED ✅
No constitution violations. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-collection-status-display/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (entity relationships)
├── quickstart.md        # Phase 1 output (setup guide)
├── contracts/           # Phase 1 output (API specs)
│   ├── api-semaine.yaml
│   ├── api-calendrier.yaml
│   └── api-seed.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
orduresMenage/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma          # Database models (Prisma ORM)
│   ├── migrations/            # Auto-generated schema migrations
│   └── seed.ts                # Database seeding script
├── public/
│   ├── icons/
│   │   ├── poubelle-jaune.svg
│   │   └── poubelle-grise.svg
│   └── manifest.json          # PWA manifest (future)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (French locale, metadata)
│   │   ├── page.tsx           # Home page (current week status)
│   │   ├── globals.css        # Tailwind directives
│   │   ├── api/               # API Routes (Next.js route handlers)
│   │   │   ├── semaine/
│   │   │   │   └── route.ts   # GET /api/semaine (current week)
│   │   │   ├── calendrier/
│   │   │   │   └── [mois]/
│   │   │   │       └── route.ts # GET /api/calendrier/[mois]
│   │   │   └── seed/
│   │   │       └── route.ts   # POST /api/seed (admin only, future)
│   │   └── calendrier/
│   │       └── page.tsx       # Monthly calendar page
│   ├── components/            # React components
│   │   ├── AlerteCollecte.tsx # Main alert (P1: current week status)
│   │   ├── CalendrierWidget.tsx # Week display widget
│   │   ├── CalendrierMensuel.tsx # Monthly calendar grid (P2)
│   │   ├── JourCollecte.tsx   # Single day collection display
│   │   └── ui/                # Reusable UI primitives
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Button.tsx
│   ├── lib/                   # Utility libraries
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── dateUtils.ts       # Date manipulation (Europe/Paris, ISO 8601)
│   │   ├── collecteData.ts    # Raw 2025 calendar data (seed source)
│   │   └── db-operations.ts   # Database query functions
│   ├── types/
│   │   └── collecte.ts        # TypeScript types/interfaces
│   └── scripts/
│       └── seed-database.ts   # CLI seed script (npm run seed)
└── tests/                     # Future: E2E and integration tests
    ├── e2e/                   # Playwright E2E tests
    ├── integration/           # API integration tests
    └── unit/                  # Jest unit tests
```

**Structure Decision**: Single web application structure selected. This is appropriate because:
1. No separate frontend/backend split needed (Next.js handles both)
2. No mobile native apps required (responsive web sufficient)
3. Monorepo simplicity aligns with Constitution Principle III (Simplicity First)
4. All components share the same TypeScript/React codebase

## Complexity Tracking

> No constitution violations detected. This section intentionally empty.
