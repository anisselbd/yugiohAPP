import * as attributController from '../Controllers/attributController.js';
import express from 'express';
const router = express.Router();

router.post('/addAttribut', attributController.addAttribut);
router.get('/attributs', attributController.getAttributs);

export default router;