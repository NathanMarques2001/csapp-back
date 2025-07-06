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
          const valorMensal = parseFloat(contrato.valor_mensal);
          const indiceReajuste = parseFloat(contrato.indice_reajuste);

          if (isNaN(valorMensal) || isNaN(indiceReajuste)) {
            console.warn(
              `[classifyCustomers] Contrato inválido para cliente ${cliente.id}: valores NaN`
            );
            return total;
          }

          return total + valueWithTax(valorMensal, indiceReajuste);
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
      (a, b) => b.faturamentoTotal - a.faturamentoTotal
    );

    for (let i = 0; i < gruposEconomicosPorFaturamento.length; i++) {
      const { grupoEconomico, faturamentoTotal } =
        gruposEconomicosPorFaturamento[i];
      let tipo;

      if (i < 30) tipo = "top 30";
      else if (faturamentoTotal >= 3000) tipo = "a";
      else if (faturamentoTotal >= 1000) tipo = "b";
      else tipo = "c";

      await GrupoEconomico.update(
        { tipo },
        { where: { id: grupoEconomico.id } }
      );

      console.log(
        `[classifyCustomers] Grupo Econômico ${
          grupoEconomico.id
        } classificado como "${tipo}" (faturamento: ${faturamentoTotal.toFixed(
          2
        )})`
      );
    }

    console.log("[classifyCustomers] Classificação finalizada.");
  } catch (error) {
    console.error(
      "[classifyCustomers] Erro ao classificar os grupos econômicos:",
      error
    );
  }
}

module.exports = classifyCustomers;
