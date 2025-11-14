import { getCollectesSemaine } from '@/lib/db-operations';
import AlerteCollecte from '@/components/AlerteCollecte';
import CalendrierWidget from '@/components/CalendrierWidget';
import Legende from '@/components/Legende';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  let infoSemaine;
  let error = null;

  try {
    infoSemaine = await getCollectesSemaine();
  } catch (e) {
    console.error('Erreur lors du chargement des collectes:', e);
    error = 'Impossible de charger les données de collecte';
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 p-4 md:p-8 min-w-[320px]">
      <div className="max-w-6xl mx-auto">
        <Header currentPage="home" />

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

        {/* Alerts and Calendar */}
        {infoSemaine && (
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
