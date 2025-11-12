<!--
Sync Impact Report:
Version change: Initial → 1.0.0
Modified principles: N/A (initial constitution)
Added sections: All core principles, Data Integrity, User Experience, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Reviewed and aligned
  ✅ spec-template.md - Reviewed and aligned
  ✅ tasks-template.md - Reviewed and aligned
Follow-up TODOs: None - all placeholders filled
-->

# Gestionnaire de Collecte des Poubelles - Constitution

## Core Principles

### I. Data-Driven Accuracy

**The application MUST provide 100% accurate waste collection information based on the official 2025 calendar for Pont-sur-Yonne (Bourg).**

- All collection dates (yellow and grey bins) MUST be stored in MySQL database with referential integrity
- Changes to collection schedules MUST be reflected through database updates, not code changes
- Public holidays MUST be tracked separately and their impact on collection schedules clearly indicated
- The system MUST display the current week's collection requirements as the primary interface

**Rationale**: Citizens depend on this information for civic compliance. Incorrect data leads to missed collections or improper bin placement, affecting community hygiene and municipal operations.

### II. Timezone Consistency

**All date/time operations MUST use Europe/Paris timezone exclusively.**

- Database dates MUST be stored in DATE type (not DATETIME) to avoid timezone ambiguity
- Server-side date calculations MUST explicitly use Europe/Paris timezone
- Week boundaries MUST start on Monday (ISO 8601) to match French conventions
- Date formatting MUST use French locale (date-fns/locale/fr)

**Rationale**: The application serves a French municipality where local time is critical for collection schedules. Timezone errors could cause incorrect week calculations, showing the wrong collection information.

### III. Performance & Simplicity First

**The application MUST prioritize simplicity and performance appropriate for a single-municipality service.**

- Next.js App Router for server-side rendering of weekly collection status
- MySQL with Prisma ORM for straightforward relational data management
- No authentication required for public collection information viewing
- Static generation where possible, ISR (Incremental Static Regeneration) for dynamic dates
- Avoid unnecessary abstractions: direct Prisma queries over repository patterns

**Rationale**: This is a focused municipal service, not an enterprise platform. Over-engineering reduces maintainability and increases hosting costs for a small-scale application.

### IV. Mobile-First Responsive Design

**The interface MUST be optimized for mobile devices as the primary access method.**

- Tailwind CSS for responsive utility-first styling
- Touch-friendly interface elements (minimum 44px tap targets)
- Clear visual indicators using emojis and color coding (🟡 yellow bin, ⚫ grey bin)
- Readable typography with proper contrast ratios
- Progressive enhancement: core information accessible without JavaScript

**Rationale**: Citizens will check collection status on-the-go, often on mobile devices before taking bins outside. The interface must be instantly clear on small screens.

### V. Database as Single Source of Truth

**All collection schedule data MUST reside in MySQL; the application code MUST NOT contain hardcoded dates.**

- Initial data loaded via seed script from `collecteData.ts`
- Future year updates require only database seeding, not code deployment
- Collection queries MUST use indexed date ranges for performance
- Database schema MUST support year-over-year data retention

**Rationale**: Separating data from code enables non-technical municipal staff to update schedules annually without developer intervention.

### VI. Progressive Enhancement & Future Readiness

**The architecture MUST support optional future features without breaking existing functionality.**

- Database schema includes optional user notification tables (prepared but not implemented)
- Clean separation between core display logic and potential notification services
- API routes designed to support both public access and future authenticated features
- Extensible to support multiple municipalities with minimal schema changes

**Rationale**: While the MVP is a simple display application, future requirements may include notifications, multiple locations, or administrative interfaces. The foundation must accommodate growth without requiring architectural rewrites.

## Data Integrity

### Collection Calendar Requirements

- Each collection date MUST have a unique DATE constraint in the database
- Collection type MUST be one of: 'jaune' (yellow), 'gris' (grey), or 'both'
- Seed script MUST detect overlapping dates and merge them into 'both' type
- Year, month, and day columns MUST be denormalized for efficient querying
- Public holidays MUST be flagged in the `est_ferie` column

### Date Validation Rules

- All dates MUST fall within the year 2025 (expandable to future years)
- Week calculations MUST use ISO 8601 week boundaries (Monday-Sunday)
- API responses MUST include the week start, end, and current date
- Date comparisons MUST use `startOfDay()` to avoid time component issues

## User Experience

### Primary Interface Requirements

**The home page MUST answer one question: "Do I need to take out the bins this week?"**

- **Visual hierarchy**: Collection alert → Weekly calendar widget → Legend → Full calendar link
- **Color coding**: Green (no collection), Yellow (yellow bin only), Grey (grey bin only), Orange (both bins)
- **Explicit messaging**: Clear headings stating which bins are required, not just dates
- **Today highlighting**: Current day MUST be visually distinct in all date lists
- **Educational content**: Remind users that newspapers/paper now go in yellow bin (2025 change)

### Performance Standards

- Initial page load MUST render collection status in under 2 seconds (LCP target)
- Database queries MUST use indexed lookups (date, year+month indexes defined)
- API routes MUST use `force-dynamic` for real-time accuracy or appropriate caching strategy
- No unnecessary client-side JavaScript for core functionality

## Governance

### Constitution Authority

This constitution defines the non-negotiable architectural and data integrity principles for the waste collection management application. All code changes, features, and refactorings MUST align with these principles.

### Amendment Process

1. Proposed changes MUST be documented with rationale
2. Impact assessment required for all dependent components (database schema, API contracts, UI components)
3. Version incremented according to semantic versioning
4. Migration plan required for any database schema changes

### Compliance Verification

- All pull requests MUST verify alignment with Data-Driven Accuracy principle (dates match official calendar)
- Database migrations MUST preserve historical collection data
- API contract changes MUST maintain backward compatibility or version appropriately
- User interface changes MUST maintain mobile-first responsive design

### Development Guidance

When implementing features, developers should:

1. **Always verify date handling** uses Europe/Paris timezone
2. **Prefer database queries** over in-memory date calculations
3. **Test week boundary logic** with dates spanning Monday-Sunday transitions
4. **Validate mobile responsiveness** on actual devices, not just browser DevTools
5. **Document any deviations** from Simplicity First principle with justification

**Version**: 1.0.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12
