import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCollectesMois, getJoursFeries } from '../lib/db-operations';

export async function calendrier(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request for calendrier.');

  try {
    const moisStr = request.params.mois;
    const mois = parseInt(moisStr, 10);

    // Validation du mois (1-12)
    if (isNaN(mois) || mois < 1 || mois > 12) {
      return {
        status: 400,
        jsonBody: {
          error: 'Mois invalide',
          message: 'Le mois doit être un nombre entre 1 et 12',
        },
      };
    }

    // Pour l'instant, on ne supporte que 2025
    const annee = 2025;

    const collectes = await getCollectesMois(annee, mois);
    const joursFeries = await getJoursFeries(annee);

    return {
      status: 200,
      jsonBody: {
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
      },
    };
  } catch (error) {
    context.error('Erreur lors de la récupération du calendrier:', error);
    return {
      status: 500,
      jsonBody: {
        error: 'Erreur serveur',
        message: 'Impossible de charger le calendrier. Veuillez réessayer plus tard.',
      },
    };
  }
}

app.http('calendrier', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'calendrier/{mois}',
  handler: calendrier,
});
