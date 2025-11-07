// importation du module express
import express from 'express';
// importation de la connexion à la base de données
import connexion from './config/bdd.js';
// importation des routes utilisateurs
import utilisateurRoutes from './Routes/utilisateurRoute.js';
import carteRoutes from './Routes/carteRoute.js';
import collectionRoutes from './Routes/collectionRoute.js';
import deckRoutes from './Routes/deckRoute.js';
import attributRoutes from './Routes/attributRoute.js';
import editionRoutes from './Routes/editionRoute.js';
import rareteRoutes from './Routes/rareteRoute.js';
import typeRoutes from './Routes/typeRoute.js';

import cors from 'cors';

// création de l'application express
const app = express();
// middleware pour autoriser les requêtes cross-origin
app.use(cors());
// middleware pour utiliser le format JSON
app.use(express.json());

// utilisation des routes avec le préfixe /api
app.use('/api',
    utilisateurRoutes,
    carteRoutes,
    collectionRoutes,
    deckRoutes,
    attributRoutes,
    editionRoutes,
    rareteRoutes,
    typeRoutes
);

// définition de la route pour l'URL /accueil
app.get('/', (req, res) => {
    // envoi de la réponse "Hello World"
    res.send('Hello pierre');
});

// définition de la route pour l'URL /users
// mauvaise méthode
app.get('/users', async (req, res) => {
    try{
        // exécution de la requête SQL pour récupérer tous les utilisateurs
    const [utilisateurs] = await connexion.query("SELECT * FROM utilisateur");
    // envoi de la réponse avec les utilisateurs récupérés
    res.status(200).json({message: "Utilisateurs récupérés avec succès", utilisateurs});
    }catch(error){
        // si une erreur survient, on l'affiche dans la console
        console.error("Erreur lors de la récupération des utilisateurs:", error);
    }

});

app.get('/cards/yugioh', (req, res) => {
    res.send('Voici les cartes Yu-Gi-Oh!');
});

// démarrage du serveur sur le port 3000
app.listen(3000, () => {
    // message dans la console lorsque le serveur est démarré
    console.log('Serveur démarré sur le port 3000 🟢​');
});