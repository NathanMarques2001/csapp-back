const express = require('express');
const categoriaProdutoController = require('./categoria-produto.controller');
const authMiddleware = require('../../middlewares/autenticacao');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .get(categoriaProdutoController.indexAll)
  .post(categoriaProdutoController.store);

router.route('/:id')
  .get(categoriaProdutoController.index)
  .put(categoriaProdutoController.update);

module.exports = router;
