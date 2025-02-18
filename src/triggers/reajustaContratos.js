const { Op } = require('sequelize');
const Contrato = require('../models/Contrato');

async function filaContratos() {
  return await Contrato.findAll({
    where: {
      proximo_reajuste: {
        [Op.between]: [
          new Date().setHours(0, 0, 0, 0),
          new Date().setHours(23, 59, 59, 999)
        ],
      },
      status: 'ativo'
    },
  });
}

async function ajustaIndice() {
  const contratos = await filaContratos();

  const indices = {
    inpc: '188',
    igpm: '189',
    'ipc-fipe': '193',
    ipca: '433',
  };

  for (const item of contratos) {
    const code = indices[item.indice_reajuste];
    if (!code) continue; // Se não houver código, ignora

    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const startDate = `${lastYear.getDate().toString().padStart(2, '0')}/${(lastYear.getMonth() + 1).toString().padStart(2, '0')}/${lastYear.getFullYear()}`;
    const endDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    try {
      const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?dataInicial=${startDate}&dataFinal=${endDate}&formato=json`);
      const data = await response.json();

      const total = data.reduce((acc, item) => acc + parseFloat(item.valor), 0);

      console.log(`Soma dos últimos 12 meses para ${item.indice_reajuste}: ${total}`);

      await item.update({
        valor_reajuste: total, // Criar nova coluna `valor_reajuste`
      });

    } catch (err) {
      console.error(`Erro ao buscar ${item.indice_reajuste}:`, err);
    }
  }
}

async function ajustaNovaData() {
  const fila = await filaContratos();

  for (const item of fila) {
    await item.update({
      proximo_reajuste: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
  }
}

async function ajustaValorMensal() {
  const fila = await filaContratos();

  for (const item of fila) {
    await item.update({
      valor_mensal: item.valor_mensal + (item.valor_mensal * (item.valor_reajuste / 100)), // Usa `valor_reajuste`
    });
  }
}

async function reajustaContratos() {
  await ajustaIndice();
  await ajustaNovaData();
  await ajustaValorMensal();
}

module.exports = reajustaContratos;
