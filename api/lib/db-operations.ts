import { prisma } from './prisma';
import { getSemaineEnCours, getMoisPeriode } from './dateUtils';

export interface Collecte {
  date: Date;
  typeCollecte: string;
}

export interface JourFerie {
  date: Date;
  nom: string;
  annee: number;
}

export interface InfoSemaine {
  debut: Date;
  fin: Date;
  collectes: Collecte[];
  aCollecteJaune: boolean;
  aCollecteGrise: boolean;
}

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

  const aCollecteJaune = collectes.some((c: { typeCollecte: string }) =>
    c.typeCollecte.includes('jaune')
  );
  const aCollecteGrise = collectes.some((c: { typeCollecte: string }) =>
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
