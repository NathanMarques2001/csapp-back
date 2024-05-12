const express = require('express');
const FatosImportantesController = require('../controllers/FatosImportantesController.js');
const router = express.Router();

router.get('/', FatosImportantesController.indexAll);
router.get('/:id_contrato', FatosImportantesController.index);
router.post('/', FatosImportantesController.store);
router.put('/:id', FatosImportantesController.update);
router.delete('/:id', FatosImportantesController.delete);

module.exports = router;