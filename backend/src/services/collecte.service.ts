import { prisma } from '../lib/prisma';
import { getSemaineEnCours, getMoisPeriode } from '../lib/dateUtils';
import type { Collecte, JourFerie, InfoSemaine, InfoMois } from '../types/collecte';

/**
 * Get collections for the current week
 */
export async function getCollectesSemaine(
  debut?: Date,
  fin?: Date
): Promise<InfoSemaine> {
  const { debut: defaultDebut, fin: defaultFin } =
    debut && fin ? { debut, fin } : getSemaineEnCours();

  const collectes = await prisma.collecteCalendrier.findMany({
    where: {
      date: {
        gte: defaultDebut,
        lte: defaultFin,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  const aCollecteJaune = collectes.some((c) =>
    c.typeCollecte.includes('jaune')
  );
  const aCollecteGrise = collectes.some((c) =>
    c.typeCollecte.includes('gris')
  );

  return {
    debut: defaultDebut,
    fin: defaultFin,
    collectes: collectes as unknown as Collecte[],
    aCollecteJaune,
    aCollecteGrise,
  };
}

/**
 * Get collections for a specific month
 */
export async function getCollectesMois(
  annee: number,
  mois: number
): Promise<InfoMois> {
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

  return {
    annee,
    mois,
    collectes: collectes as unknown as Collecte[],
    joursFeries: joursFeries as unknown as JourFerie[],
  };
}

/**
 * Get a collection by date
 */
export async function getCollecteParDate(
  date: Date
): Promise<Collecte | null> {
  const collecte = await prisma.collecteCalendrier.findUnique({
    where: {
      date,
    },
  });

  return collecte as unknown as Collecte | null;
}

/**
 * Get all holidays for a year
 */
export async function getJoursFeries(annee: number): Promise<JourFerie[]> {
  const feries = await prisma.joursFeries.findMany({
    where: {
      annee,
    },
    orderBy: {
      date: 'asc',
    },
  });

  return feries as unknown as JourFerie[];
}

/**
 * Get the next collection from a given date
 */
export async function getProchainCollecte(
  type?: 'jaune' | 'gris'
): Promise<Collecte | null> {
  const maintenant = new Date();

  const where = type
    ? {
        date: { gte: maintenant },
        typeCollecte: { contains: type },
      }
    : {
        date: { gte: maintenant },
      };

  const collecte = await prisma.collecteCalendrier.findFirst({
    where,
    orderBy: {
      date: 'asc',
    },
  });

  return collecte as unknown as Collecte | null;
}
