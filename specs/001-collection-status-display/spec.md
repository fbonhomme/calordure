# Feature Specification: Weekly Waste Collection Status Display

**Feature Branch**: `001-collection-status-display`
**Created**: 2025-11-12
**Status**: Draft
**Input**: Weekly waste collection calendar display and status notification system for Pont-sur-Yonne residents

## Clarifications

### Session 2025-11-12

- Q: When the database is unavailable (maintenance, network issue, or failure), what should residents see? → A: Display last successfully cached collection data with prominent banner: "Data may not be current - last updated [timestamp]"
- Q: How long should historical collection data be retained in the database? → A: Retain previous year's data for 3 months into new year (allows residents to reference past schedules during transition while keeping database manageable)
- Q: What are the expected uptime and availability requirements for the service? → A: Best-effort availability with planned maintenance windows communicated 48 hours in advance (appropriate for municipal information service without expensive 24/7 SLA)
- Q: What is the valid range for calendar navigation (months/years)? → A: Current year only (2025), with graceful message for past/future years (keeps scope focused on active collection year)
- Q: What critical events should be logged for municipal monitoring and debugging? → A: Database errors, invalid date requests, high traffic spikes, data seed operations (covers operational health, debugging, capacity planning without excessive overhead)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Check Current Week Collection Status (Priority: P1)

Citizens of Pont-sur-Yonne need to quickly determine which waste bins (yellow for recyclables/paper or grey for general waste) must be taken out during the current week.

**Why this priority**: This is the core value proposition - preventing missed collections and ensuring proper waste management compliance. Without this, the application has no purpose.

**Independent Test**: Can be fully tested by navigating to the home page on any day of the week and verifying that the correct collection information is displayed based on the official 2025 calendar data.

**Acceptance Scenarios**:

1. **Given** it is Monday of a week with yellow bin collection on Wednesday, **When** a resident views the home page, **Then** they see a clear alert indicating "Yellow bin collection this week" with the specific collection date
2. **Given** it is any day during a week with both yellow and grey bin collections, **When** a resident views the home page, **Then** they see an alert indicating both bin types are required with their respective collection dates
3. **Given** it is any day during a week with no scheduled collections, **When** a resident views the home page, **Then** they see a reassuring message stating "No collection this week"
4. **Given** today is a collection day, **When** a resident views the home page, **Then** the current day's collection is visually highlighted with a "Today" indicator
5. **Given** a resident is using a mobile phone, **When** they view the home page, **Then** the interface is fully readable and usable without horizontal scrolling

---

### User Story 2 - View Monthly Collection Calendar (Priority: P2)

Citizens want to see all upcoming collection dates for the entire month to plan ahead for vacations, events, or schedule conflicts.

**Why this priority**: Provides extended planning capability beyond the current week, helping residents prepare for upcoming collections when they may be away or need to arrange alternatives.

**Independent Test**: Can be tested by navigating to the calendar view, selecting different months, and verifying all collection dates are displayed correctly with proper color coding and type indicators.

**Acceptance Scenarios**:

1. **Given** a resident is viewing the home page, **When** they click/tap on "View full calendar", **Then** they are shown a monthly calendar view with all collection dates clearly marked
2. **Given** a resident is viewing a monthly calendar, **When** they select a different month, **Then** all collection dates for that month are displayed with appropriate color coding (yellow for yellow bin, grey for grey bin, both colors for dual collection days)
3. **Given** a public holiday falls on a collection day, **When** a resident views the calendar, **Then** the holiday is clearly indicated with the official collection status
4. **Given** multiple collections occur in one week, **When** a resident views the monthly calendar, **Then** each collection date is individually visible without overlap or confusion

---

### User Story 3 - Understand Collection Types (Priority: P3)

Residents, especially new to the area or the new 2025 rules, need clear information about what goes in each bin type.

**Why this priority**: Educational value prevents contamination of recycling streams and ensures compliance with the 2025 change (newspapers/paper now go in yellow bin).

**Independent Test**: Can be tested by viewing the legend/information section and verifying all bin types, their contents, and the 2025 rule change are clearly explained.

**Acceptance Scenarios**:

1. **Given** a resident views any page with collection information, **When** they scroll to the legend section, **Then** they see clear descriptions of yellow bin (recyclables + newspapers/paper) and grey bin (general waste) with visual indicators
2. **Given** the year is 2025, **When** a resident views collection information, **Then** they see a prominent reminder that "newspapers and paper now go in the yellow bin starting January 1, 2025"
3. **Given** a resident is unfamiliar with bin colors, **When** they view the legend, **Then** visual symbols (emojis or icons) supplement text descriptions for quick recognition

---

### Edge Cases

- What happens when a collection date falls on a public holiday? (Display holiday name and indicate whether collection is maintained or rescheduled)
- How does the system handle week boundaries when viewed on Sunday evening vs Monday morning? (Ensure week calculation uses Monday as start day per ISO 8601 French standard)
- What if a resident accesses the site in a different timezone? (All dates must display in Europe/Paris timezone regardless of user location)
- How are dual collection days (both yellow and grey on the same day) displayed? (Both bin indicators shown together with "both" label)
- What happens when the calendar data is missing for a requested month? (Display appropriate message indicating data unavailable for that period)
- What happens when the database is unavailable? (Display last successfully cached collection data with prominent banner stating "Data may not be current - last updated [timestamp]" to maintain service availability while being transparent about data freshness)
- What happens when a resident attempts to view a past year (e.g., 2024) or future year (e.g., 2026) calendar? (Display message: "Collection calendar is only available for 2025. For past or future schedules, please contact the municipality.")

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the current week's waste collection schedule on the home page
- **FR-002**: System MUST clearly indicate which bin types (yellow, grey, or both) require collection during the current week
- **FR-003**: System MUST show the specific day(s) of the week when each collection occurs
- **FR-004**: System MUST visually distinguish between yellow bin collections, grey bin collections, and dual collection days using color coding
- **FR-005**: System MUST highlight the current day when it is a collection day
- **FR-006**: System MUST provide a full monthly calendar view showing all collection dates
- **FR-007**: System MUST allow residents to view collection calendars for different months within the current year (2025 only), displaying graceful message for past/future year requests
- **FR-008**: System MUST display public holiday information when holidays fall on collection days
- **FR-009**: System MUST show which municipality sector the information applies to (Pont-sur-Yonne - Bourg)
- **FR-010**: System MUST display a legend explaining bin types and their contents
- **FR-011**: System MUST prominently display the 2025 rule change: "Newspapers and paper now go in the yellow bin"
- **FR-012**: System MUST be fully responsive and usable on mobile devices (smartphones and tablets)
- **FR-013**: System MUST calculate the current week using Monday as the first day of the week (ISO 8601)
- **FR-014**: System MUST use Europe/Paris timezone for all date displays and calculations
- **FR-015**: System MUST retrieve collection dates from a database, not hardcoded values
- **FR-016**: System MUST load the initial page view in under 2 seconds on standard mobile connections
- **FR-017**: System MUST cache collection data locally and display cached data with timestamp banner when database is unavailable

### Key Entities

- **Collection Date**: Represents a specific day when waste collection occurs
  - Date (the specific day)
  - Collection Type (yellow bin, grey bin, or both)
  - Year, Month, Day (for efficient querying)
  - Public Holiday flag
  - Description (optional explanatory text)
  - Retention: Previous year's data retained for 3 months into new year for reference during transition

- **Public Holiday**: Represents official French public holidays that may affect collection schedules
  - Date (the holiday date)
  - Name (holiday name in French)
  - Year (for year-specific holiday tracking)

- **Municipality Information**: Static reference data about the service area
  - Municipality name (Pont-sur-Yonne)
  - Sector (Bourg)
  - Governing body (Communauté de Communes Yonne Nord)
  - Service year (2025)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Residents can determine if bins need to be taken out within 3 seconds of opening the home page
- **SC-002**: The application displays correct collection information matching the official 2025 municipal calendar with 100% accuracy
- **SC-003**: The home page loads and displays collection status in under 2 seconds on 4G mobile connections
- **SC-004**: 95% of residents successfully identify which bins to take out on their first visit without additional help or clarification
- **SC-005**: The interface remains fully functional and readable on devices with screen widths from 320px (small phones) to 2560px (large desktops)
- **SC-006**: Week boundary calculations are correct 100% of the time when accessed at any time of day or day of week
- **SC-007**: Collection dates display correctly for all users regardless of their device's timezone settings
- **SC-008**: Residents can view any month's collection calendar within 2 clicks/taps from the home page
- **SC-009**: The application correctly handles all 11 French public holidays in 2025 that may affect collection schedules
- **SC-010**: Mobile users can read all text content without horizontal scrolling or zooming on standard smartphone screens (375px width minimum)

## Assumptions

- Residents have internet access via mobile devices or computers to access the web application
- The official 2025 waste collection calendar for Pont-sur-Yonne (Bourg) is accurate and complete
- Collection schedules follow a consistent pattern: yellow bins every other Wednesday, grey bins on Wednesdays and Saturdays
- Public holidays may affect collection schedules, and the municipality provides this information
- The target audience reads French (all content in French language)
- Standard web browser compatibility: modern versions of Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile devices include iOS and Android smartphones and tablets with standard screen sizes
- No user authentication is required - this is public municipal information
- Collection schedules are set annually and require updates only once per year
- The municipality has a MySQL database available for storing collection schedule data
- Historical data retention: Previous year's collection data retained for 3 months into the new year (e.g., 2024 data available until March 31, 2025)

## Non-Functional Requirements

### Availability & Reliability

- **NFR-001**: System operates on best-effort availability model (no guaranteed uptime SLA)
- **NFR-002**: Planned maintenance windows MUST be communicated to residents 48 hours in advance
- **NFR-003**: During unplanned outages, cached data ensures continued access to collection information
- **NFR-004**: System degrades gracefully when database unavailable (displays cached data with staleness warning)

### Observability & Monitoring

- **NFR-005**: System MUST log database connection errors with timestamp and error details
- **NFR-006**: System MUST log invalid date requests (out-of-range months/years) for debugging
- **NFR-007**: System MUST track high traffic spikes (>100 requests/minute) for capacity planning
- **NFR-008**: System MUST log data seed operations (initial load and annual updates) with success/failure status
