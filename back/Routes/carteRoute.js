import * as carteController from "../Controllers/carteController.js";

import express from "express";
const router = express.Router();
router.get('/allCartes', carteController.getAllCartes);
router.get('/carteById/:id', carteController.getCarteById);
// route post pour envoyer les informations d'une carte
router.post('/addCarte', carteController.addCarte);
router.delete('/deleteCarte/:id', carteController.deleteCarte);
router.put('/updateCarte/:id', carteController.updateCarte);
export default router;