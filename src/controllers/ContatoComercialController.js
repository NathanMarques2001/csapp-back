const ContatoComercial = require('../models/ContatoComercial');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const contatosComerciais = await ContatoComercial.findAll();

    if (contatosComerciais.length == 0) {
      return res.status(404).send({ message: 'Nenhum contato comercial cadastrado!' });
    }

    return res.status(200).send({ contatosComerciais });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}