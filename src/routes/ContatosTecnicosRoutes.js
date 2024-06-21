const express = require('express');
const ContatoTecnicoController = require('../controllers/ContatoTecnicoController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.js');

router.use(authMiddleware);
router.get('/', ContatoTecnicoController.indexAll);
router.get('/:id_contrato', ContatoTecnicoController.index);
router.post('/', ContatoTecnicoController.store);
router.put('/:id', ContatoTecnicoController.update);
router.delete('/:id', ContatoTecnicoController.delete);

module.exports = router;