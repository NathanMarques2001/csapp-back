const ContatoTecnico = require('../models/ContatoTecnico');

module.exports = {
  async index(req, res) {
    const { id_contrato } = req.params;

    const contatosTecnicos = await ContatoTecnico.findByPk(id_contrato);

    if (!contatosTecnicos) {
      return res.status(404).send({ message: `Nenhum contato tecnico cadastrado no contrato com id ${id_contrato}!` });
    }

    return res.status(200).send({ contatosTecnicos });
  },

  async indexAll(req, res) {
    const contatosTecnicos = await ContatoTecnico.findAll();

    if (contatosTecnicos.length == 0) {
      return res.status(404).send({ message: 'Nenhum contato tecnico cadastrado!' });
    }

    return res.status(200).send({ contatosTecnicos });
  },

  async store(req, res) {
    const { id_contrato, conteudo } = req.body;

    const contatoTecnico = await ContatoTecnico.create({ id_contrato, conteudo });

    return res.status(201).send({
      message: 'Contato tecnico criado com sucesso!',
      contatoTecnico
    });
  },

  async update(req, res) {
    const { conteudo } = req.body;
    const { id } = req.params;

    const contatoTecnico = await ContatoTecnico.findByPk(id);

    if (!contatoTecnico) {
      return res.status(404).send({ message: 'Contato tecnico não encontrado!' });
    }

    ContatoTecnico.update({ conteudo }, { where: { id: id } });

    return res.status(200).send({ message: 'Contato tecnico atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const contatoTecnico = await ContatoTecnico.findByPk(id);

    if (!contatoTecnico) {
      return res.status(404).send({ message: 'Contato tecnico não encontrado!' });
    }

    ContatoTecnico.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Contato tecnico deletado com sucesso!' });
  }
}