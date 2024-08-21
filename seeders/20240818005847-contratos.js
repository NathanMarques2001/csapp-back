'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const contratos = [];
    const numContratos = 321;
    const numClientes = 50;  // Supondo que você tenha 50 clientes
    const numProdutos = 10;  // Supondo que você tenha 10 produtos
    const numFaturado = 10;

    for (let i = 1; i <= numContratos; i++) {
      let id_produto, quantidade, nome_indice;

      if (i === 1) {
        id_produto = 1;  // Supondo que 'Antivírus' tem id 1
        quantidade = 100;  // Definindo um valor para a quantidade
        nome_indice = 'ipca';  // Definindo um valor para o índice
      } else if (i === 2) {
        id_produto = 2;  // Supondo que 'ProBackup' tem id 2
        quantidade = 200;  // Definindo um valor para a quantidade
        nome_indice = 'igpm';  // Definindo um valor para o índice
      } else {
        id_produto = (i % numProdutos) + 1;  // Alternando entre produtos
        quantidade = null;  // Deixando a quantidade como null
        nome_indice = null;  // Deixando o índice como null
      }

      contratos.push({
        id_cliente: (i % numClientes) + 1,  // Alternando entre clientes
        id_produto,
        faturado: 0,  // Alternando entre faturado e não faturado
        id_faturado: (i % numFaturado) + 1,  // Nome fictício para o campo faturado_por
        dia_vencimento: (i % 30) + 1,  // Definindo um dia de vencimento entre 1 e 30
        indice_reajuste: Math.random() * 5,  // Valor aleatório para índice de reajuste
        proximo_reajuste: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)),  // Data futura para o próximo reajuste
        status: 'ativo',  // Alternando entre 'ativo' e 'inativo'
        duracao: 12 * (i % 3 + 1),  // Duração em meses (12, 24, 36)
        valor_mensal: (Math.random() * 1000).toFixed(2),  // Valor mensal aleatório
        quantidade,
        descricao: `Descrição do contrato ${i}`,  // Descrição fictícia
        nome_indice,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return queryInterface.bulkInsert('contratos', contratos, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('contratos', null, {});
  }
};
