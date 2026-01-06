import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export default function Legende() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📝 Légende
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Yellow bin */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-2xl">🟡</span>
            <div>
              <h3 className="font-semibold text-foreground">Bac jaune</h3>
              <p className="text-sm text-muted-foreground">
                Emballages + Journaux/Papiers
              </p>
            </div>
          </div>

          {/* Grey bin */}
          <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <span className="text-2xl">⚫</span>
            <div>
              <h3 className="font-semibold text-foreground">Bac gris</h3>
              <p className="text-sm text-muted-foreground">Ordures ménagères</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Important reminder */}
        <div className="p-4 bg-blue-50 border-l-4 border-primary rounded-r-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-primary mb-1">
                Rappel important
              </h3>
              <p className="text-sm text-blue-700">
                Les journaux et papiers vont dans le{' '}
                <strong>bac jaune</strong> (depuis le 1er janvier 2025).
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
