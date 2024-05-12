const Usuario = require('../models/Usuario.js');

module.exports = {
  async index(req, res) {

  },

  async indexAll(req, res) {
    const usuarios = await Usuario.findAll();

    if (usuarios.length == 0) {
      return res.status(404).send({ message: 'Nenhum usuário cadastrado!' });
    }

    return res.status(200).send({ usuarios });
  },

  async store(req, res) {

  },

  async update(req, res) {

  },

  async delete(req, res) {

  }
}