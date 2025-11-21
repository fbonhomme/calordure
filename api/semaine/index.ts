import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getCollectesSemaine } from '../lib/db-operations';
import { getSemaineEnCours } from '../lib/dateUtils';

export async function semaine(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request for semaine.');

  try {
    const { debut, fin } = getSemaineEnCours();
    const infoSemaine = await getCollectesSemaine(debut, fin);

    return {
      status: 200,
      jsonBody: {
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
      },
    };
  } catch (error) {
    context.error('Erreur lors de la récupération des collectes:', error);
    return {
      status: 500,
      jsonBody: {
        error: 'Erreur lors de la récupération des données de collecte',
        message: 'Impossible de charger les informations. Veuillez réessayer plus tard.',
      },
    };
  }
}

app.http('semaine', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'semaine',
  handler: semaine,
});
