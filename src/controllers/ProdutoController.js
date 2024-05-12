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
    const { nome } = req.body;

    const produto = await Produto.create({ nome });

    return res.status(201).send({
      message: 'Produto criado com sucesso!',
      produto
    });
  },

  async update(req, res) {
    const { nome } = req.body;
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).send({ message: 'Produto não encontrado!' });
    }

    Produto.update({ nome }, { where: { id: id } });

    return res.status(200).send({ message: 'Produto atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).send({ message: 'Produto não encontrado!' });
    }

    Produto.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Produto deletado com sucesso!' });
  }
}