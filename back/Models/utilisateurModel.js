import connexion from "../config/bdd.js";

// fonction pour récupérer tous les utilisateurs
export const getAllUtilisateurs = async () => {
    // requête SQL pour sélectionner tous les utilisateurs
    const selectAllUtilisateurs = "SELECT idUtilisateur, nom, prenom, email, pseudo, dateInscription, idRole FROM utilisateur;";
    // exécution de la requête et récupération de la réponse
    const [response] = await connexion.query(selectAllUtilisateurs);
    // retour de la réponse
    return response;
};

export const getInfoUtilisateur = async () => {
    const selectInfoUtilisateur = `
    SELECT u.nom, u.prenom, r.libelleRole
    FROM utilisateur u
    INNER JOIN roleutilisateur r ON u.idRole = r.idRole;`;
    const [response] = await connexion.query(selectInfoUtilisateur);
    return response;
};

// fonction pour récupérer un utilisateur par son ID, passé en paramètre
export const getUtilisateurById = async (id) => {
    // requête SQL préparée pour sélectionner un utilisateur par son ID
    const selectUtilisateurById = `
    SELECT nom, prenom, email, pseudo, idRole
    FROM utilisateur 
    WHERE idUtilisateur = ?;`;
    // exécution de la requête avec l'ID en paramètre et récupération de la réponse
    const [response] = await connexion.query(selectUtilisateurById, [id]);
    // retour de la réponse
    return response;
};

export const addUtilisateur = async (nom, prenom, email, motDePasse, pseudo) => {
    const insertUtilisateur = `
    INSERT INTO utilisateur (nom, prenom, email, motDePasse, pseudo, idRole)
    VALUES (?,?,?,?,?,?);
    `
    // rôle par défaut: joueur (idRole = 1)
    const [result] = await connexion.query(insertUtilisateur,[nom, prenom, email, motDePasse, pseudo, 1]);

    return result;
};

export const updateUtilisateur = async (nom, prenom, email, pseudo, motDePasse, idUtilisateur) => {
    const updateUtilisateur = `
    UPDATE utilisateur
    SET nom = ?, prenom = ?, email = ?, pseudo = ?, motDePasse = ?
    WHERE idUtilisateur = ?;
    `;

    const [result] = await connexion.query(updateUtilisateur, [nom, prenom, email, pseudo, motDePasse, idUtilisateur]);

    return result;
};

export const deleteUtilisateur = async (idUtilisateur) => {
    const deleteUtilisateur = `
    DELETE FROM utilisateur
    WHERE idUtilisateur = ?; 
    `;
    const [result] = await connexion.query(deleteUtilisateur,[idUtilisateur]);

    return result;
};

export const getUtilisateurByEmail = async (email) => {
    const query = `
    SELECT idUtilisateur, email, motDePasse, pseudo, idRole
    FROM utilisateur
    WHERE email = ?;
    `;
    const [rows] = await connexion.query(query, [email]);
    return rows;
};