const express = require('express');
const ContatoComercialController = require('../controllers/ContatoComercialController.js');
const router = express.Router();

router.get('/', ContatoComercialController.indexAll);

router.get('/:id', (req, res) => {
  return res.send('CONTATOS COMERCIAIS DO CONTRATO COM ID: ' + req.params.id);
});

router.post('/', (req, res) => {
  return res.send('CONTATO COMERCIAL CRIADO');
});

router.put('/:id', (req, res) => {
  return res.send('CONTATO COMERCIAL ATUALIZADO COM ID: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
  return res.send('CONTATO COMERCIAL DELETADO COM ID: ' + req.params.id);
});

module.exports = router;