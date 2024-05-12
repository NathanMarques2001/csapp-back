const express = require('express');
const ClienteController = require('../controllers/ClienteController.js');
const router = express.Router();

router.get('/', ClienteController.indexAll);

router.get('/:id', (req, res) => {
  return res.send('CLIENTE COM ID: ' + req.params.id);
});

router.post('/', (req, res) => {
  return res.send('CLIENTE CRIADO');
});

router.put('/:id', (req, res) => {
  return res.send('CLIENTE ATUALIZADO COM ID: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
  return res.send('CLIENTE DELETADO COM ID: ' + req.params.id);
});

module.exports = router;