const Contrato = require('../models/Contrato');
const Cliente = require('../models/Cliente');

async function classifyCustomers() {
  let tipo = "";
  let clientesPorFaturamento = [];

  try {
    const clientes = await Cliente.findAll();

    // Calcular o faturamento total de cada cliente
    for (let cliente of clientes) {
      const contratos = await Contrato.findAll({ where: { id_cliente: cliente.id } });
      const contratosAtivos = contratos.filter(contrato => contrato.status === 'ativo');
      const faturamentoTotal = contratosAtivos.reduce((total, contrato) => total + parseFloat(contrato.valor_mensal), 0);
      clientesPorFaturamento.push({ cliente, faturamentoTotal });
    }

    // Ordenar os clientes pelo faturamento total em ordem decrescente
    clientesPorFaturamento.sort((a, b) => b.faturamentoTotal - a.faturamentoTotal);

    // Classificar os clientes
    for (let i = 0; i < clientesPorFaturamento.length; i++) {
      const { cliente, faturamentoTotal } = clientesPorFaturamento[i];

      console.log(`Classificando cliente ${cliente.id}...`, faturamentoTotal);

      if (faturamentoTotal >= 3000) {
        tipo = "a";
      } else if (faturamentoTotal >= 1000) {
        tipo = "b";
      } else {
        tipo = "c";
      }

      // Aplicar a classificação "top 30" após verificar o faturamento
      if (i < 30) {
        tipo = "top 30";
      }

      await Cliente.update({ tipo }, { where: { id: cliente.id } });
      console.log(`Cliente ${cliente.id} atualizado para a categoria ${tipo} com sucesso!`);
    }
  } catch (error) {
    console.error('Erro ao classificar os clientes:', error);
  }
}


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

  async indexVendedor(req, res) {
    try {
      const { id } = req.params;
      const clientes = await Cliente.findAll({ where: { id_usuario: id } });
      let contratos = [];

      for (let cliente of clientes) {
        const contratosCliente = await Contrato.findAll({ where: { id_cliente: cliente.id } });
        contratos = contratos.concat(contratosCliente);
      }

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
      const { id_cliente, id_produto, faturado, id_faturado, dia_vencimento, indice_reajuste, nome_indice, proximo_reajuste, status, duracao, valor_mensal, quantidade, descricao, data_inicio } = req.body;

      const contrato = await Contrato.create({ id_cliente, id_produto, faturado, id_faturado, dia_vencimento, indice_reajuste, nome_indice, proximo_reajuste, status, duracao, valor_mensal, quantidade, descricao, data_inicio });

      await classifyCustomers();

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
      const { id_cliente, id_produto, faturado, id_faturado, dia_vencimento, indice_reajuste, nome_indice, proximo_reajuste, status, duracao, valor_mensal, quantidade, descricao, data_inicio } = req.body;
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res.status(404).send({ message: 'Contrato não encontrado!' });
      }

      await Contrato.update({ id_cliente, id_produto, faturado, id_faturado, dia_vencimento, indice_reajuste, nome_indice, proximo_reajuste, status, duracao, valor_mensal, quantidade, descricao, data_inicio }, { where: { id: id } });

      return res.status(200).send({ message: 'Contrato atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o contrato.' });
    }
  },

  // async delete(req, res) {
  //   try {
  //     const { id } = req.params;

  //     const contrato = await Contrato.findByPk(id);

  //     if (!contrato) {
  //       return res.status(404).send({ message: 'Contrato não encontrado!' });
  //     }

  //     await Contrato.destroy({ where: { id: id } });

  //     return res.status(200).send({ message: 'Contrato deletado com sucesso!' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({ message: 'Ocorreu um erro ao deletar o contrato.' });
  //   }
  // }
}
