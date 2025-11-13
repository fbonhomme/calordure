import { getCollectesSemaine } from '@/lib/db-operations';
import AlerteCollecte from '@/components/AlerteCollecte';
import CalendrierWidget from '@/components/CalendrierWidget';
import Legende from '@/components/Legende';

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 min-w-[320px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🗑️ Collecte des Poubelles
          </h1>
          <p className="text-gray-600 text-lg">
            Pont-sur-Yonne (Bourg)
          </p>
        </header>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">{error}</p>
            <p className="text-sm">Veuillez réessayer plus tard.</p>
          </div>
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
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Communauté de Communes Yonne Nord</p>
          <p className="mt-2">
            <a
              href="/calendrier"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Voir le calendrier complet
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
