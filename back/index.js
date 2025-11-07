// load environment variables from .env file
import 'dotenv/config.js';

// importation du module express
import express from 'express';
// importation de la connexion à la base de données
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

app.get('/cards/yugioh', (req, res) => {
    res.send('Voici les cartes Yu-Gi-Oh!');
});

// Middleware de gestion des erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack); // Log l'erreur pour le débogage côté serveur
    // Envoie une réponse d'erreur générique au client
    res.status(500).json({ message: "Une erreur interne du serveur est survenue." });
});

// Définition du port d'écoute, utilise la variable d'environnement PORT ou 3000 par défaut
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT} 🟢​`);
});