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
    const { nome } = req.body;

    const fabricante = await Fabricante.create({ nome });

    return res.status(201).send({
      message: 'Fabricante criado com sucesso!',
      fabricante
    });
  },

  async update(req, res) {
    const { nome } = req.body;
    const { id } = req.params;

    const fabricante = await Fabricante.findByPk(id);

    if (!fabricante) {
      return res.status(404).send({ message: 'Fabricante não encontrado!' });
    }

    Fabricante.update({ nome }, { where: { id: id } });

    return res.status(200).send({ message: 'Fabricante atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const fabricante = await Fabricante.findByPk(id);

    if (!fabricante) {
      return res.status(404).send({ message: 'Fabricante não encontrado!' });
    }

    Fabricante.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Fabricante deletado com sucesso!' });
  }
}