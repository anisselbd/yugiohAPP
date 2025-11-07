import connexion from "../config/bdd.js";

export const addAttribut = async (attributName) => {
    const query = `
    INSERT INTO attributcarte (libelleAttribut)
    VALUES (?)`;
    const [result] = await connexion.query(query, [attributName]);
    return result;
};

export const getAttributs = async () => {
    const query = `
    SELECT * FROM attributcarte`;
    const [rows] = await connexion.query(query);
    return rows;
};
