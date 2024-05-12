const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('TODOS OS CLIENTES');
});

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