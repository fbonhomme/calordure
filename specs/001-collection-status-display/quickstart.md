# Quickstart Guide: Waste Collection Status Display

**Feature**: 001-collection-status-display
**Date**: 2025-11-12
**Estimated Setup Time**: 15-20 minutes

## Overview

This guide walks you through setting up the local development environment and running the waste collection application. By the end, you'll have a fully functional Next.js app displaying current week collection status with a MySQL backend.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: 20.x or higher ([Download](https://nodejs.org/))
- **npm** or **pnpm**: Latest version (npm comes with Node.js)
- **MySQL**: 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git**: For version control
- **Code Editor**: VS Code recommended with Prisma extension

**Check installed versions**:
```bash
node --version  # Should show v20.x or higher
npm --version   # Should show 10.x or higher
mysql --version # Should show 8.0.x or higher
```

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd orduresMenage

# Checkout the feature branch
git checkout 001-collection-status-display
```

---

## Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm (faster)
pnpm install
```

**Expected output**:
```
added 300+ packages in 30s
```

---

## Step 3: Configure MySQL Database

### 3.1 Create Database

```bash
# Login to MySQL
mysql -u root -p

# Enter your MySQL root password when prompted
```

**In MySQL console**:
```sql
CREATE DATABASE IF NOT EXISTS collecte_poubelles
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Verify database created
SHOW DATABASES;

-- Create dedicated user (optional but recommended)
CREATE USER 'collecte_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON collecte_poubelles.* TO 'collecte_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3.2 Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Copy from example
cp .env.example .env.local

# Edit with your database credentials
nano .env.local  # or use your preferred editor
```

**.env.local contents**:
```env
# Database Connection
DATABASE_URL="mysql://collecte_user:secure_password_here@localhost:3306/collecte_poubelles"

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Timezone (do not change - required by Constitution II)
TZ=Europe/Paris
```

**Important**: Replace `collecte_user` and `secure_password_here` with your actual MySQL credentials.

---

## Step 4: Initialize Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Create database schema (without migrations)
npx prisma db push

# Verify schema created
npx prisma studio
```

**Prisma Studio** opens in browser at `http://localhost:5555`. You should see:
- `collecte_calendrier` (empty)
- `jours_feries` (empty)
- `utilisateurs` (empty)
- `notifications_log` (empty)

Close Prisma Studio when done.

---

## Step 5: Seed Database with 2025 Calendar Data

```bash
# Run seed script
npm run seed

# OR directly with tsx
npx tsx src/scripts/seed-database.ts
```

**Expected output**:
```
🌱 Début du seed de la base de données...
✅ Données existantes supprimées
📅 Insertion des jours fériés...
✅ 11 jours fériés insérés
🟡 Insertion des collectes jaunes...
✅ 24 collectes jaunes insérées
⚫ Insertion des collectes grises...
✅ 94 collectes grises insérées

📊 Statistiques:
   - Total collectes: 115
   - Collectes doubles (jaune + gris): 3
   - Jours fériés: 11

✅ Seed terminé avec succès!
```

**Verify data loaded**:
```bash
npx prisma studio
```

Navigate to `collecte_calendrier` - you should see 115 collection records.

---

## Step 6: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
▲ Next.js 15.1.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

---

## Step 7: Verify Application is Working

### 7.1 Test Home Page (P1 Feature)

Open browser to `http://localhost:3000`

**You should see**:
- ✅ Header: "🗑️ Collecte des Poubelles"
- ✅ Municipality: "Pont-sur-Yonne (Bourg)"
- ✅ Current week collection alert (yellow, grey, or "No collection this week")
- ✅ Week calendar widget showing current week dates
- ✅ Legend explaining bin types

**Mobile test**: Resize browser to 375px width - interface should remain usable without horizontal scrolling.

### 7.2 Test API Endpoints

**Current week API**:
```bash
curl http://localhost:3000/api/semaine | jq
```

**Expected response** (example for November 10-16, 2025):
```json
{
  "semaine": {
    "debut": "2025-11-10",
    "fin": "2025-11-16",
    "aujourdhui": "2025-11-12"
  },
  "collectes": [
    {
      "id": 245,
      "date": "2025-11-12T00:00:00.000Z",
      "typeCollecte": "jaune",
      "annee": 2025,
      "mois": 11,
      "jour": 12,
      "estFerie": false,
      "description": "Collecte bac jaune - Emballages et papiers"
    }
  ],
  "aCollecteJaune": true,
  "aCollecteGrise": false
}
```

**Monthly calendar API**:
```bash
curl http://localhost:3000/api/calendrier/11 | jq
```

**Expected response**: JSON array with all November 2025 collection dates.

### 7.3 Test Monthly Calendar Page (P2 Feature)

Navigate to `http://localhost:3000/calendrier`

**You should see**:
- ✅ Full monthly calendar grid
- ✅ Collection dates highlighted with color coding
- ✅ Yellow bin emoji (🟡) and grey bin emoji (⚫) on collection days
- ✅ Public holidays indicated if present

---

## Step 8: Run Development Checks

### 8.1 TypeScript Check
```bash
npm run type-check
```

**Expected**: No errors (all types valid).

### 8.2 Linting
```bash
npm run lint
```

**Expected**: No errors or warnings.

### 8.3 Build Verification
```bash
npm run build
```

**Expected output**:
```
▲ Next.js 15.1.0

✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (3/3)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    1.5 kB         100 kB
├ ○ /calendrier                          2.1 kB         101 kB
└ ○ /api/semaine                         0 kB           85 kB
```

---

## Troubleshooting

### Issue: "Cannot connect to MySQL"

**Error message**:
```
Error: P1001: Can't reach database server at `localhost:3306`
```

**Solution**:
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS
net start MySQL  # Windows

# Test connection
mysql -u collecte_user -p -h localhost
```

### Issue: "Prisma schema is out of sync"

**Error message**:
```
Error: Prisma schema is out of sync with database
```

**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push
```

### Issue: "PORT 3000 already in use"

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process OR use different port
PORT=3001 npm run dev
```

### Issue: "No collection data displayed"

**Symptoms**: Home page loads but shows "No collection this week" even when there should be collections.

**Solution**:
```bash
# Verify database has data
npx prisma studio
# Check collecte_calendrier table has records

# Re-run seed if empty
npm run seed

# Check current date is within 2025
date  # Should show 2025 (if testing in development)
```

### Issue: "Week calculation incorrect (shows wrong week)"

**Symptoms**: Week dates don't start on Monday.

**Solution**:
```typescript
// Verify date-fns usage in src/lib/dateUtils.ts
import { startOfWeek } from 'date-fns';

// MUST include weekStartsOn: 1 (Monday)
const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
```

---

## Next Steps

1. **Phase 2: Implement Tasks** - Run `/speckit.tasks` to generate implementation task list
2. **UI Customization** - Modify `src/components/AlerteCollecte.tsx` for custom styling
3. **Add Collection Data** - Update `src/lib/collecteData.ts` for 2026 calendar (future)
4. **Deploy to Vercel** - See deployment instructions below

---

## Optional: Deploy to Vercel

### Prerequisites
- Vercel account ([Sign up free](https://vercel.com/signup))
- GitHub repository pushed

### Steps

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configure environment variables in Vercel dashboard**:
- `DATABASE_URL`: Use PlanetScale or MySQL hosting service
- `TZ`: `Europe/Paris`

**Expected result**: Application live at `https://your-project.vercel.app`

---

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run lint                   # Run ESLint
npm run type-check             # TypeScript validation

# Database
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create migration (if needed)
npx prisma db push             # Push schema without migration
npm run seed                   # Re-seed database

# Build & Deploy
npm run build                  # Production build
npm start                      # Start production server
vercel --prod                  # Deploy to Vercel
```

---

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (React UI)     │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Next.js App   │
│   Router        │
├─────────────────┤
│ • /             │ (Home page - SSR)
│ • /calendrier   │ (Calendar - ISR)
│ • /api/semaine  │ (Week API)
│ • /api/calendrier│ (Month API)
└────────┬────────┘
         │
         │ Prisma Queries
         ▼
┌─────────────────┐
│   MySQL DB      │
├─────────────────┤
│ • collecte_     │
│   calendrier    │ (115 records)
│ • jours_feries  │ (11 records)
└─────────────────┘
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home page (P1: Current week status) |
| `src/app/calendrier/page.tsx` | Monthly calendar (P2) |
| `src/app/api/semaine/route.ts` | Current week API endpoint |
| `src/app/api/calendrier/[mois]/route.ts` | Monthly calendar API |
| `src/lib/dateUtils.ts` | Date manipulation utilities |
| `src/lib/db-operations.ts` | Database query functions |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/collecteData.ts` | Raw 2025 calendar data |
| `prisma/schema.prisma` | Database schema definition |

---

## Support

- **Constitution**: See `.specify/memory/constitution.md` for architectural principles
- **Feature Spec**: See `specs/001-collection-status-display/spec.md`
- **Data Model**: See `specs/001-collection-status-display/data-model.md`
- **API Contracts**: See `specs/001-collection-status-display/contracts/`

**Questions?** Contact municipality technical support or refer to Next.js documentation at https://nextjs.org/docs
