import type { InfoSemaine, Collecte, JourFerie } from '@/types/collecte';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get collections for the current week
 */
export async function getCollectesSemaine(): Promise<InfoSemaine> {
  const data = await fetchApi<{
    debut: string;
    fin: string;
    collectes: Array<{ date: string } & Omit<Collecte, 'date'>>;
    aCollecteJaune: boolean;
    aCollecteGrise: boolean;
  }>('/api/semaine');

  return {
    debut: new Date(data.debut),
    fin: new Date(data.fin),
    collectes: data.collectes.map((c) => ({
      ...c,
      date: new Date(c.date),
    })),
    aCollecteJaune: data.aCollecteJaune,
    aCollecteGrise: data.aCollecteGrise,
  };
}

/**
 * Get collections for a specific month
 */
export async function getCollectesMois(
  mois: number,
  annee?: number
): Promise<{ collectes: Collecte[]; joursFeries: JourFerie[] }> {
  const yearParam = annee ? `?annee=${annee}` : '';
  const data = await fetchApi<{
    collectes: Array<{ date: string } & Omit<Collecte, 'date'>>;
    joursFeries: Array<{ date: string } & Omit<JourFerie, 'date'>>;
  }>(`/api/calendrier/${mois}${yearParam}`);

  return {
    collectes: data.collectes.map((c) => ({
      ...c,
      date: new Date(c.date),
    })),
    joursFeries: data.joursFeries.map((f) => ({
      ...f,
      date: new Date(f.date),
    })),
  };
}

/**
 * Get holidays for a specific year
 */
export async function getJoursFeries(annee: number): Promise<JourFerie[]> {
  const data = await fetchApi<Array<{ date: string } & Omit<JourFerie, 'date'>>>(
    `/api/jours-feries/${annee}`
  );

  return data.map((f) => ({
    ...f,
    date: new Date(f.date),
  }));
}

/**
 * Get next collection
 */
export async function getProchaineCollecte(
  type?: 'jaune' | 'gris'
): Promise<Collecte | null> {
  try {
    const typeParam = type ? `?type=${type}` : '';
    const data = await fetchApi<{ date: string } & Omit<Collecte, 'date'>>(
      `/api/prochaine-collecte${typeParam}`
    );

    return {
      ...data,
      date: new Date(data.date),
    };
  } catch {
    return null;
  }
}
