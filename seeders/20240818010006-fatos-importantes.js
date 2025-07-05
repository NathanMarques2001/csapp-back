"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar IDs reais dos clientes para garantir foreign key válida
    const clientes = await queryInterface.sequelize.query(
      "SELECT id FROM clientes",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const clienteIds = clientes.map((c) => c.id);

    const fatosImportantes = [];
    const numFatos = 200;

    const conteudos = [
      "Reunião de estratégia realizada com sucesso.",
      "Cliente solicitou uma análise de mercado detalhada.",
      "Atualização importante sobre mudanças regulatórias.",
      "Feedback positivo sobre o último projeto entregue.",
      "Identificado potencial para novos negócios na área X.",
      "Necessidade de revisão de contrato discutida.",
      "Cliente expressou interesse em novos produtos.",
      "Problema crítico solucionado com sucesso.",
      "Solicitação de expansão dos serviços para nova região.",
      "Reunião para discutir aumento de orçamento.",
    ];

    for (let i = 0; i < numFatos; i++) {
      fatosImportantes.push({
        id_cliente: clienteIds[i % clienteIds.length], // usa IDs reais do banco
        conteudo: conteudos[i % conteudos.length],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return queryInterface.bulkInsert("fatos_importantes", fatosImportantes, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("fatos_importantes", null, {});
  },
};
