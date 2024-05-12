const FatosImportantes = require('../models/FatosImportantes');

module.exports = {
  async index(req, res) {
    const { id_contrato } = req.params;

    const fatosImportantes = await FatosImportantes.findAll({ where: { id_contrato: id_contrato } });

    if (fatosImportantes.length == 0) {
      return res.status(404).send({ message: `Nenhum fato importante cadastrado no contrato com id ${id_contrato}!` });
    }

    return res.status(200).send({ fatosImportantes });
  },

  async indexAll(req, res) {
    const fatosImportantes = await FatosImportantes.findAll();

    if (fatosImportantes.length == 0) {
      return res.status(404).send({ message: 'Nenhum fato importante cadastrado!' });
    }

    return res.status(200).send({ fatosImportantes });
  },

  async store(req, res) {
    const { id_contrato, conteudo } = req.body;

    const fatoImportante = await FatosImportantes.create({ id_contrato, conteudo });

    return res.status(201).send({
      message: 'Fato importante criado com sucesso!',
      fatoImportante
    });
  },

  async update(req, res) {
    const { conteudo } = req.body;
    const { id } = req.params;

    const fatoImportante = await FatosImportantes.findByPk(id);

    if (!fatoImportante) {
      return res.status(404).send({ message: 'Fato importante não encontrado!' });
    }

    FatosImportantes.update({ conteudo }, { where: { id: id } });

    return res.status(200).send({ message: 'Fato importante atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const fatoImportante = await FatosImportantes.findByPk(id);

    if (!fatoImportante) {
      return res.status(404).send({ message: 'Fato importante não encontrado!' });
    }

    FatosImportantes.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Fato importante deletado com sucesso!' });
  }
}