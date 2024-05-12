const express = require('express');
const FabricanteController = require('../controllers/FabricanteController.js');
const router = express.Router();

router.get('/', FabricanteController.indexAll);

router.post('/', (req, res) => {
  return res.send('FABRICANTE CRIADO');
});

router.put('/:id', (req, res) => {
  return res.send('FABRICANTE ATUALIZADO COM ID: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
  return res.send('FABRICANTE DELETADO COM ID: ' + req.params.id);
});

module.exports = router;