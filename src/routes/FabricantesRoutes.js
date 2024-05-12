const express = require('express');
const FabricanteController = require('../controllers/FabricanteController.js');
const router = express.Router();

router.get('/', FabricanteController.indexAll);
router.post('/', FabricanteController.store);
router.put('/:id', FabricanteController.update);
router.delete('/:id', FabricanteController.delete);

module.exports = router;