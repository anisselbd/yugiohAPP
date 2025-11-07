import * as typeModel from '../Models/typeModel.js';

export const addType = async (req, res) => {
    try {
        const { libelle } = req.body;
        const result = await typeModel.addType(libelle);
        res.status(201).json({ message: "Type ajouté avec succès", result });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du type", error });
    }
};

export const getAllType = async (req, res) => {
    try {
        const result = await typeModel.getAllType();
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
    }
};

export const updateType = async (req,res) => {
    const {libelle} = req.body;
    const idType = req.params.idType;

    console.log(libelle, idType);

    try {

        const existant = await typeModel.getTypeById(idType);

        if (existant.length === 0) {
            return res.status(404).json({message: "Type non trouvé"});
        } else {

        const result = await typeModel.updateType(libelle, idType);
        res.status(200).json({message: "type modifié", result});
        
    }
    } catch (error) {
        console.error(error);
    }
};

export const getTypeById = async (req, res) => {
    const idType = req.params.idType;

    try {
        const result = await typeModel.getTypeById(idType);
        res.status(200).json({result});
    } catch (error) {
        console.error(error);
    }
};

export const deleteType = async (req, res) => {
    const idType = req.params.idType;

    try {

        const existant = await typeModel.getTypeById(idType);

        if (existant.length === 0) {
            res.status(404).json({message: "Type non trouvé"});
        } else {
        const result = await typeModel.deleteType(idType);
        res.status(200).json({ message: "Type supprimé avec succès", result });
    }
    } catch (error) {
        console.error(error);
    }
};  