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
 * Get the start and end of the current week (Monday to Sunday)
 */
export function getSemaineEnCours(date: Date = new Date()) {
  const debut = startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
  const fin = endOfWeek(date, { weekStartsOn: 1 });

  return { debut, fin };
}

/**
 * Filter collections within a given period
 */
export function getCollectesDansPeriode<T extends { date: Date }>(
  collectes: T[],
  debut: Date,
  fin: Date
): T[] {
  return collectes.filter((collecte) =>
    isWithinInterval(collecte.date, { start: debut, end: fin })
  );
}

/**
 * Format a date in French
 */
export function formaterDate(
  date: Date,
  formatString: string = 'EEEE d MMMM yyyy'
): string {
  return format(date, formatString, { locale: fr });
}

/**
 * Check if a date is today
 */
export function estAujourdhui(date: Date): boolean {
  return isTodayFns(date);
}

/**
 * Parse an ISO date string
 */
export function parseDateISO(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Get the start and end of a month
 */
export function getMoisPeriode(annee: number, mois: number) {
  const date = new Date(annee, mois - 1, 1); // mois - 1 because Date uses 0-11
  const debut = startOfMonth(date);
  const fin = endOfMonth(date);

  return { debut, fin };
}

/**
 * Get the current month and year
 */
export function getMoisActuel() {
  const maintenant = new Date();
  return {
    annee: maintenant.getFullYear(),
    mois: maintenant.getMonth() + 1, // +1 because getMonth() returns 0-11
  };
}
