module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Busca os fabricantes reais do banco
    const fabricantes = await queryInterface.sequelize.query(
      "SELECT id FROM fabricantes",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const fabricanteIds = fabricantes.map((f) => f.id);

    const produtos = [];

    for (let i = 1; i <= 10; i++) {
      const nome =
        i === 1 ? "Antivírus" : i === 2 ? "ProBackup" : `Produto${i}`;
      const id_fabricante = fabricanteIds[(i - 1) % fabricanteIds.length];

      produtos.push({
        nome,
        id_fabricante,
        status: "ativo",
        created_at: now,
        updated_at: now,
      });
    }

    return queryInterface.bulkInsert("produtos", produtos, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("produtos", null, {});
  },
};
