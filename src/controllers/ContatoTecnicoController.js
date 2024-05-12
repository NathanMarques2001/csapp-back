const ContatoTecnico = require('../models/ContatoTecnico');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const contatosTecnicos = await ContatoTecnico.findAll();

    if (contatosTecnicos.length == 0) {
      return res.status(404).send({ message: 'Nenhum contato tecnico cadastrado!' });
    }

    return res.status(200).send({ contatosTecnicos });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}