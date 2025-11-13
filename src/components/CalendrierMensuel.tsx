import React from 'react';
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { estAujourdhui } from '@/lib/dateUtils';
import Card from './ui/Card';
import type { Collecte, JourFerie } from '@/types/collecte';

interface CalendrierMensuelProps {
  annee: number;
  mois: number;
  collectes: Collecte[];
  joursFeries: JourFerie[];
}

export default function CalendrierMensuel({
  annee,
  mois,
  collectes,
  joursFeries,
}: CalendrierMensuelProps) {
  const date = new Date(annee, mois - 1, 1);
  const debutMois = startOfMonth(date);
  const finMois = endOfMonth(date);

  // Inclure les jours de la semaine précédente et suivante pour afficher un calendrier complet
  const debutCalendrier = startOfWeek(debutMois, { weekStartsOn: 1 });
  const finCalendrier = endOfWeek(finMois, { weekStartsOn: 1 });

  const jours = eachDayOfInterval({
    start: debutCalendrier,
    end: finCalendrier,
  });

  const nomMois = format(date, 'MMMM yyyy', { locale: fr });

  const getCollecteForDate = (dateJour: Date) => {
    return collectes.find(
      c =>
        c.date.getFullYear() === dateJour.getFullYear() &&
        c.date.getMonth() === dateJour.getMonth() &&
        c.date.getDate() === dateJour.getDate()
    );
  };

  const getFerieForDate = (dateJour: Date) => {
    return joursFeries.find(
      f =>
        f.date.getFullYear() === dateJour.getFullYear() &&
        f.date.getMonth() === dateJour.getMonth() &&
        f.date.getDate() === dateJour.getDate()
    );
  };

  const getBackgroundColor = (collecte?: Collecte) => {
    if (!collecte) return 'bg-white';

    if (collecte.typeCollecte === 'jaune+gris') {
      return 'bg-orange-100';
    } else if (collecte.typeCollecte === 'jaune') {
      return 'bg-yellow-100';
    } else if (collecte.typeCollecte === 'gris') {
      return 'bg-gray-200';
    }
    return 'bg-white';
  };

  const getCollecteIcon = (collecte?: Collecte) => {
    if (!collecte) return null;

    if (collecte.typeCollecte === 'jaune+gris') {
      return '🟡⚫';
    } else if (collecte.typeCollecte === 'jaune') {
      return '🟡';
    } else if (collecte.typeCollecte === 'gris') {
      return '⚫';
    }
    return null;
  };

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4 capitalize text-center">
        {nomMois}
      </h2>

      {/* En-têtes des jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
          <div
            key={jour}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {jour}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-2">
        {jours.map((jour, index) => {
          const collecte = getCollecteForDate(jour);
          const ferie = getFerieForDate(jour);
          const isToday = estAujourdhui(jour);
          const isCurrentMonth = isSameMonth(jour, date);
          const icon = getCollecteIcon(collecte);

          return (
            <div
              key={index}
              className={`
                min-h-[80px] p-2 rounded-lg border transition-all
                ${getBackgroundColor(collecte)}
                ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                ${collecte ? 'shadow-sm' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <div
                  className={`text-sm font-medium ${
                    isToday ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {format(jour, 'd')}
                </div>

                {icon && (
                  <div className="text-xl mt-1 text-center">{icon}</div>
                )}

                {ferie && (
                  <div
                    className="text-xs text-red-600 mt-auto font-medium truncate"
                    title={ferie.nom}
                  >
                    {ferie.nom}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
