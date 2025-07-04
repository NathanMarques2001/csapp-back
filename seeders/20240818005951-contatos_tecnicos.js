'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar IDs reais dos clientes
    const clientes = await queryInterface.sequelize.query(
      'SELECT id FROM clientes',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const clienteIds = clientes.map(c => c.id);

    const contatosTecnicos = [];
    const numContatos = 250;

    const conteudos = [
      'Solicitação de suporte técnico urgente',
      'Problema com a configuração do sistema',
      'Dúvida sobre funcionalidades específicas',
      'Relato de erro no sistema',
      'Solicitação de manutenção preventiva',
      'Configuração de novos equipamentos',
      'Atualização de software necessária',
      'Problemas de integração com outros sistemas',
      'Pedido de treinamento adicional',
      'Verificação de segurança do sistema'
    ];

    for (let i = 0; i < numContatos; i++) {
      contatosTecnicos.push({
        id_cliente: clienteIds[i % clienteIds.length], // usa IDs reais
        conteudo: conteudos[i % conteudos.length],
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return queryInterface.bulkInsert('contatos_tecnicos', contatosTecnicos, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('contatos_tecnicos', null, {});
  }
};
