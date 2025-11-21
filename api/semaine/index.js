const { PrismaClient } = require('@prisma/client');
const { startOfWeek, endOfWeek } = require('date-fns');
const { fr } = require('date-fns/locale');

const prisma = new PrismaClient();

function getSemaineEnCours() {
  const maintenant = new Date();
  const debut = startOfWeek(maintenant, { locale: fr, weekStartsOn: 1 });
  const fin = endOfWeek(maintenant, { locale: fr, weekStartsOn: 1 });
  return { debut, fin };
}

module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request for semaine.');

  try {
    const { debut, fin } = getSemaineEnCours();

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

    const aCollecteJaune = collectes.some((c) => c.typeCollecte.includes('jaune'));
    const aCollecteGrise = collectes.some((c) => c.typeCollecte.includes('gris'));

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        semaine: {
          debut: debut.toISOString(),
          fin: fin.toISOString(),
        },
        collectes: collectes.map(c => ({
          ...c,
          date: c.date.toISOString(),
        })),
        aCollecteJaune,
        aCollecteGrise,
      },
    };
  } catch (error) {
    context.log.error('Erreur lors de la récupération des collectes:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: 'Erreur lors de la récupération des données de collecte',
        message: 'Impossible de charger les informations. Veuillez réessayer plus tard.',
      },
    };
  }
};
