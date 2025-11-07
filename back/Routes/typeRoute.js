import * as typeController from '../Controllers/typeController.js';
import express from 'express';
const router = express.Router();

router.post('/addType', typeController.addType);
router.get('/allType', typeController.getAllType);
router.put('/updateType/:idType', typeController.updateType);
router.get('/typeById/:idType', typeController.getTypeById);
router.delete('/deleteType/:idType', typeController.deleteType);

export default router;