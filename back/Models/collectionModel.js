import connexion from "../config/bdd.js";

export const getCollectionsByUserId = async (userId) => {
    const query = `
    SELECT c.idCollection, c.nomCollection              
    FROM collection c               
    WHERE c.idUtilisateur = ?`;
    const [rows] = await connexion.query(query, [userId]);

  return rows;
};

export const createCollection = async (idUtilisateur, nomCollection) => {
  const query = `INSERT INTO collection (idUtilisateur, nomCollection) VALUES (?, ?)`;
  const [res] = await connexion.query(query, [idUtilisateur, nomCollection]);
  return res;
};

export const addCarteToCollection = async (idCollection, idCarte, dateAcquisition = null) => {
  const query = `INSERT INTO collectioncarte (idCollection, idCarte, dateAcquisition, quantite) VALUES (?, ?, ?, 1)
                 ON DUPLICATE KEY UPDATE quantite = quantite + 1`;
  const [res] = await connexion.query(query, [idCollection, idCarte, dateAcquisition]);
  return res;
};

export const removeCarteFromCollection = async (idCollection, idCarte) => {
  const query = `DELETE FROM collectioncarte WHERE idCollection = ? AND idCarte = ?`;
  const [res] = await connexion.query(query, [idCollection, idCarte]);
  return res;
};

export const getCartesInCollection = async (idCollection) => {
  const query = `
  SELECT c.idCarte, c.nom, c.imageUrl, r.libelleRarete, e.nomEdition, t.libelleType
  FROM collectioncarte cc
  INNER JOIN carte c ON cc.idCarte = c.idCarte
  INNER JOIN raretecarte r ON c.idRarete = r.idRarete
  INNER JOIN edition e ON c.codeEdition = e.codeEdition
  INNER JOIN typecarte t ON c.idType = t.idType
  WHERE cc.idCollection = ?`;
  const [rows] = await connexion.query(query, [idCollection]);
  return rows;
};

export const setCarteQuantiteInCollection = async (idCollection, idCarte, quantite) => {
  const query = `UPDATE collectioncarte SET quantite = ? WHERE idCollection = ? AND idCarte = ?`;
  const [res] = await connexion.query(query, [quantite, idCollection, idCarte]);
  return res;
};

export const incrementCarteQuantite = async (idCollection, idCarte, step = 1) => {
  const query = `INSERT INTO collectioncarte (idCollection, idCarte, quantite)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantite = quantite + VALUES(quantite)`;
  const [res] = await connexion.query(query, [idCollection, idCarte, step]);
  return res;
};

export const decrementCarteQuantite = async (idCollection, idCarte, step = 1) => {
  // Réduit la quantité sans descendre sous 0; supprime la ligne si 0
  const decQuery = `UPDATE collectioncarte SET quantite = GREATEST(quantite - ?, 0) WHERE idCollection = ? AND idCarte = ?`;
  const [res] = await connexion.query(decQuery, [step, idCollection, idCarte]);
  const cleanupQuery = `DELETE FROM collectioncarte WHERE idCollection = ? AND idCarte = ? AND quantite = 0`;
  await connexion.query(cleanupQuery, [idCollection, idCarte]);
  return res;
};