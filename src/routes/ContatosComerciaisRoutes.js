const express = require('express');
const ContatoComercialController = require('../controllers/ContatoComercialController.js');
const router = express.Router();

router.get('/', ContatoComercialController.indexAll);
router.get('/:id_contrato', ContatoComercialController.index);
router.post('/', ContatoComercialController.store);
router.put('/:id', ContatoComercialController.update);
router.delete('/:id', ContatoComercialController.delete);

module.exports = router;