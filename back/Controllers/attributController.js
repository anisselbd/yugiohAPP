import * as attributModel from '../Models/attributModel.js';

export const addAttribut = async (req, res) => {
    try {
        const {libelle} = req.body;
        const result = await attributModel.addAttribut(libelle);
        res.status(201).json({ message: "Attribut ajouté avec succès", data: result });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'attribut", error });
    }
};
export const getAttributs = async (req, res) => {
    try {
        const attributs = await attributModel.getAttributs();
        res.status(200).json(attributs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des attributs", error });
    }
};
