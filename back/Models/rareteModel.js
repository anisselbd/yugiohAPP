import connexion from "../config/bdd.js";

export const addRarete = async (rareteName) => {
    const query = `
    INSERT INTO raretecarte (libelleRarete)
    VALUES (?)`;
    const [result] = await connexion.query(query, [rareteName]);
    return result;
};

export const getRaretes = async () => {
    const query = `
    SELECT * FROM raretecarte`;
    const [rows] = await connexion.query(query);
    return rows;
};
