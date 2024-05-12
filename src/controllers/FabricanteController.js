const Fabricante = require('../models/Fabricante');

module.exports = {
  async indexAll(req, res) {
    const fabricantes = await Fabricante.findAll();

    if (fabricantes.length == 0) {
      return res.status(404).send({ message: 'Nenhum fabricante cadastrado!' });
    }

    return res.status(200).send({ fabricantes });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}