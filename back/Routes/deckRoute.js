import express from "express";
import * as deckController from "../Controllers/deckController.js";

const router = express.Router();

// Route pour récupérer les decks d'un utilisateur
router.get("/decks/:userId", deckController.getDecks);
router.post("/decks", deckController.createDeck);
router.put("/decks/:idDeck", deckController.updateDeck);
router.delete("/decks/:idDeck", deckController.deleteDeck);
router.get("/decks/:idDeck/cartes", deckController.getComposition);
router.post("/decks/:idDeck/cartes", deckController.addCarte);
router.put("/decks/:idDeck/cartes/:idCarte", deckController.setCarteQuantite);
router.delete("/decks/:idDeck/cartes/:idCarte", deckController.removeCarte);

export default router;