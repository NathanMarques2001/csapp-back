const Contrato = require('../models/Contrato');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const contratos = await Contrato.findAll();

    if (contratos.length == 0) {
      return res.status(404).send({ message: 'Nenhum contrato cadastrado!' });
    }

    return res.status(200).send({ contratos });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}