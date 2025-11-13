import { NextResponse } from 'next/server';
import { getCollectesSemaine } from '@/lib/db-operations';
import { getSemaineEnCours } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { debut, fin } = getSemaineEnCours();
    const infoSemaine = await getCollectesSemaine(debut, fin);

    return NextResponse.json({
      semaine: {
        debut: infoSemaine.debut.toISOString(),
        fin: infoSemaine.fin.toISOString(),
      },
      collectes: infoSemaine.collectes.map(c => ({
        ...c,
        date: c.date.toISOString(),
      })),
      aCollecteJaune: infoSemaine.aCollecteJaune,
      aCollecteGrise: infoSemaine.aCollecteGrise,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des collectes:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des données de collecte',
        message:
          'Impossible de charger les informations. Veuillez réessayer plus tard.',
      },
      { status: 500 }
    );
  }
}
