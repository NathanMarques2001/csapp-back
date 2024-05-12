const express = require('express');
const UsuarioController = require('../controllers/UsuarioController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.js');

router.post('/login', UsuarioController.login);
router.use(authMiddleware);
router.get('/', UsuarioController.indexAll);
router.get('/:id', UsuarioController.index);
router.post('/', UsuarioController.store);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

module.exports = router;