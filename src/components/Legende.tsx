import React from 'react';
import Card from './ui/Card';

export default function Legende() {
  return (
    <Card className="mt-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📝 Légende
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bac jaune */}
        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
          <span className="text-2xl">🟡</span>
          <div>
            <h3 className="font-semibold text-gray-800">Bac jaune</h3>
            <p className="text-sm text-gray-600">
              Emballages + Journaux/Papiers
            </p>
          </div>
        </div>

        {/* Bac gris */}
        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
          <span className="text-2xl">⚫</span>
          <div>
            <h3 className="font-semibold text-gray-800">Bac gris</h3>
            <p className="text-sm text-gray-600">Ordures ménagères</p>
          </div>
        </div>
      </div>

      {/* Rappel 2025 */}
      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">
              Rappel important : Nouveauté 2025
            </h3>
            <p className="text-sm text-blue-700">
              Depuis le 1er janvier 2025, les journaux et papiers vont dans le{' '}
              <strong>bac jaune</strong> !
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
