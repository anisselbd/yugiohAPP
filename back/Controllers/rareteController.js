import * as rareteModel from '../Models/rareteModel.js';

export const addRarete = async (req, res) => {
    try {
        const { libelleRarete } = req.body;
        const result = await rareteModel.addRarete(libelleRarete);
        res.status(201).json({ message: "Rareté ajoutée avec succès", data: result });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la rareté", error });
    }
};

export const getRaretes = async (req, res) => {
    try {
        const raretes = await rareteModel.getRaretes();
        res.status(200).json(raretes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des raretés", error });
    }
};
