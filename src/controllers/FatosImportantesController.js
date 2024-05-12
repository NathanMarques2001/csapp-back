const FatosImportantes = require('../models/FatosImportantes');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const fatosImportantes = await FatosImportantes.findAll();

    if (fatosImportantes.length == 0) {
      return res.status(404).send({ message: 'Nenhum fato importante cadastrado!' });
    }

    return res.status(200).send({ fatosImportantes });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}