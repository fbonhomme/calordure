import { Request, Response, NextFunction } from 'express';
import * as collecteService from '../services/collecte.service';

/**
 * GET /api/semaine
 * Get collections for the current week
 */
export async function getSemaine(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const infoSemaine = await collecteService.getCollectesSemaine();
    res.json(infoSemaine);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/calendrier/:mois
 * Get collections for a specific month
 */
export async function getCalendrier(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const mois = parseInt(req.params.mois, 10);
    const annee = req.query.annee
      ? parseInt(req.query.annee as string, 10)
      : new Date().getFullYear();

    if (isNaN(mois) || mois < 1 || mois > 12) {
      res.status(400).json({
        error: 'Invalid month',
        message: 'Month must be a number between 1 and 12',
      });
      return;
    }

    const infoMois = await collecteService.getCollectesMois(annee, mois);
    res.json({
      collectes: infoMois.collectes,
      joursFeries: infoMois.joursFeries,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/jours-feries/:annee
 * Get holidays for a specific year
 */
export async function getJoursFeries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const annee = parseInt(req.params.annee, 10);

    if (isNaN(annee) || annee < 2000 || annee > 2100) {
      res.status(400).json({
        error: 'Invalid year',
        message: 'Year must be a number between 2000 and 2100',
      });
      return;
    }

    const joursFeries = await collecteService.getJoursFeries(annee);
    res.json(joursFeries);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/collecte/:date
 * Get collection for a specific date
 */
export async function getCollecteByDate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      res.status(400).json({
        error: 'Invalid date',
        message: 'Date must be in ISO format (YYYY-MM-DD)',
      });
      return;
    }

    const collecte = await collecteService.getCollecteParDate(date);

    if (!collecte) {
      res.status(404).json({
        error: 'Not found',
        message: 'No collection found for this date',
      });
      return;
    }

    res.json(collecte);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/prochaine-collecte
 * Get the next collection
 */
export async function getProchaineCollecte(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const type = req.query.type as 'jaune' | 'gris' | undefined;

    if (type && type !== 'jaune' && type !== 'gris') {
      res.status(400).json({
        error: 'Invalid type',
        message: 'Type must be "jaune" or "gris"',
      });
      return;
    }

    const collecte = await collecteService.getProchainCollecte(type);

    if (!collecte) {
      res.status(404).json({
        error: 'Not found',
        message: 'No upcoming collection found',
      });
      return;
    }

    res.json(collecte);
  } catch (error) {
    next(error);
  }
}
