const Contrato = require('../models/Contrato');

module.exports = {
  async index(req, res) {
    try {
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res.status(404).send({ message: `Nenhum contrato cadastrado com id ${id}!` });
      }

      return res.status(200).send({ contrato });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar o contrato.' });
    }
  },

  async indexClient(req, res) {
    try {
      const { id } = req.params;

      const contratos = await Contrato.findAll({ where: { id_cliente: id } });

      if (contratos.length == 0) {
        return res.status(404).send({ message: 'Nenhum contrato cadastrado!' });
      }

      return res.status(200).send({ contratos });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar os contratos.' });
    }
  },

  async indexAll(req, res) {
    try {
      const contratos = await Contrato.findAll();

      if (contratos.length == 0) {
        return res.status(404).send({ message: 'Nenhum contrato cadastrado!' });
      }

      return res.status(200).send({ contratos });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar os contratos.' });
    }
  },

  async store(req, res) {
    try {
      const { id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao } = req.body;

      const contrato = await Contrato.create({ id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao });

      return res.status(201).send({
        message: 'Contrato criado com sucesso!',
        contrato
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o contrato.' });
    }
  },

  async update(req, res) {
    try {
      const { id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao } = req.body;
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res.status(404).send({ message: 'Contrato não encontrado!' });
      }

      await Contrato.update({ id_cliente, id_produto, faturado, dia_vencimento, indice_reajuste, proximo_reajuste, status, duracao, valor_mensal, quantidade, email_envio, descricao }, { where: { id: id } });

      return res.status(200).send({ message: 'Contrato atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o contrato.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res.status(404).send({ message: 'Contrato não encontrado!' });
      }

      await Contrato.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Contrato deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o contrato.' });
    }
  }
}
