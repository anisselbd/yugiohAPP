import connexion from "../config/bdd.js";

export const getAllCartes = async () => {
    const selectAllCartes = `
    SELECT c.idCarte,
           c.nom AS carteNom,
           c.description,
           c.imageUrl,
           r.libelleRarete AS rarete,
           e.nomEdition,
           a.libelleAttribut AS attribut,
           t.libelleType AS type,
           c.attaque,
           c.defense,
           c.niveau
    FROM carte c
    INNER JOIN raretecarte r ON c.idRarete = r.idRarete
    INNER JOIN edition e ON c.codeEdition = e.codeEdition
    LEFT JOIN attributcarte a ON c.idAttribut = a.idAttribut
    INNER JOIN typecarte t ON c.idType = t.idType;
    `;

    const [result] = await connexion.query(selectAllCartes);
    return result;
}

export const getCarteById = async (id) => {
    const selectCarteById = `
    SELECT c.idCarte,
           c.nom,
           c.description,
           c.imageUrl,
           r.libelleRarete AS rarete,
           e.nomEdition,
           a.libelleAttribut AS attribut,
           t.libelleType AS type,
           c.attaque,
           c.defense,
           c.niveau
    FROM carte c
    INNER JOIN raretecarte r ON c.idRarete = r.idRarete
    INNER JOIN edition e ON c.codeEdition = e.codeEdition
    LEFT JOIN attributcarte a ON c.idAttribut = a.idAttribut
    INNER JOIN typecarte t ON c.idType = t.idType
    WHERE c.idCarte = ?;
    `;

    const [result] = await connexion.query(selectCarteById, [id]);
    return result;
}


export const addCarte = async (nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition) => {
    const insertCarte = `
    INSERT INTO carte(nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [result] = await connexion.query(insertCarte, [nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition])
    return result;
    
}

export const searchCartes = async ({ q, idType, idRarete, codeEdition, minATK, maxATK, minDEF, maxDEF, page = 1, limit = 20 }) => {
    const where = [];
    const params = [];
    if (q) {
        where.push('(c.nom LIKE ? OR c.description LIKE ?)');
        params.push(`%${q}%`, `%${q}%`);
    }
    if (idType) { where.push('c.idType = ?'); params.push(idType); }
    if (idRarete) { where.push('c.idRarete = ?'); params.push(idRarete); }
    if (codeEdition) { where.push('c.codeEdition = ?'); params.push(codeEdition); }
    if (minATK) { where.push('c.attaque >= ?'); params.push(minATK); }
    if (maxATK) { where.push('c.attaque <= ?'); params.push(maxATK); }
    if (minDEF) { where.push('c.defense >= ?'); params.push(minDEF); }
    if (maxDEF) { where.push('c.defense <= ?'); params.push(maxDEF); }

    const offset = (Number(page) - 1) * Number(limit);

    const baseSelect = `
    SELECT c.idCarte, c.nom AS carteNom, c.description, c.imageUrl,
           r.libelleRarete AS rarete, e.nomEdition, a.libelleAttribut AS attribut,
           t.libelleType AS type, c.attaque, c.defense, c.niveau
    FROM carte c
    INNER JOIN raretecarte r ON c.idRarete = r.idRarete
    INNER JOIN edition e ON c.codeEdition = e.codeEdition
    LEFT JOIN attributcarte a ON c.idAttribut = a.idAttribut
    INNER JOIN typecarte t ON c.idType = t.idType`;

    const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';

    const dataSql = `${baseSelect}${whereSql} ORDER BY c.idCarte DESC LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM carte c${whereSql}`;

    const [countRows] = await connexion.query(countSql, params);
    const total = countRows[0]?.total || 0;
    const [rows] = await connexion.query(dataSql, [...params, Number(limit), offset]);

    return { total, page: Number(page), limit: Number(limit), data: rows };
};

export const deleteCarte = async (id) => {
    const deleteSql = `
    DELETE FROM carte WHERE idCarte = ?`;
    const [result] = await connexion.query(deleteSql, [id]);
    return result;
};

export const updateCarte = async (id, nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition) => {
    const updateSql = `
    UPDATE carte
    SET nom = ?, description = ?, idType = ?, idAttribut = ?, niveau = ?, attaque = ?, defense = ?, idRarete = ?, imageUrl = ?, codeEdition = ?
    WHERE idCarte = ?`;
    const [result] = await connexion.query(updateSql, [nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition, id]);
    return result;
};