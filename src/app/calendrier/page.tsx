'use client';

import { useState, useEffect } from 'react';
import CalendrierMensuel from '@/components/CalendrierMensuel';
import Button from '@/components/ui/Button';
import Legende from '@/components/Legende';
import type { Collecte, JourFerie } from '@/types/collecte';

const MOIS_NOMS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export default function CalendrierPage() {
  const [moisActuel, setMoisActuel] = useState<number>(new Date().getMonth() + 1);
  const [annee] = useState<number>(2025);
  const [collectes, setCollectes] = useState<Collecte[]>([]);
  const [joursFeries, setJoursFeries] = useState<JourFerie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalendrier() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/calendrier/${moisActuel}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors du chargement');
        }

        const data = await response.json();

        // Convertir les dates ISO en objets Date
        const collectesAvecDates = data.collectes.map((c: any) => ({
          ...c,
          date: new Date(c.date),
        }));

        const feriesAvecDates = data.joursFeries.map((f: any) => ({
          ...f,
          date: new Date(f.date),
        }));

        setCollectes(collectesAvecDates);
        setJoursFeries(feriesAvecDates);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur lors du chargement'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCalendrier();
  }, [moisActuel]);

  const changerMois = (delta: number) => {
    const nouveauMois = moisActuel + delta;
    if (nouveauMois >= 1 && nouveauMois <= 12) {
      setMoisActuel(nouveauMois);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 min-w-[320px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            📅 Calendrier des Collectes
          </h1>
          <p className="text-gray-600 text-lg">
            Pont-sur-Yonne (Bourg) - 2025
          </p>
        </header>

        {/* Navigation des mois */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            onClick={() => changerMois(-1)}
            disabled={moisActuel === 1}
            variant="outline"
            size="sm"
          >
            ← Mois précédent
          </Button>

          <div className="text-xl font-semibold text-gray-800 min-w-[150px] text-center">
            {MOIS_NOMS[moisActuel - 1]}
          </div>

          <Button
            onClick={() => changerMois(1)}
            disabled={moisActuel === 12}
            variant="outline"
            size="sm"
          >
            Mois suivant →
          </Button>
        </div>

        {/* Sélecteur rapide de mois */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {MOIS_NOMS.map((nom, index) => (
            <button
              key={index}
              onClick={() => setMoisActuel(index + 1)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                moisActuel === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {nom}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement du calendrier...</p>
          </div>
        )}

        {/* Calendrier */}
        {!loading && !error && (
          <>
            <CalendrierMensuel
              annee={annee}
              mois={moisActuel}
              collectes={collectes}
              joursFeries={joursFeries}
            />

            <Legende />
          </>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Retour à l&apos;accueil
            </a>
          </p>
          <p className="mt-2">Communauté de Communes Yonne Nord</p>
        </footer>
      </div>
    </main>
  );
}
