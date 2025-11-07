import express from "express";
import * as collectionController from "../Controllers/collectionController.js";

const router = express.Router();

// Route pour récupérer les collections d'un utilisateur
router.get("/collections/:userId", collectionController.getCollections);
router.post("/collections", collectionController.createCollection);
router.get("/collections/:idCollection/cards", collectionController.getCartes);
router.post("/collections/:idCollection/cards", collectionController.addCarte);
router.delete("/collections/:idCollection/cards/:idCarte", collectionController.removeCarte);
router.put("/collections/:idCollection/cards/:idCarte", collectionController.setQuantite);
router.patch("/collections/:idCollection/cards/:idCarte/increment", collectionController.incrementQuantite);
router.patch("/collections/:idCollection/cards/:idCarte/decrement", collectionController.decrementQuantite);

export default router;