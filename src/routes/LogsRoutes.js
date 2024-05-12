const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('TODOS OS LOGS');
});

router.get('/:id', (req, res) => {
  return res.send('LOGS DO CONTRATO COM ID: ' + req.params.id);
});

router.post('/', (req, res) => {
  return res.send('LOG CRIADO');
});

module.exports = router;