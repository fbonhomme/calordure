const { PrismaClient } = require('@prisma/client');
const { startOfMonth, endOfMonth } = require('date-fns');

const prisma = new PrismaClient();

function getMoisPeriode(annee, mois) {
  const date = new Date(annee, mois - 1, 1);
  const debut = startOfMonth(date);
  const fin = endOfMonth(date);
  return { debut, fin };
}

module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request for calendrier.');

  try {
    const moisStr = req.params.mois;
    const mois = parseInt(moisStr, 10);

    // Validation du mois (1-12)
    if (isNaN(mois) || mois < 1 || mois > 12) {
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          error: 'Mois invalide',
          message: 'Le mois doit être un nombre entre 1 et 12',
        },
      };
      return;
    }

    // Pour l'instant, on ne supporte que 2025
    const annee = 2025;
    const { debut, fin } = getMoisPeriode(annee, mois);

    const collectes = await prisma.collecteCalendrier.findMany({
      where: {
        date: {
          gte: debut,
          lte: fin,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const joursFeries = await prisma.joursFeries.findMany({
      where: {
        annee,
      },
      orderBy: {
        date: 'asc',
      },
    });

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        annee,
        mois,
        collectes: collectes.map(c => ({
          ...c,
          date: c.date.toISOString(),
        })),
        joursFeries: joursFeries.map(f => ({
          ...f,
          date: f.date.toISOString(),
        })),
      },
    };
  } catch (error) {
    context.log.error('Erreur lors de la récupération du calendrier:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: 'Erreur serveur',
        message: 'Impossible de charger le calendrier. Veuillez réessayer plus tard.',
      },
    };
  }
};
