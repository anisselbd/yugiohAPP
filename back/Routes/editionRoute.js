import * as editionController from '../Controllers/editionController.js';
import express from 'express';
const router = express.Router();

router.post('/addEdition', editionController.addEdition);
router.get('/editions', editionController.getEditions);

export default router;