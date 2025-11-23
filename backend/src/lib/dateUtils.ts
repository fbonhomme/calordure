import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

/**
 * Get the start and end of the current week (Monday to Sunday)
 */
export function getSemaineEnCours(date: Date = new Date()) {
  const debut = startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
  const fin = endOfWeek(date, { weekStartsOn: 1 });

  return { debut, fin };
}

/**
 * Get the start and end of a specific month
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
