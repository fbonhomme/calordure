import { NextResponse } from 'next/server';
import { getCollectesMois, getJoursFeries } from '@/lib/db-operations';
import { getMoisActuel } from '@/lib/dateUtils';

export const revalidate = 3600; // ISR: revalider toutes les heures

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mois: string }> }
) {
  try {
    const { mois: moisStr } = await params;
    const mois = parseInt(moisStr, 10);

    // Validation du mois (1-12)
    if (isNaN(mois) || mois < 1 || mois > 12) {
      return NextResponse.json(
        {
          error: 'Mois invalide',
          message: 'Le mois doit être un nombre entre 1 et 12',
        },
        { status: 400 }
      );
    }

    // Pour l'instant, on ne supporte que 2025
    const annee = 2025;
    const { annee: anneeActuelle } = getMoisActuel();

    // Validation de l'année (seulement 2025 pour l'instant)
    if (annee !== 2025) {
      return NextResponse.json(
        {
          error: 'Année non supportée',
          message:
            'Seules les données de 2025 sont disponibles. Pour d\'autres années, veuillez contacter la mairie.',
        },
        { status: 400 }
      );
    }

    const collectes = await getCollectesMois(annee, mois);
    const joursFeries = await getJoursFeries(annee);

    return NextResponse.json({
      annee,
      mois,
      collectes: collectes.map(c => ({
        ...c,
        date: c.date.toISOString(),
      })),
      joursFeries: joursFeries.map(f => ({
        ...f,
        date: f.date.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du calendrier:', error);
    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message:
          'Impossible de charger le calendrier. Veuillez réessayer plus tard.',
      },
      { status: 500 }
    );
  }
}
