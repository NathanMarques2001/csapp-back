const Contrato = require('../models/Contrato');
const Cliente = require('../models/Cliente');

async function classifyCustomers() {
  try {
    const clientes = await Cliente.findAll();
    const clientesPorFaturamento = [];

    for (const cliente of clientes) {
      const contratos = await Contrato.findAll({
        where: { id_cliente: cliente.id, status: 'ativo' }
      });

      const faturamentoTotal = contratos.reduce((total, contrato) =>
        total + valueWithTax(parseFloat(contrato.valor_mensal), parseFloat(contrato.indice_reajuste)), 0);

      clientesPorFaturamento.push({ cliente, faturamentoTotal });
    }

    // Ordenar os clientes pelo faturamento (maior primeiro)
    clientesPorFaturamento.sort((a, b) => b.faturamentoTotal - a.faturamentoTotal);

    for (let i = 0; i < clientesPorFaturamento.length; i++) {
      const { cliente, faturamentoTotal } = clientesPorFaturamento[i];

      let tipo;

      if (i < 30) {
        tipo = 'top 30';
      } else if (faturamentoTotal >= 3000) {
        tipo = 'a';
      } else if (faturamentoTotal >= 1000) {
        tipo = 'b';
      } else {
        tipo = 'c';
      }

      await Cliente.update({ tipo }, { where: { id: cliente.id } });

      console.log(`Cliente ${cliente.id} classificado como "${tipo}"`);
    }
  } catch (error) {
    console.error('Erro ao classificar os clientes:', error);
  }
}

function valueWithTax(value, tax) {
  return value + ((value * tax) / 100);
}

module.exports = classifyCustomers;
