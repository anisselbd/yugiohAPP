import * as deckModel from "../Models/deckModel.js";

export const getDecks = async (req, res) => {
  try {
    const { userId } = req.params;
    const decks = await deckModel.getDecksByUserId(userId);
    console.log("Le deck a été récupéré avec succès ✅");
    res.status(200).json(decks);
  } catch (error) {
    console.error("Erreur lors de la récupération des decks :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createDeck = async (req, res) => {
  try {
    const { idUtilisateur, nom, description } = req.body;
    const result = await deckModel.createDeck(idUtilisateur, nom, description || null);
    res.status(201).json({ message: 'Deck créé', idDeck: result.insertId });
  } catch (error) {
    console.error("Erreur lors de la création du deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateDeck = async (req, res) => {
  try {
    const { idDeck } = req.params;
    const { nom, description } = req.body;
    await deckModel.updateDeck(idDeck, nom, description || null);
    res.status(200).json({ message: 'Deck mis à jour' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteDeck = async (req, res) => {
  try {
    const { idDeck } = req.params;
    await deckModel.deleteDeck(idDeck);
    res.status(200).json({ message: 'Deck supprimé' });
  } catch (error) {
    console.error("Erreur lors de la suppression du deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const addCarte = async (req, res) => {
  try {
    const { idDeck } = req.params;
    const { idCarte, quantite } = req.body;
    await deckModel.addCarteToDeck(idDeck, idCarte, quantite || 1);
    res.status(201).json({ message: 'Carte ajoutée au deck' });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la carte au deck :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const setCarteQuantite = async (req, res) => {
  try {
    const { idDeck, idCarte } = req.params;
    const { quantite } = req.body;
    await deckModel.setCarteQuantiteInDeck(idDeck, idCarte, quantite);
    res.status(200).json({ message: 'Quantité mise à jour' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const removeCarte = async (req, res) => {
  try {
    const { idDeck, idCarte } = req.params;
    await deckModel.removeCarteFromDeck(idDeck, idCarte);
    res.status(200).json({ message: 'Carte retirée du deck' });
  } catch (error) {
    console.error("Erreur lors du retrait de la carte :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getComposition = async (req, res) => {
  try {
    const { idDeck } = req.params;
    const rows = await deckModel.getDeckComposition(idDeck);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération de la composition :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};