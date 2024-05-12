const Log = require('../models/Log');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const logs = await Log.findAll();

    if (logs.length == 0) {
      return res.status(404).send({ message: 'Nenhum log cadastrado!' });
    }

    return res.status(200).send({ logs });
  },

  async store(req, res) {

  }
}