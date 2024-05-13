const FatosImportantes = require('../models/FatosImportantes');
const Contrato = require('../models/Contrato');

module.exports = {
  async index(req, res) {
    try {
      const { id_contrato } = req.params;

      const contrato = await Contrato.findByPk(id_contrato, {
        include: { association: 'fatos_importantes' }
      });

      if (!contrato) {
        return res.status(404).send({ message: 'Contrato não encontrado!' });
      }

      if (contrato.fatos_importantes.length == 0) {
        return res.status(404).send({ message: 'Nenhum fato importante cadastrado!' });
      }

      return res.status(200).send({ fatos_importantes: contrato.fatos_importantes });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar os fatos importantes.' });
    }
  },

  async indexAll(req, res) {
    try {
      const fatosImportantes = await FatosImportantes.findAll();

      if (fatosImportantes.length == 0) {
        return res.status(404).send({ message: 'Nenhum fato importante cadastrado!' });
      }

      return res.status(200).send({ fatosImportantes });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar os fatos importantes.' });
    }
  },

  async store(req, res) {
    try {
      const { id_contrato, conteudo } = req.body;

      const fatoImportante = await FatosImportantes.create({ id_contrato, conteudo });

      return res.status(201).send({
        message: 'Fato importante criado com sucesso!',
        fatoImportante
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o fato importante.' });
    }
  },

  async update(req, res) {
    try {
      const { conteudo } = req.body;
      const { id } = req.params;

      const fatoImportante = await FatosImportantes.findByPk(id);

      if (!fatoImportante) {
        return res.status(404).send({ message: 'Fato importante não encontrado!' });
      }

      await FatosImportantes.update({ conteudo }, { where: { id: id } });

      return res.status(200).send({ message: 'Fato importante atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o fato importante.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const fatoImportante = await FatosImportantes.findByPk(id);

      if (!fatoImportante) {
        return res.status(404).send({ message: 'Fato importante não encontrado!' });
      }

      await FatosImportantes.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Fato importante deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o fato importante.' });
    }
  }
}
