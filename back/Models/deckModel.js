import connexion from "../config/bdd.js";

// Récupère tous les decks d'un utilisateur par son id
export const getDecksByUserId = async (userId) => {
  const query = `SELECT deck.idDeck, deck.nom, deck.description
                  FROM deck
                  WHERE deck.idUtilisateur = ?`;
  const [rows] = await connexion.query(query, [userId]);
  return rows;
};

export const createDeck = async (idUtilisateur, nom, description = null) => {
  const query = `INSERT INTO deck (nom, description, idUtilisateur) VALUES (?, ?, ?)`;
  const [res] = await connexion.query(query, [nom, description, idUtilisateur]);
  return res;
};

export const updateDeck = async (idDeck, nom, description = null) => {
  const query = `UPDATE deck SET nom = ?, description = ? WHERE idDeck = ?`;
  const [res] = await connexion.query(query, [nom, description, idDeck]);
  return res;
};

export const deleteDeck = async (idDeck) => {
  const query = `DELETE FROM deck WHERE idDeck = ?`;
  const [res] = await connexion.query(query, [idDeck]);
  return res;
};

export const addCarteToDeck = async (idDeck, idCarte, quantite = 1) => {
  const query = `INSERT INTO deckcarte (idDeck, idCarte, quantite) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantite = quantite + VALUES(quantite)`;
  const [res] = await connexion.query(query, [idDeck, idCarte, quantite]);
  return res;
};

export const setCarteQuantiteInDeck = async (idDeck, idCarte, quantite) => {
  const query = `UPDATE deckcarte SET quantite = ? WHERE idDeck = ? AND idCarte = ?`;
  const [res] = await connexion.query(query, [quantite, idDeck, idCarte]);
  return res;
};

export const removeCarteFromDeck = async (idDeck, idCarte) => {
  const query = `DELETE FROM deckcarte WHERE idDeck = ? AND idCarte = ?`;
  const [res] = await connexion.query(query, [idDeck, idCarte]);
  return res;
};

export const getDeckComposition = async (idDeck) => {
  const query = `
  SELECT c.idCarte, c.nom, dc.quantite
  FROM deckcarte dc
  INNER JOIN carte c ON c.idCarte = dc.idCarte
  WHERE dc.idDeck = ?`;
  const [rows] = await connexion.query(query, [idDeck]);
  return rows;
};