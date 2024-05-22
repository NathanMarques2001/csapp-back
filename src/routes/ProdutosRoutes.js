const express = require('express');
const ProdutoController = require('../controllers/ProdutoController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.js');

// router.use(authMiddleware);
router.get('/', ProdutoController.indexAll);
router.post('/', ProdutoController.store);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.delete);

module.exports = router;