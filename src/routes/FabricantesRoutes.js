const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('TODOS OS FABRICANTES');
});

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