const Contrato = require('../models/Contrato');
const Cliente = require('../models/Cliente');

async function classifyCustomers() {
  let tipo = "";
  let clientesPorFaturamento = [];

  try {
    const clientes = await Cliente.findAll();

    // Calcular o faturamento total de cada cliente
    for (let cliente of clientes) {
      const contratos = await Contrato.findAll({ where: { id_cliente: cliente.id, status: 'ativo' } });
      const faturamentoTotal = contratos.reduce((total, contrato) => total + valueWithTax(parseFloat(contrato.valor_mensal), parseFloat(contrato.indice_reajuste)), 0);
      clientesPorFaturamento.push({ cliente, faturamentoTotal });
    }

    // Ordenar os clientes pelo faturamento total em ordem decrescente
    clientesPorFaturamento.sort((a, b) => b.faturamentoTotal - a.faturamentoTotal);

    // Classificar os clientes
    for (let i = 0; i < clientesPorFaturamento.length; i++) {
      const { cliente, faturamentoTotal } = clientesPorFaturamento[i];

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

function valueWithTax(value, tax) {
  return value + ((value * tax) / 100);
}

module.exports = classifyCustomers;
