const express = require('express');
const ProdutoController = require('../controllers/ProdutoController.js');
const router = express.Router();

router.get('/', ProdutoController.indexAll);

router.post('/', (req, res) => {
  return res.send('PRODUTO CRIADO');
});

router.put('/:id', (req, res) => {
  return res.send('PRODUTO ATUALIZADO COM ID: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
  return res.send('PRODUTO DELETADO COM ID: ' + req.params.id);
});

module.exports = router;