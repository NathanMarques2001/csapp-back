const Contrato = require("../models/Contrato");
const Cliente = require("../models/Cliente");
const GrupoEconomico = require("../models/GrupoEconomico");

function valueWithTax(value, tax) {
  return value + (value * tax) / 100;
}

async function classifyEntitiesOptimized() {
  try {
    console.log("[classifyEntitiesOptimized] Iniciando classificação...");

    // 1. Buscar todos os grupos econômicos e clientes
    const [gruposEconomicos, clientes, contratosAtivos] = await Promise.all([
      GrupoEconomico.findAll(),
      Cliente.findAll(),
      Contrato.findAll({ where: { status: "ativo" } }),
    ]);

    // 2. Agrupar contratos por cliente
    const contratosPorCliente = contratosAtivos.reduce((map, contrato) => {
      if (!map[contrato.id_cliente]) map[contrato.id_cliente] = [];
      map[contrato.id_cliente].push(contrato);
      return map;
    }, {});

    // 3. Calcular faturamento por cliente
    const faturamentoPorCliente = {};
    for (const cliente of clientes) {
      const contratosCliente = contratosPorCliente[cliente.id] || [];
      let faturamentoCliente = 0;

      for (const contrato of contratosCliente) {
        const bruto = parseFloat(contrato.valor_mensal);
        let indiceReajuste = parseFloat(contrato.indice_reajuste);
        const tipo = contrato.tipo_faturamento;

        if (isNaN(bruto)) {
          console.warn(
            `⚠️ Contrato ${contrato.id} do cliente ${cliente.id} com valor_mensal inválido: "${contrato.valor_mensal}"`,
          );
          continue;
        }

        if (isNaN(indiceReajuste)) {
          console.warn(
            `⚠️ Contrato ${contrato.id} do cliente ${cliente.id} sem índice de reajuste definido. Usando 0%.`,
          );
          indiceReajuste = 0;
        }

        const valorMensal = tipo === "anual" ? bruto / 12 : bruto;
        const valorFinal = valueWithTax(valorMensal, indiceReajuste);

        faturamentoCliente += valorFinal;
      }

      faturamentoPorCliente[cliente.id] = faturamentoCliente;
    }

    // 4. Agrupar faturamento por grupo econômico
    const faturamentoPorGrupo = {};
    for (const cliente of clientes) {
      if (cliente.id_grupo_economico) {
        faturamentoPorGrupo[cliente.id_grupo_economico] =
          (faturamentoPorGrupo[cliente.id_grupo_economico] || 0) +
          (faturamentoPorCliente[cliente.id] || 0);
      }
    }

    // 5. Montar lista mesclada de faturamentos
    const faturamentos = [];

    // Adicionar grupos econômicos com faturamento
    for (const grupo of gruposEconomicos) {
      faturamentos.push({
        id: grupo.id,
        tipoEntidade: "grupo",
        faturamentoTotal: faturamentoPorGrupo[grupo.id] || 0,
      });
    }

    // Adicionar clientes sem grupo econômico
    for (const cliente of clientes.filter((c) => !c.id_grupo_economico)) {
      faturamentos.push({
        id: cliente.id,
        tipoEntidade: "cliente",
        faturamentoTotal: faturamentoPorCliente[cliente.id] || 0,
      });
    }

    // 6. Ordenar do maior para menor faturamento
    faturamentos.sort((a, b) => b.faturamentoTotal - a.faturamentoTotal);

    // 7. Classificar e atualizar bancos
    for (let i = 0; i < faturamentos.length; i++) {
      const { id, tipoEntidade, faturamentoTotal } = faturamentos[i];

      let tipoClassificacao;
      if (i < 30) tipoClassificacao = "top 30";
      else if (faturamentoTotal > 3000) tipoClassificacao = "a";
      else if (faturamentoTotal > 2000) tipoClassificacao = "b";
      else tipoClassificacao = "c";

      if (tipoEntidade === "grupo") {
        await GrupoEconomico.update(
          { tipo: tipoClassificacao },
          { where: { id } },
        );
        console.log(
          `[classifyEntitiesOptimized] Grupo Econômico ${id} classificado como "${tipoClassificacao}" (faturamento: ${faturamentoTotal.toFixed(
            2,
          )})`,
        );
      } else if (tipoEntidade === "cliente") {
        await Cliente.update({ tipo: tipoClassificacao }, { where: { id } });
        console.log(
          `[classifyEntitiesOptimized] Cliente ${id} classificado como "${tipoClassificacao}" (faturamento: ${faturamentoTotal.toFixed(
            2,
          )})`,
        );
      }
    }

    console.log("[classifyEntitiesOptimized] Classificação finalizada.");
  } catch (error) {
    console.error("[classifyEntitiesOptimized] Erro na classificação:", error);
  }
}

module.exports = classifyEntitiesOptimized;
