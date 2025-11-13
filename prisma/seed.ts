import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';
import { collectes2025 } from '../src/lib/collecteData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed jours fériés
  console.log('📅 Seeding jours fériés...');
  for (const ferie of collectes2025.feries) {
    const date = parseISO(ferie.date);
    await prisma.joursFeries.upsert({
      where: { date },
      update: {
        nom: ferie.nom,
        annee: date.getFullYear(),
      },
      create: {
        date,
        nom: ferie.nom,
        annee: date.getFullYear(),
      },
    });
  }
  console.log(`✅ ${collectes2025.feries.length} jours fériés seeded`);

  // Seed collectes jaunes
  console.log('🟡 Seeding collectes bac jaune...');
  let jauneCount = 0;
  for (const dateStr of collectes2025.jaune) {
    const date = parseISO(dateStr);
    const estFerie = collectes2025.feries.some(
      f => f.date === dateStr
    );

    await prisma.collecteCalendrier.upsert({
      where: { date },
      update: {
        typeCollecte: 'jaune',
        annee: date.getFullYear(),
        mois: date.getMonth() + 1,
        jour: date.getDate(),
        estFerie,
      },
      create: {
        date,
        typeCollecte: 'jaune',
        annee: date.getFullYear(),
        mois: date.getMonth() + 1,
        jour: date.getDate(),
        estFerie,
      },
    });
    jauneCount++;
  }
  console.log(`✅ ${jauneCount} collectes bac jaune seeded`);

  // Seed collectes grises (vérifier si existe déjà une collecte jaune le même jour)
  console.log('⚫ Seeding collectes bac gris...');
  let grisCount = 0;
  for (const dateStr of collectes2025.gris) {
    const date = parseISO(dateStr);
    const estFerie = collectes2025.feries.some(
      f => f.date === dateStr
    );

    // Vérifier si une collecte existe déjà pour cette date
    const existante = await prisma.collecteCalendrier.findUnique({
      where: { date },
    });

    if (existante) {
      // Si c'est une collecte jaune, la mettre à jour en jaune+gris
      if (existante.typeCollecte === 'jaune') {
        await prisma.collecteCalendrier.update({
          where: { date },
          data: {
            typeCollecte: 'jaune+gris',
          },
        });
      }
    } else {
      // Créer une nouvelle collecte gris
      await prisma.collecteCalendrier.create({
        data: {
          date,
          typeCollecte: 'gris',
          annee: date.getFullYear(),
          mois: date.getMonth() + 1,
          jour: date.getDate(),
          estFerie,
        },
      });
    }
    grisCount++;
  }
  console.log(`✅ ${grisCount} collectes bac gris seeded`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
