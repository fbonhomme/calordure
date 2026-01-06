import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Charger les variables d'environnement
config();

const prisma = new PrismaClient();

// Dates extraites du calendrier 2026 pour Pont-sur-Yonne (Bourg)
const collectes2026 = [
  // JANVIER 2026
  // Bac jaune (mercredi): 7, 14, 21, 28
  { date: '2026-01-07', type: 'jaune' },
  { date: '2026-01-14', type: 'jaune' },
  { date: '2026-01-21', type: 'jaune' },
  { date: '2026-01-28', type: 'jaune' },
  // Bac gris (samedi): 3, 10, 17, 24, 31
  { date: '2026-01-03', type: 'gris' },
  { date: '2026-01-10', type: 'gris' },
  { date: '2026-01-17', type: 'gris' },
  { date: '2026-01-24', type: 'gris' },
  { date: '2026-01-31', type: 'gris' },

  // FEVRIER 2026
  // Bac jaune (mercredi): 4, 11, 18, 25
  { date: '2026-02-04', type: 'jaune' },
  { date: '2026-02-11', type: 'jaune' },
  { date: '2026-02-18', type: 'jaune' },
  { date: '2026-02-25', type: 'jaune' },
  // Bac gris (samedi): 7, 14, 21, 28
  { date: '2026-02-07', type: 'gris' },
  { date: '2026-02-14', type: 'gris' },
  { date: '2026-02-21', type: 'gris' },
  { date: '2026-02-28', type: 'gris' },

  // MARS 2026
  // Bac jaune (mercredi): 4, 11, 18, 25
  { date: '2026-03-04', type: 'jaune' },
  { date: '2026-03-11', type: 'jaune' },
  { date: '2026-03-18', type: 'jaune' },
  { date: '2026-03-25', type: 'jaune' },
  // Bac gris (samedi): 7, 14, 21, 28
  { date: '2026-03-07', type: 'gris' },
  { date: '2026-03-14', type: 'gris' },
  { date: '2026-03-21', type: 'gris' },
  { date: '2026-03-28', type: 'gris' },

  // AVRIL 2026
  // Bac jaune (mercredi): 1, 8, 15, 22, 29
  { date: '2026-04-01', type: 'jaune' },
  { date: '2026-04-08', type: 'jaune' },
  { date: '2026-04-15', type: 'jaune' },
  { date: '2026-04-22', type: 'jaune' },
  { date: '2026-04-29', type: 'jaune' },
  // Bac gris (samedi): 4, 11, 18, 25
  { date: '2026-04-04', type: 'gris' },
  { date: '2026-04-11', type: 'gris' },
  { date: '2026-04-18', type: 'gris' },
  { date: '2026-04-25', type: 'gris' },

  // MAI 2026
  // Bac jaune (mercredi): 6, 13, 20, 27
  { date: '2026-05-06', type: 'jaune' },
  { date: '2026-05-13', type: 'jaune' },
  { date: '2026-05-20', type: 'jaune' },
  { date: '2026-05-27', type: 'jaune' },
  // Bac gris (samedi): 2, 9, 16, 23, 30
  { date: '2026-05-02', type: 'gris' },
  { date: '2026-05-09', type: 'gris' },
  { date: '2026-05-16', type: 'gris' },
  { date: '2026-05-23', type: 'gris' },
  { date: '2026-05-30', type: 'gris' },

  // JUIN 2026
  // Bac jaune (mercredi): 3, 10, 17, 24
  { date: '2026-06-03', type: 'jaune' },
  { date: '2026-06-10', type: 'jaune' },
  { date: '2026-06-17', type: 'jaune' },
  { date: '2026-06-24', type: 'jaune' },
  // Bac gris (samedi): 6, 13, 20, 27
  { date: '2026-06-06', type: 'gris' },
  { date: '2026-06-13', type: 'gris' },
  { date: '2026-06-20', type: 'gris' },
  { date: '2026-06-27', type: 'gris' },

  // JUILLET 2026
  // Bac jaune (mercredi): 1, 8, 15, 22, 29
  { date: '2026-07-01', type: 'jaune' },
  { date: '2026-07-08', type: 'jaune' },
  { date: '2026-07-15', type: 'jaune' },
  { date: '2026-07-22', type: 'jaune' },
  { date: '2026-07-29', type: 'jaune' },
  // Bac gris (samedi): 4, 11, 18, 25
  { date: '2026-07-04', type: 'gris' },
  { date: '2026-07-11', type: 'gris' },
  { date: '2026-07-18', type: 'gris' },
  { date: '2026-07-25', type: 'gris' },

  // AOUT 2026
  // Bac jaune (mercredi): 5, 12, 19, 26
  { date: '2026-08-05', type: 'jaune' },
  { date: '2026-08-12', type: 'jaune' },
  { date: '2026-08-19', type: 'jaune' },
  { date: '2026-08-26', type: 'jaune' },
  // Bac gris (samedi): 1, 8, 15, 22, 29
  { date: '2026-08-01', type: 'gris' },
  { date: '2026-08-08', type: 'gris' },
  { date: '2026-08-15', type: 'gris' },
  { date: '2026-08-22', type: 'gris' },
  { date: '2026-08-29', type: 'gris' },

  // SEPTEMBRE 2026
  // Bac jaune (mercredi): 2, 9, 16, 23, 30
  { date: '2026-09-02', type: 'jaune' },
  { date: '2026-09-09', type: 'jaune' },
  { date: '2026-09-16', type: 'jaune' },
  { date: '2026-09-23', type: 'jaune' },
  { date: '2026-09-30', type: 'jaune' },
  // Bac gris (samedi): 5, 12, 19, 26
  { date: '2026-09-05', type: 'gris' },
  { date: '2026-09-12', type: 'gris' },
  { date: '2026-09-19', type: 'gris' },
  { date: '2026-09-26', type: 'gris' },

  // OCTOBRE 2026
  // Bac jaune (mercredi): 7, 14, 21, 28
  { date: '2026-10-07', type: 'jaune' },
  { date: '2026-10-14', type: 'jaune' },
  { date: '2026-10-21', type: 'jaune' },
  { date: '2026-10-28', type: 'jaune' },
  // Bac gris (samedi): 3, 10, 17, 24, 31
  { date: '2026-10-03', type: 'gris' },
  { date: '2026-10-10', type: 'gris' },
  { date: '2026-10-17', type: 'gris' },
  { date: '2026-10-24', type: 'gris' },
  { date: '2026-10-31', type: 'gris' },

  // NOVEMBRE 2026
  // Bac jaune (mercredi): 4, 11, 18, 25
  { date: '2026-11-04', type: 'jaune' },
  { date: '2026-11-11', type: 'jaune' },
  { date: '2026-11-18', type: 'jaune' },
  { date: '2026-11-25', type: 'jaune' },
  // Bac gris (samedi): 7, 14, 21, 28
  { date: '2026-11-07', type: 'gris' },
  { date: '2026-11-14', type: 'gris' },
  { date: '2026-11-21', type: 'gris' },
  { date: '2026-11-28', type: 'gris' },

  // DECEMBRE 2026
  // Bac jaune (mercredi): 2, 9, 16, 23, 30
  { date: '2026-12-02', type: 'jaune' },
  { date: '2026-12-09', type: 'jaune' },
  { date: '2026-12-16', type: 'jaune' },
  { date: '2026-12-23', type: 'jaune' },
  { date: '2026-12-30', type: 'jaune' },
  // Bac gris (samedi): 5, 12, 19, 26
  { date: '2026-12-05', type: 'gris' },
  { date: '2026-12-12', type: 'gris' },
  { date: '2026-12-19', type: 'gris' },
  { date: '2026-12-26', type: 'gris' },
];

// Jours fériés 2026 visibles sur le calendrier
const joursFeries2026 = [
  { date: '2026-01-01', nom: 'Jour de l\'An' },
  { date: '2026-04-06', nom: 'Lundi de Pâques' },
  { date: '2026-05-01', nom: 'Fête du Travail' },
  { date: '2026-05-08', nom: 'Victoire 1945' },
  { date: '2026-05-14', nom: 'Ascension' },
  { date: '2026-05-25', nom: 'Lundi de Pentecôte' },
  { date: '2026-07-14', nom: 'Fête Nationale' },
  { date: '2026-08-15', nom: 'Assomption' },
  { date: '2026-11-01', nom: 'Toussaint' },
  { date: '2026-11-11', nom: 'Armistice 1918' },
  { date: '2026-12-25', nom: 'Noël' },
];

async function main() {
  console.log('🗑️  Début de l\'importation des données 2026...');

  // Supprimer les données 2026 existantes si elles existent
  console.log('Suppression des données 2026 existantes...');
  await prisma.collecteCalendrier.deleteMany({
    where: { annee: 2026 },
  });
  await prisma.joursFeries.deleteMany({
    where: { annee: 2026 },
  });

  // Insérer les nouvelles collectes 2026
  console.log(`Insertion de ${collectes2026.length} collectes pour 2026...`);
  for (const collecte of collectes2026) {
    const dateObj = new Date(collecte.date + 'T12:00:00Z');
    await prisma.collecteCalendrier.create({
      data: {
        date: dateObj,
        typeCollecte: collecte.type,
        annee: dateObj.getFullYear(),
        mois: dateObj.getMonth() + 1,
        jour: dateObj.getDate(),
        estFerie: false,
      },
    });
  }

  // Insérer les jours fériés 2026
  console.log(`Insertion de ${joursFeries2026.length} jours fériés pour 2026...`);
  for (const ferie of joursFeries2026) {
    const dateObj = new Date(ferie.date + 'T12:00:00Z');
    await prisma.joursFeries.create({
      data: {
        date: dateObj,
        nom: ferie.nom,
        annee: dateObj.getFullYear(),
      },
    });
  }

  // Marquer les collectes qui tombent un jour férié
  console.log('Mise à jour des collectes tombant un jour férié...');
  for (const ferie of joursFeries2026) {
    const dateObj = new Date(ferie.date + 'T12:00:00Z');
    await prisma.collecteCalendrier.updateMany({
      where: { date: dateObj },
      data: { estFerie: true },
    });
  }

  console.log('✅ Importation terminée avec succès !');
  console.log(`   - ${collectes2026.length} collectes ajoutées`);
  console.log(`   - ${joursFeries2026.length} jours fériés ajoutés`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'importation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
