const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const Contrato = require('../models/Contrato');
const ContratoErroReajuste = require('../models/ContratoErroReajuste');  // Importa o modelo de erro

const logFilePath = path.join(__dirname, '../logs/reajustaContratos.log');

function logError(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function filaContratos() {
  try {
    return await Contrato.findAll({
      where: {
        proximo_reajuste: {
          [Op.lte]: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: 'ativo',
        nome_indice: { [Op.ne]: null }
      },
      include: [{
        model: ContratoErroReajuste,
        as: 'erros_reajuste', // Use o alias correto definido na associação
        required: false,
        where: {
          id_contrato: { [Op.is]: null }
        },
        attributes: []
      }]
    });
  } catch (err) {
    logError(`Erro ao buscar contratos na fila: ${err.message}`);
    return [];
  }
}

async function filaContratosErro() {
  try {
    return await ContratoErroReajuste.findAll({});
  } catch (err) {
    logError(`Erro ao buscar contratos com erro: ${err.message}`);
    return [];
  }
}

async function registraErroContrato(idContrato, erro) {
  try {
    await ContratoErroReajuste.create({
      id_contrato: idContrato,
      erro: erro,
      tentativas_reajuste: 1,
    });
  } catch (err) {
    logError(`Erro ao registrar erro de reajuste no contrato ${idContrato}: ${err.message}`);
  }
}

async function ajustaIndice() {
  const fila = await filaContratos();

  console.log(`Contratos na fila: ${fila.length}`);

  const indices = {
    inpc: '188',
    igpm: '189',
    'ipc-fipe': '193',
    ipca: '433',
  };

  for (const contrato of fila) {
    const code = indices[contrato.nome_indice];

    const today = new Date(contrato.proximo_reajuste);
    const lastYear = new Date(today);
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

      // Atualiza o contrato com o novo valor de índice
      await contrato.update({ indice_reajuste: total });

      // Aguarda 1,5 segundos antes de continuar para a próxima iteração
      //await sleep(1500);
    } catch (err) {
      logError(`Erro ao buscar índice para contrato ${contrato.id}: ${err.message}`);
      await registraErroContrato(contrato.id, err.message); // Registra o erro na tabela de erros
    }
  }
}

async function reprocessaContratosErro() {
  const filaErro = await filaContratosErro();

  console.log(`Contratos com erro na fila: ${filaErro.length}`);

  for (const erroContrato of filaErro) {
    const contrato = await Contrato.findByPk(erroContrato.id_contrato);
    if (!contrato) continue;

    const indices = {
      inpc: '188',
      igpm: '189',
      'ipc-fipe': '193',
      ipca: '433',
    };

    const code = indices[contrato.nome_indice];
    const today = new Date(contrato.proximo_reajuste);
    const lastYear = new Date(today);
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

      // Atualiza o contrato com o novo valor de índice
      await contrato.update({ indice_reajuste: total });

      // Remove o erro se o reprocessamento for bem-sucedido
      await erroContrato.destroy();
    } catch (err) {
      logError(`Erro ao reprocessar índice para contrato ${contrato.id}: ${err.message}`);

      // Incrementa a contagem de tentativas de reajuste
      await erroContrato.update({
        tentativas_reajuste: erroContrato.tentativas_reajuste + 1
      });
    }
  }
}

async function ajustaNovaData() {
  const fila = await filaContratos();

  for (const contrato of fila) {
    try {
      const novaData = new Date(contrato.proximo_reajuste);
      novaData.setFullYear(novaData.getFullYear() + 1);
      await contrato.update({ proximo_reajuste: novaData });
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
          valor_mensal: Number(contrato.valor_mensal) + (Number(contrato.valor_mensal) * (Number(contrato.indice_reajuste) / 100)),
        });
      } catch (err) {
        logError(`Erro ao reajustar valor_mensal do contrato ${contrato.id}: ${err.message}`);
      }
    }
  }
}

async function reajustaContratos(req, res) {
  try {
    await ajustaValorMensal();
    await ajustaIndice();
    await ajustaNovaData();
    return res.status(200).send({ message: 'Reajuste de contratos concluído com sucesso!' });
  } catch (err) {
    logError(`Erro ao reajustar contratos: ${err.message}`);
    return res.status(500).send({ message: 'Erro ao reajustar contratos.' });
  }
}

module.exports = {
  reajustaContratos,
  filaContratos,
  ajustaIndice,
  ajustaNovaData,
  ajustaValorMensal,
  reprocessaContratosErro
};
