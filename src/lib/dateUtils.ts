import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  format,
  isToday as isTodayFns,
  startOfMonth,
  endOfMonth,
  parseISO,
} from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Récupère le début et la fin de la semaine en cours (lundi à dimanche)
 */
export function getSemaineEnCours(date: Date = new Date()) {
  const debut = startOfWeek(date, { weekStartsOn: 1 }); // 1 = lundi
  const fin = endOfWeek(date, { weekStartsOn: 1 });

  return { debut, fin };
}

/**
 * Filtre les collectes dans une période donnée
 */
export function getCollectesDansPeriode<T extends { date: Date }>(
  collectes: T[],
  debut: Date,
  fin: Date
): T[] {
  return collectes.filter(collecte =>
    isWithinInterval(collecte.date, { start: debut, end: fin })
  );
}

/**
 * Formate une date en français
 */
export function formaterDate(
  date: Date,
  formatString: string = 'EEEE d MMMM yyyy'
): string {
  return format(date, formatString, { locale: fr });
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function estAujourdhui(date: Date): boolean {
  return isTodayFns(date);
}

/**
 * Parse une date ISO string
 */
export function parseDateISO(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Récupère le début et la fin d'un mois
 */
export function getMoisPeriode(annee: number, mois: number) {
  const date = new Date(annee, mois - 1, 1); // mois - 1 car Date utilise 0-11
  const debut = startOfMonth(date);
  const fin = endOfMonth(date);

  return { debut, fin };
}

/**
 * Récupère le mois et l'année actuels
 */
export function getMoisActuel() {
  const maintenant = new Date();
  return {
    annee: maintenant.getFullYear(),
    mois: maintenant.getMonth() + 1, // +1 car getMonth() retourne 0-11
  };
}
