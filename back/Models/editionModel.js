import connexion from "../config/bdd.js";

export const addEdition = async (codeEdition, nomEdition, dateSortie, fabricant) => {
    const query = `
    INSERT INTO edition (codeEdition, nomEdition, dateSortie, fabricant)
    VALUES (?, ?, ?, ?)`;
    const [result] = await connexion.query(query, [codeEdition, nomEdition, dateSortie, fabricant]);
    return result;
};
export const getEditions = async () => {
    const query = `
    SELECT * FROM edition`;
    const [rows] = await connexion.query(query);
    return rows;
};
