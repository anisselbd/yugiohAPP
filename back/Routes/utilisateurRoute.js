import * as utilisateurController from '../Controllers/utilisateurController.js';
// importation du module express
import express from "express";
// création du routeur qui permet de définir et de gérer des routes
const router = express.Router();
// définition de la route pour récupérer tous les utilisateurs
router.get('/allUtilisateurs', utilisateurController.getUtilisateurs);
// définition de la route pour récupérer les informations des utilisateurs
router.get('/infoUtilisateur', utilisateurController.getInfoUtilisateur);
// définition de la route pour récupérer un utilisateur par son ID (requete avec paramètre)
router.get('/utilisateurById/:id', utilisateurController.getUtilisateurById);
// définition de la route pour ajouter un utilisateur
router.post('/addUtilisateur', utilisateurController.addUtilisateur);
// définition de la route pour mettre à jour un utilisateur
router.put('/updateUtilisateur/:id', utilisateurController.updateUtilisateur);
// définition de la route pour supprimer un utilisateur
router.delete('/deleteUtilisateur/:id', utilisateurController.deleteUtilisateur);
export default router;