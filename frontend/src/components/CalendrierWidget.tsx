import React from 'react';
import { eachDayOfInterval } from 'date-fns';
import JourCollecte from './JourCollecte';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import type { Collecte } from '@/types/collecte';

interface CalendrierWidgetProps {
  debut: Date;
  fin: Date;
  collectes: Collecte[];
}

export default function CalendrierWidget({
  debut,
  fin,
  collectes,
}: CalendrierWidgetProps) {
  const jours = eachDayOfInterval({ start: debut, end: fin });

  const getCollecteForDate = (date: Date) => {
    return collectes.find(
      c =>
        c.date.getFullYear() === date.getFullYear() &&
        c.date.getMonth() === date.getMonth() &&
        c.date.getDate() === date.getDate()
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📆 Semaine en cours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {jours.map((jour, index) => (
            <JourCollecte
              key={index}
              date={jour}
              collecte={getCollecteForDate(jour)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
