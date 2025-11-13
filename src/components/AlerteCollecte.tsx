import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import type { Collecte } from '@/types/collecte';

interface AlerteCollecteProps {
  aCollecteJaune: boolean;
  aCollecteGrise: boolean;
  collectes: Collecte[];
}

export default function AlerteCollecte({
  aCollecteJaune,
  aCollecteGrise,
  collectes,
}: AlerteCollecteProps) {
  const getMessage = () => {
    if (aCollecteJaune && aCollecteGrise) {
      return {
        text: 'Cette semaine : collecte des bacs jaune ET gris !',
        variant: 'both' as const,
        icon: '🟡⚫',
      };
    } else if (aCollecteJaune) {
      return {
        text: 'Cette semaine : collecte du bac jaune (emballages + papiers)',
        variant: 'yellow' as const,
        icon: '🟡',
      };
    } else if (aCollecteGrise) {
      return {
        text: 'Cette semaine : collecte du bac gris (ordures ménagères)',
        variant: 'grey' as const,
        icon: '⚫',
      };
    } else {
      return {
        text: 'Aucune collecte cette semaine',
        variant: 'default' as const,
        icon: '📭',
      };
    }
  };

  const message = getMessage();

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{message.icon}</span>
        <div className="flex-1">
          <Badge variant={message.variant} className="text-base">
            {message.text}
          </Badge>
        </div>
      </div>

      {collectes.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            {collectes.length === 1
              ? '1 collecte prévue'
              : `${collectes.length} collectes prévues`}
          </p>
        </div>
      )}
    </Card>
  );
}
