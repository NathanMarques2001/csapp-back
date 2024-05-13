const Fabricante = require('../models/Fabricante');

module.exports = {
  async indexAll(req, res) {
    try {
      const fabricantes = await Fabricante.findAll();

      if (fabricantes.length == 0) {
        return res.status(404).send({ message: 'Nenhum fabricante cadastrado!' });
      }

      return res.status(200).send({ fabricantes });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar os fabricantes.' });
    }
  },

  async store(req, res) {
    try {
      const { nome } = req.body;

      const fabricante = await Fabricante.create({ nome });

      return res.status(201).send({
        message: 'Fabricante criado com sucesso!',
        fabricante
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o fabricante.' });
    }
  },

  async update(req, res) {
    try {
      const { nome } = req.body;
      const { id } = req.params;

      const fabricante = await Fabricante.findByPk(id);

      if (!fabricante) {
        return res.status(404).send({ message: 'Fabricante não encontrado!' });
      }

      await Fabricante.update({ nome }, { where: { id: id } });

      return res.status(200).send({ message: 'Fabricante atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o fabricante.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const fabricante = await Fabricante.findByPk(id);

      if (!fabricante) {
        return res.status(404).send({ message: 'Fabricante não encontrado!' });
      }

      await Fabricante.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Fabricante deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o fabricante.' });
    }
  }
}
