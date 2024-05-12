const Cliente = require('../models/Cliente');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const clientes = await Cliente.findAll();

    if (clientes.length == 0) {
      return res.status(404).send({ message: 'Nenhum cliente cadastrado!' });
    }

    return res.status(200).send({ clientes });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}