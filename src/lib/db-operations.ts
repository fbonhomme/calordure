import { prisma } from './prisma';
import { getSemaineEnCours, getMoisPeriode } from './dateUtils';
import type { Collecte, JourFerie, InfoSemaine } from '@/types/collecte';

/**
 * Récupère les collectes de la semaine en cours
 */
export async function getCollectesSemaine(
  debut?: Date,
  fin?: Date
): Promise<InfoSemaine> {
  const { debut: defaultDebut, fin: defaultFin } = debut && fin
    ? { debut, fin }
    : getSemaineEnCours();

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

  const aCollecteJaune = collectes.some((c: any) =>
    c.typeCollecte.includes('jaune')
  );
  const aCollecteGrise = collectes.some((c: any) =>
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
 * Récupère les collectes d'un mois donné
 */
export async function getCollectesMois(
  annee: number,
  mois: number
): Promise<Collecte[]> {
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

  return collectes as unknown as Collecte[];
}

/**
 * Récupère une collecte par date
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
 * Récupère tous les jours fériés d'une année
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
 * Récupère la prochaine collecte à partir d'une date
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
