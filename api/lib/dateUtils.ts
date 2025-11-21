import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Récupère le début et la fin de la semaine en cours (lundi-dimanche)
 */
export function getSemaineEnCours(): { debut: Date; fin: Date } {
  const maintenant = new Date();
  const debut = startOfWeek(maintenant, { locale: fr, weekStartsOn: 1 });
  const fin = endOfWeek(maintenant, { locale: fr, weekStartsOn: 1 });

  return { debut, fin };
}

/**
 * Récupère le début et la fin d'un mois donné
 */
export function getMoisPeriode(annee: number, mois: number): { debut: Date; fin: Date } {
  const date = new Date(annee, mois - 1, 1);
  const debut = startOfMonth(date);
  const fin = endOfMonth(date);

  return { debut, fin };
}
