const { Op } = require('sequelize');
const fetch = require('node-fetch'); // Se necessário, instale com `npm install node-fetch`
const Contrato = require('../models/Contrato');

async function filaContratos() {
  return await Contrato.findAll({
    where: {
      proximo_reajuste: {
        [Op.lt]: new Date(), // Pega contratos com `proximo_reajuste` menor que a data atual
      },
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

    const dataFinal = new Date(item.proximo_reajuste);
    const dataInicial = new Date(dataFinal);
    dataInicial.setFullYear(dataFinal.getFullYear() - 1);

    const startDate = `${dataInicial.getDate().toString().padStart(2, '0')}/${(dataInicial.getMonth() + 1).toString().padStart(2, '0')}/${dataInicial.getFullYear()}`;
    const endDate = `${dataFinal.getDate().toString().padStart(2, '0')}/${(dataFinal.getMonth() + 1).toString().padStart(2, '0')}/${dataFinal.getFullYear()}`;

    try {
      const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?dataInicial=${startDate}&dataFinal=${endDate}&formato=json`);
      const data = await response.json();

      const total = data.reduce((acc, item) => acc + parseFloat(item.valor), 0);

      console.log(`Soma dos últimos 12 meses para ${item.indice_reajuste}: ${total}`);

      await item.update({
        valor_reajuste: total, // Supondo que este campo existe na tabela
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
      proximo_reajuste: new Date(item.proximo_reajuste.setFullYear(item.proximo_reajuste.getFullYear() + 1)),
    },
      {
        where: {
          status: 'ativo',
        },
      });
  }
}

async function ajustaValorMensal() {
  const fila = await filaContratos();

  for (const item of fila) {
    if (!item.valor_reajuste) continue; // Evita erro caso `valor_reajuste` não tenha sido atualizado

    await item.update({
      valor_mensal: item.valor_mensal + (item.valor_mensal * (item.valor_reajuste / 100)),
    });
  }
}

async function reajustaContratosPassados() {
  await ajustaIndice();
  await ajustaNovaData();
  await ajustaValorMensal();
}

module.exports = reajustaContratosPassados;
