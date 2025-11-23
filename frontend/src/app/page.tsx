'use client';

import { useState, useEffect } from 'react';
import { getCollectesSemaine } from '@/lib/api';
import AlerteCollecte from '@/components/AlerteCollecte';
import CalendrierWidget from '@/components/CalendrierWidget';
import Legende from '@/components/Legende';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { InfoSemaine } from '@/types/collecte';

export default function Home() {
  const [infoSemaine, setInfoSemaine] = useState<InfoSemaine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCollectesSemaine();
        setInfoSemaine(data);
      } catch (e) {
        console.error('Erreur lors du chargement des collectes:', e);
        setError('Impossible de charger les données de collecte');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 p-4 md:p-8 min-w-[320px]">
      <div className="max-w-6xl mx-auto">
        <Header currentPage="home" />

        {/* Loading state */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl animate-pulse">🗑️</div>
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error message */}
        {error && !loading && (
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

        {/* Alerts and Calendar */}
        {infoSemaine && !loading && (
          <>
            <AlerteCollecte
              aCollecteJaune={infoSemaine.aCollecteJaune}
              aCollecteGrise={infoSemaine.aCollecteGrise}
              collectes={infoSemaine.collectes}
            />

            <CalendrierWidget
              debut={infoSemaine.debut}
              fin={infoSemaine.fin}
              collectes={infoSemaine.collectes}
            />

            <Legende />
          </>
        )}

        {/* Footer */}
        <Separator className="my-8" />
        <footer className="text-center text-muted-foreground text-sm pb-4">
          <p className="font-medium">Communauté de Communes Yonne Nord</p>
          <p className="mt-2 text-xs">
            Calendrier des collectes 2025
          </p>
        </footer>
      </div>
    </main>
  );
}
