# Tasks: Weekly Waste Collection Status Display

**Input**: Design documents from `/specs/001-collection-status-display/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the feature specification, so test tasks are OMITTED from this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `prisma/` at repository root
- Paths shown below use absolute repository root references

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js project with TypeScript and App Router using `npx create-next-app@latest orduresMenage --typescript --tailwind --app`
- [ ] T002 [P] Initialize Git repository with .gitignore for Next.js, Node.js, and .env files
- [ ] T003 [P] Create environment configuration file at `.env.local` with DATABASE_URL, NODE_ENV, TZ=Europe/Paris
- [ ] T004 [P] Install Prisma dependencies: `npm install @prisma/client && npm install -D prisma tsx`
- [ ] T005 [P] Install date-fns with French locale: `npm install date-fns`
- [ ] T006 Initialize Prisma with MySQL provider: `npx prisma init --datasource-provider mysql`
- [ ] T007 [P] Create project directory structure: src/app/, src/components/, src/lib/, src/types/, src/scripts/, public/icons/
- [ ] T008 [P] Configure Tailwind with custom colors in `tailwind.config.ts` (yellow-bin: #FFC107, grey-bin: #757575, alert colors)
- [ ] T009 [P] Create TypeScript configuration in `tsconfig.json` with strict mode and path aliases (@/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Define Prisma schema for CollecteCalendrier model in `prisma/schema.prisma` with fields: id, date (unique), typeCollecte, annee, mois, jour, estFerie, description
- [ ] T011 [P] Define Prisma schema for JoursFeries model in `prisma/schema.prisma` with fields: id, date (unique), nom, annee
- [ ] T012 [P] Define Prisma schema for Utilisateur model (future-ready) in `prisma/schema.prisma` with fields: id, email, telephone, notifEmail, notifSms, timezone
- [ ] T013 [P] Define Prisma schema for NotificationLog model (future-ready) in `prisma/schema.prisma` with FK to Utilisateur
- [ ] T014 Add composite indexes to Prisma schema: @@index([date]), @@index([annee, mois]), @@index([typeCollecte])
- [ ] T015 Run Prisma migration to create database schema: `npx prisma migrate dev --name init`
- [ ] T016 Generate Prisma client: `npx prisma generate`
- [ ] T017 Create Prisma client singleton in `src/lib/prisma.ts` with global variable pattern for development
- [ ] T018 [P] Create TypeScript types in `src/types/collecte.ts`: TypeCollecte, Collecte, JourFerie, InfoSemaine, InfoMois
- [ ] T019 [P] Create raw 2025 calendar data in `src/lib/collecteData.ts` with collectes2025 export (jaune, gris, feries arrays)
- [ ] T020 Create date utilities in `src/lib/dateUtils.ts`: getSemaineEnCours(), getCollectesDansPeriode(), formaterDate(), estAujourdhui() with French locale
- [ ] T021 [P] Create database operations in `src/lib/db-operations.ts`: getCollectesSemaine(), getCollectesMois(), getCollecteParDate(), getJoursFeries(), getProchainCollecte()
- [ ] T022 Create database seed script in `prisma/seed.ts` that reads collecteData.ts and populates database with upsert logic for holidays and collections
- [ ] T023 Add seed command to package.json: `"seed": "tsx prisma/seed.ts"`
- [ ] T024 Run seed script to populate database: `npm run seed`
- [ ] T025 [P] Create reusable UI components in `src/components/ui/`: Card.tsx, Badge.tsx, Button.tsx with Tailwind styling

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Check Current Week Collection Status (Priority: P1) 🎯 MVP

**Goal**: Display current week collection status on home page with clear bin type indicators

**Independent Test**: Navigate to `http://localhost:3000` and verify correct collection alert for current week based on database data

### Implementation for User Story 1

- [ ] T026 [P] [US1] Create AlerteCollecte component in `src/components/AlerteCollecte.tsx` that accepts aCollecteJaune, aCollecteGrise, collectes props and displays color-coded alert
- [ ] T027 [P] [US1] Create CalendrierWidget component in `src/components/CalendrierWidget.tsx` that displays current week dates (Monday-Sunday) with today highlighting
- [ ] T028 [P] [US1] Create JourCollecte component in `src/components/JourCollecte.tsx` to render individual collection day with emoji indicators (🟡/⚫)
- [ ] T029 [US1] Create API route handler in `src/app/api/semaine/route.ts` with GET method that calls getSemaineEnCours() and getCollectesSemaine()
- [ ] T030 [US1] Add `export const dynamic = 'force-dynamic'` to `src/app/api/semaine/route.ts` to prevent caching
- [ ] T031 [US1] Implement response logic in `src/app/api/semaine/route.ts` to return JSON with semaine, collectes, aCollecteJaune, aCollecteGrise fields
- [ ] T032 [US1] Add error handling in `src/app/api/semaine/route.ts` for database failures with 500 status and French error message
- [ ] T033 [US1] Create home page in `src/app/page.tsx` as async Server Component that fetches from /api/semaine
- [ ] T034 [US1] Render AlerteCollecte component in `src/app/page.tsx` with fetched data
- [ ] T035 [US1] Render CalendrierWidget component in `src/app/page.tsx` with current week dates
- [ ] T036 [US1] Add page header in `src/app/page.tsx` with "🗑️ Collecte des Poubelles" title and "Pont-sur-Yonne (Bourg)" subtitle
- [ ] T037 [US1] Add footer in `src/app/page.tsx` with municipality information (Communauté de Communes Yonne Nord)
- [ ] T038 [US1] Configure root layout in `src/app/layout.tsx` with French lang attribute, metadata, and Tailwind globals.css import
- [ ] T039 [US1] Add mobile-responsive styling to home page with Tailwind classes (min-w-[320px], gradient background)
- [ ] T040 [US1] Test AlerteCollecte displays correct message for week with yellow bin only (mock date to week of 2025-01-08)
- [ ] T041 [US1] Test AlerteCollecte displays correct message for week with grey bin only (mock date to week of 2025-01-04)
- [ ] T042 [US1] Test AlerteCollecte displays correct message for week with both bins (mock date to week of 2025-01-01)
- [ ] T043 [US1] Test AlerteCollecte displays "No collection this week" for empty week (mock date to week with no collections)
- [ ] T044 [US1] Test today highlighting works correctly when current date matches collection date

**Checkpoint**: At this point, User Story 1 should be fully functional - home page displays current week collection status accurately

---

## Phase 4: User Story 2 - View Monthly Collection Calendar (Priority: P2)

**Goal**: Provide full monthly calendar view with all collection dates and holidays

**Independent Test**: Navigate to `/calendrier` page and verify all collection dates for current month are displayed with correct color coding

### Implementation for User Story 2

- [ ] T045 [P] [US2] Create CalendrierMensuel component in `src/components/CalendrierMensuel.tsx` that accepts annee, mois, collectes, joursFeries props
- [ ] T046 [US2] Implement calendar grid logic in CalendrierMensuel using date-fns `eachDayOfInterval()` and `startOfMonth()/endOfMonth()`
- [ ] T047 [US2] Add color coding to CalendrierMensuel: yellow background for yellow bin days, grey for grey bin, orange for both
- [ ] T048 [US2] Add emoji indicators (🟡/⚫) to collection dates in CalendrierMensuel grid cells
- [ ] T049 [US2] Add holiday highlighting in CalendrierMensuel with holiday name tooltip/label
- [ ] T050 [US2] Create API route handler in `src/app/api/calendrier/[mois]/route.ts` with GET method accepting mois path parameter
- [ ] T051 [US2] Add month validation (1-12) in `src/app/api/calendrier/[mois]/route.ts` with 400 error for invalid values
- [ ] T052 [US2] Add year validation (2025 only) in `src/app/api/calendrier/[mois]/route.ts` with 400 error and French message for out-of-range years
- [ ] T053 [US2] Call getCollectesMois() and getJoursFeries() in `src/app/api/calendrier/[mois]/route.ts` and return JSON response
- [ ] T054 [US2] Add ISR caching to API route with `export const revalidate = 3600` in `src/app/api/calendrier/[mois]/route.ts`
- [ ] T055 [US2] Create calendar page in `src/app/calendrier/page.tsx` as async Server Component
- [ ] T056 [US2] Fetch current month data in `src/app/calendrier/page.tsx` using getCurrentMonth() helper
- [ ] T057 [US2] Render CalendrierMensuel component in `src/app/calendrier/page.tsx` with fetched data
- [ ] T058 [US2] Add month selector UI in `src/app/calendrier/page.tsx` (dropdown or buttons for Jan-Dec navigation)
- [ ] T059 [US2] Implement month navigation logic using Next.js searchParams or client-side state
- [ ] T060 [US2] Add "Return to home" link in `src/app/calendrier/page.tsx` that navigates to /
- [ ] T061 [US2] Add "View full calendar" link in `src/app/page.tsx` (User Story 1) that navigates to /calendrier
- [ ] T062 [US2] Style calendar page with responsive grid layout (adapts from mobile 1-column to desktop 7-column week grid)
- [ ] T063 [US2] Test calendar displays all November 2025 collection dates correctly (compare against collecteData.ts)
- [ ] T064 [US2] Test calendar displays January 2025 with Jour de l'an holiday correctly
- [ ] T065 [US2] Test calendar handles invalid month (13) with graceful error message
- [ ] T066 [US2] Test calendar handles invalid year (2024/2026) with message directing to contact municipality

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full calendar navigation available

---

## Phase 5: User Story 3 - Understand Collection Types (Priority: P3)

**Goal**: Display clear legend and educational information about bin types and 2025 rule changes

**Independent Test**: View home page and calendar page - verify legend is visible with bin descriptions and 2025 newspaper rule reminder

### Implementation for User Story 3

- [ ] T067 [P] [US3] Create legend section in `src/app/page.tsx` below CalendrierWidget with "📝 Légende" heading
- [ ] T068 [P] [US3] Add yellow bin description in legend: "🟡 Bac jaune - Emballages + Journaux/Papiers"
- [ ] T069 [P] [US3] Add grey bin description in legend: "⚫ Bac gris - Ordures ménagères"
- [ ] T070 [P] [US3] Add prominent 2025 rule change reminder: "💡 Rappel: Depuis le 1er janvier 2025, les journaux et papiers vont dans le bac jaune !"
- [ ] T071 [US3] Style legend with Card component using white background, rounded corners, and shadow
- [ ] T072 [US3] Use grid layout for legend items (2-column on desktop, 1-column on mobile)
- [ ] T073 [US3] Ensure legend text is readable with sufficient color contrast (WCAG AA minimum)
- [ ] T074 [US3] Add legend to calendar page in `src/app/calendrier/page.tsx` (same content as home page)
- [ ] T075 [US3] Test legend displays correctly on 320px mobile screen without horizontal scroll
- [ ] T076 [US3] Test legend emojis render correctly on iOS Safari, Android Chrome, Windows Edge
- [ ] T077 [US3] Test 2025 rule change message is prominently visible (not buried below fold)

**Checkpoint**: All user stories should now be independently functional - MVP is feature-complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T078 [P] Add database error logging in `src/lib/db-operations.ts` with console.error() and timestamp
- [ ] T079 [P] Add invalid date request logging in API routes with context (requested month/year)
- [ ] T080 [P] Add traffic spike logging (optional): instrument API routes with request counter (>100 req/min threshold)
- [ ] T081 [P] Create custom error page in `src/app/error.tsx` with French error message and "Réessayer" button
- [ ] T082 [P] Create custom 404 page in `src/app/not-found.tsx` with navigation back to home
- [ ] T083 [P] Add loading states to calendar month selector (Suspense boundary with loading spinner)
- [ ] T084 [P] Optimize Prisma queries with React Cache API: wrap db queries in `cache()` function from 'react'
- [ ] T085 [P] Add Next.js metadata in layout.tsx: title, description, Open Graph tags for social sharing
- [ ] T086 [P] Create favicon and Apple touch icons in `public/` directory
- [ ] T087 [P] Add SVG icons for bins in `public/icons/`: poubelle-jaune.svg, poubelle-grise.svg
- [ ] T088 [P] Test page load performance with Lighthouse (target: LCP < 2s, mobile score > 90)
- [ ] T089 [P] Implement localStorage-based cache fallback in `src/app/api/semaine/route.ts` and `src/app/page.tsx` that stores last successful API response and displays cached data with banner "Données potentiellement obsolètes - Dernière mise à jour : [dd/MM/yyyy à HH:mm]" when database fetch fails (implements FR-017)
- [ ] T090 [P] Test database unavailability scenario (stop MySQL) - verify graceful error handling and cache banner display
- [ ] T091 [P] Test week boundary edge case: access home page on Sunday 23:59 and Monday 00:01 - verify correct week calculation
- [ ] T092 [P] Test timezone consistency: set browser to different timezone (America/New_York) - verify dates display in Europe/Paris
- [ ] T093 [P] Validate mobile responsiveness on actual devices (iPhone SE 375px, Android tablet 768px, desktop 1920px)
- [ ] T094 [P] Run Next.js build: `npm run build` - verify no build errors and check bundle size
- [ ] T095 [P] Run TypeScript type check: `npx tsc --noEmit` - verify no type errors
- [ ] T096 [P] Run ESLint: `npm run lint` - verify no linting errors
- [ ] T097 [P] Create README.md with project overview, setup instructions, and deployment guide (include best-effort availability statement: "Target 99% monthly uptime with 48hr maintenance notice")
- [ ] T098 [P] Document environment variables required in `.env.example` file
- [ ] T099 [P] Add package.json scripts: "type-check", "build", "start" (production)
- [ ] T100 [P] Configure Next.js production settings in `next.config.ts`: output: 'standalone' for Docker deployment
- [ ] T101 [P] Test production build locally: `npm run build && npm start` - verify app works correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 via shared layout/navigation but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds legend to existing pages from US1/US2 but independently testable

### Within Each User Story

- Models/Types defined in Foundational phase (no per-story model creation)
- Components before pages (T026-T028 before T033-T039 for US1)
- API routes before page consumption (T029-T032 before T033 for US1)
- Core implementation before integration (T045-T049 before T055-T062 for US2)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004, T005, T007, T008, T009)
- All Foundational tasks marked [P] can run in parallel (T011, T012, T013, T018, T019, T021, T025)
- Once Foundational phase completes, US1, US2, US3 implementation can start in parallel if team capacity allows
- Within US1: T026, T027, T028 can run in parallel (different component files)
- Within US2: T045 creation can start while US1 is ongoing (no dependencies on US1 completion)
- All Polish tasks marked [P] can run in parallel (T078-T100)

---

## Parallel Example: User Story 1

```bash
# Launch all component creation for User Story 1 together:
Task T026: Create AlerteCollecte component in src/components/AlerteCollecte.tsx
Task T027: Create CalendrierWidget component in src/components/CalendrierWidget.tsx
Task T028: Create JourCollecte component in src/components/JourCollecte.tsx

# These can be developed simultaneously by different developers or AI agents
# because they operate on different files with no shared dependencies
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational (T010-T025) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T026-T044)
4. **STOP and VALIDATE**: Test home page displays current week collection status correctly
5. Deploy MVP and gather user feedback

**MVP Delivery**: ~44 tasks for functional home page with current week status

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T025)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - T026-T044)
3. Add User Story 2 → Test independently → Deploy/Demo (T045-T066)
4. Add User Story 3 → Test independently → Deploy/Demo (T067-T077)
5. Polish → Production-ready (T078-T100)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T025)
2. Once Foundational is done:
   - Developer A: User Story 1 components (T026-T028), then API (T029-T032), then pages (T033-T044)
   - Developer B: User Story 2 components (T045-T049), then API (T050-T054), then pages (T055-T066)
   - Developer C: User Story 3 legend additions (T067-T077) after US1/US2 pages exist
3. Team converges on Polish tasks (T078-T100) in parallel

---

## Notes

- [P] tasks = different files, no dependencies (safe for parallel execution)
- [Story] label maps task to specific user story for traceability and independent delivery
- Each user story should be independently completable and testable (validated in checkpoints)
- Commit after each task or logical group (T001-T009 as one commit, T010-T016 as another, etc.)
- Stop at any checkpoint to validate story independently before proceeding
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- File paths are absolute from repository root for clarity
- Total tasks: 101 (Setup: 9, Foundational: 16, US1: 19, US2: 22, US3: 11, Polish: 24)
