import connexion from "../config/bdd.js";

export const addType = async (libelle) => {
    const query = `
    INSERT INTO typecarte (libelleType)
    VALUES (?)`;
    const [result] = await connexion.query(query, [libelle]);
    return result;
};

export const getAllType = async () => {
    const query = `
    SELECT idType, libelleType FROM typecarte;
    `;

    const [result]= await connexion.query(query);

    return result;
};

export const updateType = async (libelle, idType) => {
    const query = `
    UPDATE typecarte
    SET libelleType = ?
    WHERE idType = ?;
    `;

    const [result] = await connexion.query(query, [libelle, idType]);

    return result;
};

export const getTypeById = async (idType) => {
    const query = `
    SELECT idType, libelleType FROM typecarte WHERE idType = ?;
    `;

    const [result] = await connexion.query(query,[idType]);

    return result;
};

export const deleteType = async (idType) => {
    const deleteType = `
    DELETE FROM typecarte
    WHERE idType = ?;`;

    const [result] = await connexion.query(deleteType, [idType]);

    return result;
};