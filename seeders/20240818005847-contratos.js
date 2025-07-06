"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const contratos = [];
    const numContratos = 200;

    // Busca os IDs reais dos clientes
    const clientes = await queryInterface.sequelize.query(
      "SELECT id FROM clientes",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const clienteIds = clientes.map((c) => c.id);

    // Busca os IDs reais dos produtos
    const produtos = await queryInterface.sequelize.query(
      "SELECT id FROM produtos",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const produtoIds = produtos.map((p) => p.id);

    // Busca os IDs reais para faturado (assumindo tabela faturados)
    const faturados = await queryInterface.sequelize.query(
      "SELECT id FROM faturados",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const faturadoIds = faturados.length > 0 ? faturados.map((f) => f.id) : [1]; // fallback

    const indices = ["inpc", "igpm", "ipc-fipe", "ipca", null];

    function getRandomDate(startYear, endYear) {
      const start = new Date(startYear, 0, 1);
      const end = new Date(endYear, 11, 31);
      const randomTime =
        start.getTime() + Math.random() * (end.getTime() - start.getTime());
      return new Date(randomTime).toISOString().split("T")[0];
    }

    function getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Gera contratos
    for (let i = 0; i < numContratos; i++) {
      const id_cliente = clienteIds[i % clienteIds.length];
      const id_produto = getRandomElement(produtoIds);
      const id_faturado = getRandomElement(faturadoIds);

      const valorMensal = getRandomInt(100, 10000); // Valor mensal variado
      const indiceReajuste = getRandomInt(0, 15); // Entre 0% e 15%

      contratos.push({
        id_cliente,
        id_produto,
        faturado: 0,
        id_faturado,
        dia_vencimento: (i % 30) + 1,
        indice_reajuste: indiceReajuste,
        proximo_reajuste: getRandomDate(2020, 2026),
        status: "ativo",
        duracao: 12 * ((i % 3) + 1),
        valor_mensal: valorMensal,
        quantidade: Math.random() > 0.3 ? getRandomInt(1, 100) : null,
        descricao: `Descrição do contrato ${i + 1}`,
        nome_indice: getRandomElement(indices),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return queryInterface.bulkInsert("contratos", contratos, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("contratos", null, {});
  },
};
