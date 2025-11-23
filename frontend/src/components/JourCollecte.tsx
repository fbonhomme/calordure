import React from 'react';
import { formaterDate, estAujourdhui } from '@/lib/dateUtils';
import type { Collecte } from '@/types/collecte';

interface JourCollecteProps {
  date: Date;
  collecte?: Collecte;
}

export default function JourCollecte({ date, collecte }: JourCollecteProps) {
  const isToday = estAujourdhui(date);
  const nomJour = formaterDate(date, 'EEEE');
  const jourMois = formaterDate(date, 'd MMM');

  const getCollecteIcon = () => {
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

  const icon = getCollecteIcon();

  return (
    <div
      className={`p-3 rounded-lg border-2 transition-all ${
        isToday
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white'
      } ${collecte ? 'shadow-md' : ''}`}
    >
      <div className="text-center">
        <div
          className={`text-sm font-medium capitalize ${
            isToday ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {nomJour}
        </div>
        <div
          className={`text-xs ${
            isToday ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {jourMois}
        </div>

        {icon && (
          <div className="mt-2 text-2xl">{icon}</div>
        )}

        {isToday && (
          <div className="mt-1 text-xs font-semibold text-blue-600">
            Aujourd&apos;hui
          </div>
        )}
      </div>
    </div>
  );
}
