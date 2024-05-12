const Contrato = require('../models/Contrato');

module.exports = {
  async index(req, res) {
    const { id } = req.params;

    const contrato = await Contrato.findByPk(id);

    if (!contrato) {
      return res.status(404).send({ message: `Nenhum contrato cadastrado com id ${id}!` });
    }

    return res.status(200).send({ contrato });
  },

  async indexAll(req, res) {
    const contratos = await Contrato.findAll();

    if (contratos.length == 0) {
      return res.status(404).send({ message: 'Nenhum contrato cadastrado!' });
    }

    return res.status(200).send({ contratos });
  },

  async store(req, res) {
    const { id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao } = req.body;

    const contrato = await Contrato.create({ id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao });

    return res.status(201).send({
      message: 'Contrato criado com sucesso!',
      contrato
    });
  },

  async update(req, res) {
    const { id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao } = req.body;
    const { id } = req.params;

    const contrato = await Contrato.findByPk(id);

    if (!contrato) {
      return res.status(404).send({ message: 'Contrato não encontrado!' });
    }

    Contrato.update({ id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao }, { where: { id: id } });

    return res.status(200).send({ message: 'Contrato atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const contrato = await Contrato.findByPk(id);

    if (!contrato) {
      return res.status(404).send({ message: 'Contrato não encontrado!' });
    }

    Contrato.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Contrato deletado com sucesso!' });
  }
}