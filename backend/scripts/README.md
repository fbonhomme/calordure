# Scripts de mise à jour des données

## Import des données 2026

Les données de collecte 2026 pour Pont-sur-Yonne (Bourg) ont été extraites du calendrier officiel.

### Option 1: Exécution via TypeScript (Local avec accès DB)

Si vous avez accès à la base de données depuis votre machine locale:

```bash
cd backend
npm run seed:2026
```

### Option 2: Exécution du script SQL sur Azure

1. Connectez-vous au portail Azure
2. Accédez à votre base de données MySQL `gestordure`
3. Ouvrez "Query editor" ou utilisez Azure Cloud Shell
4. Copiez et exécutez le contenu de `seed-2026.sql`

### Option 3: Via Azure CLI

```bash
az mysql flexible-server execute \
  --name gestordure \
  --admin-user admingest \
  --admin-password 'CiTy2025!!' \
  --database-name ordures_menage \
  --file-path backend/scripts/seed-2026.sql
```

### Option 4: Via MySQL Workbench ou autre client

1. Configurez une connexion à:
   - Host: `lgestordure.mysql.database.azure.com`
   - Port: `3306`
   - Database: `ordures_menage`
   - Username: `admingest`
   - Password: `CiTy2025!!`
2. Ouvrez et exécutez `seed-2026.sql`

## Données importées

- **157 dates de collecte** pour l'année 2026:
  - Bac jaune (mercredi): ~52 collectes
  - Bac gris (samedi): ~52 collectes
- **11 jours fériés** français

## Vérification

Après l'import, vous pouvez vérifier avec ces requêtes:

```sql
-- Nombre de collectes par type
SELECT typeCollecte, COUNT(*) as nombre
FROM collecte_calendrier
WHERE annee = 2026
GROUP BY typeCollecte;

-- Liste des jours fériés 2026
SELECT date, nom
FROM jours_feries
WHERE annee = 2026
ORDER BY date;
```
