import *  as rareteController from '../Controllers/rareteController.js';
import express from 'express';
const router = express.Router();

router.post('/addRarete', rareteController.addRarete);
router.get('/raretes', rareteController.getRaretes);

export default router;