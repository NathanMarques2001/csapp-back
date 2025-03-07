const express = require('express');
const VencimentoContratosController = require('../controllers/VencimentoContratosController');

const router = express.Router();

router.get('/', VencimentoContratosController.getAll);
router.get('/hoje', VencimentoContratosController.getToday);
router.post('/', VencimentoContratosController.create);
router.put('/:id', VencimentoContratosController.update);
router.delete('/:id', VencimentoContratosController.delete);

module.exports = router;