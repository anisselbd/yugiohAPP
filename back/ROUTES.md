## Routes de l'API Yu-Gi-Oh! Manager

Base URL: `/api`

### Accueil / Test
- GET `/` → Retourne un simple message de test (Hello pierre).

### Utilisateurs
- GET `/api/allUtilisateurs`
  - Description: Liste tous les utilisateurs (colonnes publiques seulement).
- GET `/api/infoUtilisateur`
  - Description: Liste (nom, prénom, rôle) via jointure sur `roleutilisateur`.
- GET `/api/utilisateurById/:id`
  - Params: `id` (path)
  - Description: Détails d’un utilisateur.
- POST `/api/addUtilisateur`
  - Body JSON: `{ nom, prenom, email, motDePasse, pseudo }`
  - Description: Crée un utilisateur (rôle par défaut: joueur).
- PUT `/api/updateUtilisateur/:id`
  - Params: `id` (path)
  - Body JSON: `{ nom, prenom, email, pseudo, motDePasse }`
  - Description: Met à jour un utilisateur.
- DELETE `/api/deleteUtilisateur/:id`
  - Params: `id` (path)
  - Description: Supprime un utilisateur.

### Cartes
- GET `/api/allCartes`
  - Query (optionnels, pour recherche/filtrage/pagination):
    - `q` (recherche texte sur nom/description)
    - `idType`, `idRarete`, `codeEdition`
    - `minATK`, `maxATK`, `minDEF`, `maxDEF`
    - `page` (par défaut 1), `limit` (par défaut 20)
  - Description: 
    - Sans query → liste brute
    - Avec query → renvoie `{ total, page, limit, data }` filtrés.
- GET `/api/carteById/:id`
  - Params: `id` (path)
  - Description: Détails d’une carte, avec types/libellés joints.
- POST `/api/addCarte`
  - Body JSON: `{ nom, description, idType, idAttribut, niveau, attaque, defense, idRarete, imageUrl, codeEdition }`
  - Description: Crée une nouvelle carte.

### Types
- POST `/api/addType`
  - Body JSON: `{ libelle }`
  - Description: Ajoute un type de carte.
- GET `/api/allType`
  - Description: Liste des types.
- PUT `/api/updateType/:idType`
  - Params: `idType` (path)
  - Body JSON: `{ libelle }`
  - Description: Met à jour un type.
- GET `/api/typeById/:idType`
  - Params: `idType` (path)
  - Description: Détails d’un type.
- DELETE `/api/deleteType/:idType`
  - Params: `idType` (path)
  - Description: Supprime un type.

### Attributs
- POST `/api/addAttribut`
  - Body JSON: `{ libelle }`
  - Description: Ajoute un attribut (ex: FEU, EAU...).

### Raretés
- POST `/api/addRarete`
  - Body JSON: `{ libelleRarete }`
  - Description: Ajoute une rareté (ex: Commune, Ultra Rare...).

### Éditions
- POST `/api/addEdition`
  - Body JSON: `{ codeEdition, nomEdition, dateSortie, fabricant }`
  - Description: Ajoute une édition (ex: LOB, MRD...).

### Collections (par utilisateur)
- GET `/api/collections/:userId`
  - Params: `userId` (path)
  - Description: Liste des collections d’un utilisateur.
- POST `/api/collections`
  - Body JSON: `{ idUtilisateur, nomCollection }`
  - Description: Crée une collection.
- GET `/api/collections/:idCollection/cards`
  - Params: `idCollection` (path)
  - Description: Liste des cartes d’une collection (avec libellés).
- POST `/api/collections/:idCollection/cards`
  - Params: `idCollection` (path)
  - Body JSON: `{ idCarte, dateAcquisition? }`
  - Description: Ajoute une carte à la collection. Si déjà présente, incrémente `quantite` de +1.
- DELETE `/api/collections/:idCollection/cards/:idCarte`
  - Params: `idCollection`, `idCarte` (path)
  - Description: Retire totalement la carte de la collection.
- PUT `/api/collections/:idCollection/cards/:idCarte`
  - Params: `idCollection`, `idCarte` (path)
  - Body JSON: `{ quantite }`
  - Description: Définit explicitement la quantité.
- PATCH `/api/collections/:idCollection/cards/:idCarte/increment`
  - Params: `idCollection`, `idCarte` (path)
  - Body JSON: `{ step? }` (défaut 1)
  - Description: Incrémente la quantité.
- PATCH `/api/collections/:idCollection/cards/:idCarte/decrement`
  - Params: `idCollection`, `idCarte` (path)
  - Body JSON: `{ step? }` (défaut 1)
  - Description: Décrémente la quantité (supprime la ligne si 0).

Note SQL pour la quantité dans `collectioncarte`:
```sql
ALTER TABLE collectioncarte ADD quantite INT NOT NULL DEFAULT 1;
```

### Decks (par utilisateur)
- GET `/api/decks/:userId`
  - Params: `userId` (path)
  - Description: Liste les decks d’un utilisateur.
- POST `/api/decks`
  - Body JSON: `{ idUtilisateur, nom, description? }`
  - Description: Crée un deck.
- PUT `/api/decks/:idDeck`
  - Params: `idDeck` (path)
  - Body JSON: `{ nom, description? }`
  - Description: Met à jour un deck.
- DELETE `/api/decks/:idDeck`
  - Params: `idDeck` (path)
  - Description: Supprime un deck.
- GET `/api/decks/:idDeck/cartes`
  - Params: `idDeck` (path)
  - Description: Récupère la composition du deck.
- POST `/api/decks/:idDeck/cartes`
  - Params: `idDeck` (path)
  - Body JSON: `{ idCarte, quantite? }` (défaut +1)
  - Description: Ajoute une carte au deck (ou augmente la quantité).
- PUT `/api/decks/:idDeck/cartes/:idCarte`
  - Params: `idDeck`, `idCarte` (path)
  - Body JSON: `{ quantite }`
  - Description: Définit la quantité d’une carte dans le deck.
- DELETE `/api/decks/:idDeck/cartes/:idCarte`
  - Params: `idDeck`, `idCarte` (path)
  - Description: Retire la carte du deck.

---
Remarques:
- Les réponses sont au format JSON. En cas d’erreur serveur, le code 500 est renvoyé avec `{ message }`.
- Les noms de colonnes/libellés renvoyés suivent le schéma de la base (ex: `libelleType`, `libelleAttribut`, `libelleRarete`, `nomEdition`).


