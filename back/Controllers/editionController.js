import * as editionModel from '../Models/editionModel.js';

export const addEdition = async (req, res) => {
    try {
        const { codeEdition, nomEdition, dateSortie, fabricant } = req.body;
        const result = await editionModel.addEdition(codeEdition, nomEdition, dateSortie, fabricant);
        res.status(201).json({ message: "Édition ajoutée avec succès", data: result });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'édition", error });
    }
};
export const getEditions = async (req, res) => {
    try {
        const editions = await editionModel.getEditions();
        res.status(200).json(editions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des éditions", error });
    }
};
