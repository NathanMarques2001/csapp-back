const express = require('express');
const UsuarioController = require('../controllers/UsuarioController.js');
const router = express.Router();

router.get('/', UsuarioController.indexAll);
router.get('/:id', UsuarioController.index);
router.post('/', UsuarioController.store);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

router.post('/login', UsuarioController.login);

module.exports = router;