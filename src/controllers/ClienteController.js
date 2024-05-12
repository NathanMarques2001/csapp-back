const Cliente = require('../models/Cliente');

module.exports = {
  async index(req, res) {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente não encontrado!' });
    }

    return res.status(200).send({ cliente });
  },

  async indexAll(req, res) {
    const clientes = await Cliente.findAll();

    if (clientes.length == 0) {
      return res.status(404).send({ message: 'Nenhum cliente cadastrado!' });
    }

    return res.status(200).send({ clientes });
  },

  async store(req, res) {
    const { nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 } = req.body;

    const cliente = await Cliente.create({ nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 });

    return res.status(201).send({
      message: 'Cliente criado com sucesso!',
      cliente
    });
  },

  async update(req, res) {
    const { nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 } = req.body;
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente não encontrado!' });
    }

    Cliente.update({ nome, cpf_cnpj, relacionamento, nps, seguimento, data_criacao, gestor_contratos_nome, gestor_contratos_email, gestor_contratos_nascimento, gestor_contratos_telefone_1, gestor_contratos_telefone_2, gestor_chamados_nome, gestor_chamados_email, gestor_chamados_nascimento, gestor_chamados_telefone_1, gestor_chamados_telefone_2, gestor_financeiro_nome, gestor_financeiro_email, gestor_financeiro_nascimento, gestor_financeiro_telefone_1, gestor_financeiro_telefone_2 }, { where: { id: id } });

    return res.status(200).send({ message: 'Cliente atualizado com sucesso!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente não encontrado!' });
    }

    Cliente.destroy({ where: { id: id } });

    return res.status(200).send({ message: 'Cliente deletado com sucesso!' });
  }
}