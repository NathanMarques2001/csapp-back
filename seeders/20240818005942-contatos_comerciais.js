"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Busca os IDs reais dos clientes
    const clientes = await queryInterface.sequelize.query(
      "SELECT id FROM clientes",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const clienteIds = clientes.map((c) => c.id);

    const contatosComerciais = [];
    const numContatos = 300;

    const conteudos = [
      "Consulta sobre o contrato de manutenção",
      "Solicitação de informações sobre novos produtos",
      "Reunião para revisão de contrato",
      "Dúvidas sobre faturamento",
      "Proposta de atualização de contrato",
      "Confirmação de recebimento de documentação",
      "Discussão sobre termos de serviço",
      "Pedido de suporte técnico",
      "Negociação de preços e condições",
      "Feedback sobre o serviço recebido",
    ];

    for (let i = 0; i < numContatos; i++) {
      contatosComerciais.push({
        id_cliente: clienteIds[i % clienteIds.length], // usa IDs reais
        conteudo: conteudos[i % conteudos.length],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return queryInterface.bulkInsert(
      "contatos_comerciais",
      contatosComerciais,
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("contatos_comerciais", null, {});
  },
};
