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
import { estAujourdhui } from '@/lib/dateUtils';
import { Card, CardContent } from './ui/card';
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

  // Include days from previous and next week for a complete calendar
  const debutCalendrier = startOfWeek(debutMois, { weekStartsOn: 1 });
  const finCalendrier = endOfWeek(finMois, { weekStartsOn: 1 });

  const jours = eachDayOfInterval({
    start: debutCalendrier,
    end: finCalendrier,
  });

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
    <Card className="mb-6">
      <CardContent className="pt-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 mb-2 md:mb-3">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour, index) => (
            <div
              key={jour}
              className="text-center font-semibold text-muted-foreground py-1 md:py-2"
            >
              <span className="block sm:hidden text-xs">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
              </span>
              <span className="hidden sm:block text-xs sm:text-sm">{jour}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
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
                  min-h-[60px] sm:min-h-[70px] md:min-h-[80px]
                  p-1 sm:p-1.5 md:p-2
                  rounded-md md:rounded-lg
                  border transition-all hover:shadow-md active:scale-95
                  ${getBackgroundColor(collecte)}
                  ${isToday ? 'border-primary border-2 ring-2 ring-primary/20' : 'border-border'}
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${collecte ? 'shadow-sm' : ''}
                `}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      isToday ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    {format(jour, 'd')}
                  </div>

                  {icon && (
                    <div className="text-base sm:text-lg md:text-xl mt-0.5 md:mt-1 text-center">{icon}</div>
                  )}

                  {ferie && (
                    <div
                      className="text-[10px] sm:text-xs text-red-600 mt-auto font-medium truncate"
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
      </CardContent>
    </Card>
  );
}
