const Produto = require('../models/Produto');

module.exports = {
  async indexAll(req, res) {
    const produtos = await Produto.findAll();

    if (produtos.length == 0) {
      return res.status(404).send({ message: 'Nenhum produto cadastrado!' });
    }

    return res.status(200).send({ produtos });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}