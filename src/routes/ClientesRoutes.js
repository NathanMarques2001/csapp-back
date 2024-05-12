const express = require('express');
const ClienteController = require('../controllers/ClienteController.js');
const router = express.Router();

router.get('/', ClienteController.indexAll);
router.get('/:id', ClienteController.index);
router.post('/', ClienteController.store);
router.put('/:id', ClienteController.update);
router.delete('/:id', ClienteController.delete);

module.exports = router;