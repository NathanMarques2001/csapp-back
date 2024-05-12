const ContatoComercial = require('../models/ContatoComercial');

module.exports = {
  async index(req, res) {
    const { id_contrato } = req.params;

    const contatosComerciais = await ContatoComercial.findAll({ where: { id_contrato: id_contrato } });

    if (contatosComerciais.length == 0) {
      return res.status(404).send({ message: `Nenhum contato comercial cadastrado no contrato com id ${id_contrato}!` });
    }

    return res.status(200).send({ contatosComerciais });
  },

  async indexAll(req, res) {
    const contatosComerciais = await ContatoComercial.findAll();

    if (contatosComerciais.length == 0) {
      return res.status(404).send({ message: 'Nenhum contato comercial cadastrado!' });
    }

    return res.status(200).send({ contatosComerciais });
  },

  async store(req, res) {
    const { id_contrato, conteudo } = req.body;

    const contatoComercial = await ContatoComercial.create({ id_contrato, conteudo });

    return res.status(201).send({
      message: 'Contato comercial criado com sucesso!',
      contatoComercial
    });
  },

  async update(req, res) {
    const { conteudo } = req.body;
    const { id } = req.params;

    const contatoComercial = await ContatoComercial.findByPk(id);

    if (!contatoComercial) {
      return res.status(404).send({ message: 'Contato comercial não encontrado!' });
    }

    ContatoComercial.update({ conteudo }, { where: { id: id } });

    return res.status(200).send({ message: 'Contato comercial atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const contatoComercial = await ContatoComercial.findByPk(id);

    if (!contatoComercial) {
      return res.status(404).send({ message: 'Contato comercial não encontrado!' });
    }

    ContatoComercial.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Contato comercial deletado com sucesso!' });
  }
}