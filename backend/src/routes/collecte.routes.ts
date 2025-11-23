import { Router } from 'express';
import * as collecteController from '../controllers/collecte.controller';

const router = Router();

// GET /api/semaine - Get current week collections
router.get('/semaine', collecteController.getSemaine);

// GET /api/calendrier/:mois - Get month collections
router.get('/calendrier/:mois', collecteController.getCalendrier);

// GET /api/jours-feries/:annee - Get holidays for a year
router.get('/jours-feries/:annee', collecteController.getJoursFeries);

// GET /api/collecte/:date - Get collection for a specific date
router.get('/collecte/:date', collecteController.getCollecteByDate);

// GET /api/prochaine-collecte - Get next collection
router.get('/prochaine-collecte', collecteController.getProchaineCollecte);

export { router as collecteRoutes };
