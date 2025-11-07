import * as collectionModel from "../Models/collectionModel.js";

export const getCollections = async (req, res) => {
  try {
    const { userId } = req.params;
    const collections = await collectionModel.getCollectionsByUserId(userId);

    res.status(200).json(collections);
  } catch (error) {
    console.error("Erreur lors de la récupération des collections :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { idUtilisateur, nomCollection } = req.body;
    const result = await collectionModel.createCollection(idUtilisateur, nomCollection);
    res.status(201).json({ message: 'Collection créée', idCollection: result.insertId });
  } catch (error) {
    console.error("Erreur lors de la création de la collection:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const addCarte = async (req, res) => {
  try {
    const { idCollection } = req.params;
    const { idCarte, dateAcquisition } = req.body;
    await collectionModel.addCarteToCollection(idCollection, idCarte, dateAcquisition || null);
    res.status(201).json({ message: 'Carte ajoutée à la collection' });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la carte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const removeCarte = async (req, res) => {
  try {
    const { idCollection, idCarte } = req.params;
    await collectionModel.removeCarteFromCollection(idCollection, idCarte);
    res.status(200).json({ message: 'Carte supprimée de la collection' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la carte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getCartes = async (req, res) => {
  try {
    const { idCollection } = req.params;
    const rows = await collectionModel.getCartesInCollection(idCollection);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes de la collection:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const setQuantite = async (req, res) => {
  try {
    const { idCollection, idCarte } = req.params;
    const { quantite } = req.body;
    await collectionModel.setCarteQuantiteInCollection(idCollection, idCarte, quantite);
    res.status(200).json({ message: 'Quantité définie' });
  } catch (error) {
    console.error("Erreur lors de la définition de la quantité:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const incrementQuantite = async (req, res) => {
  try {
    const { idCollection, idCarte } = req.params;
    const step = Number(req.body?.step || 1);
    await collectionModel.incrementCarteQuantite(idCollection, idCarte, step);
    res.status(200).json({ message: 'Quantité augmentée' });
  } catch (error) {
    console.error("Erreur lors de l'incrément:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const decrementQuantite = async (req, res) => {
  try {
    const { idCollection, idCarte } = req.params;
    const step = Number(req.body?.step || 1);
    await collectionModel.decrementCarteQuantite(idCollection, idCarte, step);
    res.status(200).json({ message: 'Quantité diminuée' });
  } catch (error) {
    console.error("Erreur lors de la décrémentation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};