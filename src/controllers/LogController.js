const Log = require('../models/Log');

module.exports = {
  async index(req, res) {
    const { id_contrato } = req.params;

    const logs = await Log.findByPk(id_contrato);

    if (!logs) {
      return res.status(404).send({ message: `Nenhum log cadastrado no contrato com id ${id_contrato}!` });
    }

    return res.status(200).send({ logs });
  },

  async indexAll(req, res) {
    const logs = await Log.findAll();

    if (logs.length == 0) {
      return res.status(404).send({ message: 'Nenhum log cadastrado!' });
    }

    return res.status(200).send({ logs });
  },

  async store(req, res) {
    const { id_usuario, id_contrato, alteracao } = req.body;

    const log = await Log.create({ id_usuario, id_contrato, alteracao });

    return res.status(201).send({
      message: 'Log criado com sucesso!',
      log
    });
  }
}