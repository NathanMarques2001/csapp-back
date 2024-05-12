const express = require('express');
const UsuarioController = require('../controllers/UsuarioController.js');
const router = express.Router();

router.get('/', UsuarioController.indexAll);

router.get('/:id', (req, res) => {
  return res.send('USUÁRIO COM ID: ' + req.params.id);
});

router.post('/', (req, res) => {
  return res.send('USUÁRIO CRIADO');
});

router.put('/:id', (req, res) => {
  return res.send('USUÁRIO ATUALIZADO COM ID: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
  return res.send('USUÁRIO DELETADO COM ID: ' + req.params.id);
});

module.exports = router;