const express = require('express');
const LogController = require('../controllers/LogController.js');
const router = express.Router();

router.get('/', LogController.indexAll);

router.get('/:id', (req, res) => {
  return res.send('LOGS DO CONTRATO COM ID: ' + req.params.id);
});

router.post('/', (req, res) => {
  return res.send('LOG CRIADO');
});

module.exports = router;