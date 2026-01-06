'use client';

import { useState, useEffect } from 'react';
import { getCollectesMois } from '@/lib/api';
import CalendrierMensuel from '@/components/CalendrierMensuel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Legende from '@/components/Legende';
import Header from '@/components/Header';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
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
  const [annee] = useState<number>(new Date().getFullYear());
  const [collectes, setCollectes] = useState<Collecte[]>([]);
  const [joursFeries, setJoursFeries] = useState<JourFerie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCalendrier() {
      setLoading(true);
      setError(null);

      try {
        const data = await getCollectesMois(moisActuel, annee);
        setCollectes(data.collectes);
        setJoursFeries(data.joursFeries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur lors du chargement'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCalendrier();
  }, [moisActuel, annee]);

  const changerMois = (delta: number) => {
    const nouveauMois = moisActuel + delta;
    if (nouveauMois >= 1 && nouveauMois <= 12 && !isTransitioning) {
      setIsTransitioning(true);
      setMoisActuel(nouveauMois);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Swipe navigation handlers
  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => changerMois(1), // Swipe left = next month
    onSwipeRight: () => changerMois(-1), // Swipe right = previous month
    enabled: !loading && !error,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 p-4 md:p-8 min-w-[320px]">
      <div className="max-w-7xl mx-auto">
        <Header currentPage="calendar" />

        {/* Subtitle */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            📅 Calendrier Complet
          </h2>
          <p className="text-muted-foreground">Année {annee}</p>
          <p className="text-xs text-muted-foreground mt-2 md:hidden">
            👈 Glissez pour naviguer 👉
          </p>
        </div>

        {/* Month navigation */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
              <Button
                onClick={() => changerMois(-1)}
                disabled={moisActuel === 1 || isTransitioning}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <span className="hidden sm:inline">← Précédent</span>
                <span className="sm:hidden">←</span>
              </Button>

              <Badge
                variant="default"
                className={`text-base md:text-lg px-3 md:px-6 py-2 min-w-[100px] md:min-w-[140px] justify-center transition-transform ${
                  isTransitioning ? 'scale-95' : 'scale-100'
                }`}
              >
                {MOIS_NOMS[moisActuel - 1]}
              </Badge>

              <Button
                onClick={() => changerMois(1)}
                disabled={moisActuel === 12 || isTransitioning}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <span className="hidden sm:inline">Suivant →</span>
                <span className="sm:hidden">→</span>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Quick month selector */}
            <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
              {MOIS_NOMS.map((nom, index) => (
                <Button
                  key={index}
                  onClick={() => setMoisActuel(index + 1)}
                  variant={moisActuel === index + 1 ? "default" : "outline"}
                  size="sm"
                  className="min-w-[70px] md:min-w-[80px] text-xs md:text-sm"
                >
                  {nom}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-destructive">{error}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Veuillez réessayer plus tard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl animate-pulse">📅</div>
                <p className="text-muted-foreground">Chargement du calendrier...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar */}
        {!loading && !error && (
          <div {...swipeHandlers} className="touch-pan-y">
            <div
              className={`transition-opacity duration-300 ${
                isTransitioning ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <CalendrierMensuel
                annee={annee}
                mois={moisActuel}
                collectes={collectes}
                joursFeries={joursFeries}
              />
            </div>

            <Legende />
          </div>
        )}

        {/* Footer */}
        <Separator className="my-8" />
        <footer className="text-center text-muted-foreground text-sm pb-4">
          <p className="font-medium">Communauté de Communes Yonne Nord</p>
          <p className="mt-2 text-xs">
            Calendrier des collectes {annee}
          </p>
        </footer>
      </div>
    </main>
  );
}
