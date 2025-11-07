import * as utilisateurModel from '../Models/utilisateurModel.js';
// importation de bcrypt pour le hachage des mots de passe
import bcrypt from 'bcryptjs';

// fonction pour récupérer tous les utilisateurs
export const getUtilisateurs = async (req, res) => {

    try {
        // appel du modèle pour récupérer les utilisateurs
        const utilisateurs = await utilisateurModel.getAllUtilisateurs();
        // envoi de la réponse avec les utilisateurs récupérés
        res.status(200).json(utilisateurs);
        
    } catch (error) {
        // gestion des erreurs
        console.error("une erreur est survenue", error);
        
    }
};

export const getInfoUtilisateur = async (req, res) => {
    try {
        const infoUtilisateur = await utilisateurModel.getInfoUtilisateur();
        res.status(200).json(infoUtilisateur);     
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des informations utilisateur.", error: error.message }); // Toujours envoyer une réponse
    }
};

export const getUtilisateurById = async (req, res) => {

    const id = req.params.id;

    try {
        const utilisateurById = await utilisateurModel.getUtilisateurById(id);
        res.status(200).json(utilisateurById);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur par ID.", error: error.message }); // Toujours envoyer une réponse
    }
};

export const addUtilisateur = async (req,res) => {

    // récupération des données du corps de la requête
    const {nom, prenom, email, motDePasse, pseudo} = req.body;

    try {

        // hachage du mot de passe avant de le stocker
        const mdpHash = bcrypt.hashSync(motDePasse, 10);
// appel du modèle pour ajouter l'utilisateur avec le mot de passe haché
        const utilisateur = await utilisateurModel.addUtilisateur(nom, prenom, email, mdpHash, pseudo);
        res.status(201).json({message: "utilisateur créé", utilisateur});
    } catch (error) { // Gestion des erreurs
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur.", error: error.message }); // Toujours envoyer une réponse
    }
};

export const updateUtilisateur = async (req,res) => {

    const {nom, prenom, email, pseudo, motDePasse} = req.body;
    const idUtilisateur = req.params.id;

    try {
// vérifier si l'utilisateur existe avant de le mettre à jour
        const existant = await utilisateurModel.getUtilisateurById(idUtilisateur);
// si l'utilisateur n'existe pas, renvoyer une erreur 404
        if (existant.length === 0){
// utilisateur non trouvé
            res.status(404).json({message: "utilisateur inconnu"})

        } else {
// hachage du nouveau mot de passe
        const mdpHash = bcrypt.hashSync(motDePasse, 10);
// mise à jour de l'utilisateur
        const updatedUtilisateur = await utilisateurModel.updateUtilisateur(nom, prenom, email, pseudo, mdpHash, idUtilisateur);
// réponse de succès
        res.status(200).json({message: "utilisateur modifié", updatedUtilisateur});
        }
    } catch (error) {
        // Gestion des erreurs renvoi une réponse 500
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur.", error: error.message }); // Toujours envoyer une réponse
    }
};

export const deleteUtilisateur = async (req, res) => {

    const idUtilisateur = req.params.id;

    try {

        const existant = await utilisateurModel.getUtilisateurById(idUtilisateur);

        if(existant.length === 0){
            res.status(404).json({message: "utilisateur inconnu"});
        } else {
            const deletedUtilisateur = await utilisateurModel.deleteUtilisateur(idUtilisateur);

            res.status(200).json({message: "utilisateur supprimé", deletedUtilisateur});
        }
        
    } catch (error) { // Gestion des erreurs
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur.", error: error.message }); // Toujours envoyer une réponse
    }
}