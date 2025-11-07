import axios from "axios";

// Base URL configurable via .env (VITE_API_BASE_URL), avec fallback local pour le dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Liste toutes les cartes
function getAllCarte() {
  return httpClient.get("/allCartes");
}

// Récupère le détail d'une carte par son identifiant
function getCarteById(idCarte) {
  return httpClient.get(`/carte/${idCarte}`);
}

// Création de carte – compatible ancien appel positionnel et nouvel objet payload
function CreateCarte(payloadOrNom, ...rest) {
  const payload =
    typeof payloadOrNom === "object" && payloadOrNom !== null
      ? payloadOrNom
      : {
          nom: payloadOrNom,
          description: rest[0],
          idType: rest[1],
          attaque: rest[2],
          defense: rest[3],
          imageUrl: rest[4],
          idAttribut: rest[5],
          niveau: rest[6],
          idRarete: rest[7],
          codeEdition: rest[8],
        };

  return httpClient.post("/addCarte", payload);
}

// Suppression d'une carte
function DeleteCarte(idCarte) {
  return httpClient.delete(`/deleteCarte/${idCarte}`);
}

// Mise à jour d'une carte – accepte objet payload ou liste d'arguments
function UpdateCarte(idCarte, payloadOrNomCarte, ...rest) {
  const payload =
    typeof payloadOrNomCarte === "object" && payloadOrNomCarte !== null
      ? payloadOrNomCarte
      : {
          nomCarte: payloadOrNomCarte,
          description: rest[0],
          idType: rest[1],
          attaque: rest[2],
          defense: rest[3],
          imageUrl: rest[4],
          idAttribut: rest[5],
          niveau: rest[6],
          idRarete: rest[7],
          codeEdition: rest[8],
        };

  return httpClient.put(`/updateCarte/${idCarte}`, payload);
}

export default {
  getAllCarte,
  getCarteById,
  CreateCarte,
  DeleteCarte,
  UpdateCarte,
};