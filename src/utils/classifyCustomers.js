const Contrato = require("../models/Contrato");
const Cliente = require("../models/Cliente");
const GrupoEconomico = require("../models/GrupoEconomico");

function valueWithTax(value, tax) {
  return value + (value * tax) / 100;
}

async function classifyCustomers() {
  try {
    console.log("[classifyCustomers] Iniciando classificação...");

    const gruposEconomicos = await GrupoEconomico.findAll();
    const gruposEconomicosPorFaturamento = [];

    for (const grupoEconomico of gruposEconomicos) {
      const clientes = await Cliente.findAll({
        where: { id_grupo_economico: grupoEconomico.id },
      });

      let faturamentoTotalGrupo = 0;

      for (const cliente of clientes) {
        const contratos = await Contrato.findAll({
          where: {
            id_cliente: cliente.id,
            status: "ativo",
          },
        });

        const faturamentoCliente = contratos.reduce((total, contrato) => {
          const bruto = parseFloat(contrato.valor_mensal);
          let indiceReajuste = parseFloat(contrato.indice_reajuste);
          const tipo = contrato.tipo_faturamento;

          if (isNaN(bruto)) {
            console.warn(
              `⚠️ Contrato ${contrato.id} do cliente ${cliente.id} com valor_mensal inválido: "${contrato.valor_mensal}"`,
            );
            return total;
          }

          if (isNaN(indiceReajuste)) {
            console.warn(
              `⚠️ Contrato ${contrato.id} do cliente ${cliente.id} sem índice de reajuste definido. Usando 0%.`,
            );
            indiceReajuste = 0;
          }

          const valorMensal = tipo === "anual" ? bruto / 12 : bruto;
          const valorFinal = valueWithTax(valorMensal, indiceReajuste);

          console.log(
            `[✓] Contrato ${
              contrato.id
            } (${tipo}) - bruto: ${bruto} | mensal: ${valorMensal.toFixed(
              2,
            )} | reajuste: ${indiceReajuste}% | final: ${valorFinal.toFixed(2)}`,
          );

          return total + valorFinal;
        }, 0);

        faturamentoTotalGrupo += faturamentoCliente;
      }

      gruposEconomicosPorFaturamento.push({
        grupoEconomico,
        faturamentoTotal: faturamentoTotalGrupo,
      });
    }

    // Ordena do maior para o menor faturamento
    gruposEconomicosPorFaturamento.sort(
      (a, b) => b.faturamentoTotal - a.faturamentoTotal,
    );

    for (let i = 0; i < gruposEconomicosPorFaturamento.length; i++) {
      const { grupoEconomico, faturamentoTotal } =
        gruposEconomicosPorFaturamento[i];
      let tipo;

      if (i < 30) tipo = "top 30";
      else if (faturamentoTotal > 3000) tipo = "a";
      else if (faturamentoTotal > 2000) tipo = "b";
      else tipo = "c";

      await GrupoEconomico.update(
        { tipo },
        { where: { id: grupoEconomico.id } },
      );

      console.log(
        `[classifyCustomers] Grupo Econômico ${
          grupoEconomico.id
        } classificado como "${tipo}" (faturamento: ${faturamentoTotal.toFixed(
          2,
        )})`,
      );
    }

    console.log("[classifyCustomers] Classificação finalizada.");
  } catch (error) {
    console.error(
      "[classifyCustomers] Erro ao classificar os grupos econômicos:",
      error,
    );
  }
}

module.exports = classifyCustomers;
