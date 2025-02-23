const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const Contrato = require('../models/Contrato');

const logFilePath = path.join(__dirname, '../logs/reajustaContratos.log');

function logError(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0]; // Formato: YYYY-MM-DD HH:mm:ss
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

async function filaContratos() {
  try {
    return await Contrato.findAll({
      where: {
        proximo_reajuste: {
          [Op.lte]: new Date().setHours(23, 59, 59, 999),
        },
        status: 'ativo'
      },
    });
  } catch (err) {
    logError(`Erro ao buscar contratos na fila: ${err.message}`);
    return [];
  }
}

async function ajustaIndice() {
  const contratos = await filaContratos();

  const indices = {
    inpc: '188',
    igpm: '189',
    'ipc-fipe': '193',
    ipca: '433',
  };

  for (const contrato of contratos) {
    const code = contrato.nome_indice ? indices[contrato.nome_indice.toLowerCase()] : null;
    if (!code) continue;

    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const startDate = `${lastYear.getDate().toString().padStart(2, '0')}/${(lastYear.getMonth() + 1).toString().padStart(2, '0')}/${lastYear.getFullYear()}`;
    const endDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    try {
      const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?dataInicial=${startDate}&dataFinal=${endDate}&formato=json`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(`Resposta inesperada da API para índice ${code}: ${JSON.stringify(data)}`);
      }

      const total = data.reduce((acc, item) => acc + parseFloat(item.valor), 0);

      console.log(`Soma dos últimos 12 meses para contrato ${contrato.id}: ${total}`);

      await contrato.update({ indice_reajuste: total });
    } catch (err) {
      logError(`Erro ao buscar índice para contrato ${contrato.id}: ${err.message}`);
    }
  }
}

async function ajustaNovaData() {
  const fila = await filaContratos();

  for (const contrato of fila) {
    try {
      await contrato.update({
        proximo_reajuste: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
    } catch (err) {
      logError(`Erro ao atualizar proximo_reajuste do contrato ${contrato.id}: ${err.message}`);
    }
  }
}

async function ajustaValorMensal() {
  const fila = await filaContratos();

  for (const contrato of fila) {
    if (contrato.indice_reajuste !== 0 && contrato.valor_mensal != null) {
      try {
        await contrato.update({
          valor_mensal: contrato.valor_mensal + (contrato.valor_mensal * (contrato.indice_reajuste / 100)),
        });
      } catch (err) {
        logError(`Erro ao reajustar valor_mensal do contrato ${contrato.id}: ${err.message}`);
      }
    }
  }
}

async function reajustaContratos() {
  try {
    console.log("Iniciando reajuste de contratos...");
    await ajustaValorMensal();
    await ajustaIndice();
    await ajustaNovaData();
    console.log("Reajuste concluído.");
  } catch (err) {
    logError(`Erro ao reajustar contratos: ${err.message}`);
  }
}

reajustaContratos();