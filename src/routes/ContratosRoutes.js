const express = require('express');
const ContratoController = require('../controllers/ContratoController.js');
const router = express.Router();

router.get('/', ContratoController.indexAll);

router.get('/:id', (req, res) => {
  return res.send('CONTRATO COM ID: ' + req.params.id);
});

router.post('/', (req, res) => {
  return res.send('CONTRATO CRIADO');
});

router.put('/:id', (req, res) => {
  return res.send('CONTRATO ATUALIZADO COM ID: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
  return res.send('CONTRATO DELETADO COM ID: ' + req.params.id);
});

module.exports = router;