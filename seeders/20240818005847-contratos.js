'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const contratos = [];
    const numContratos = 321;
    const numClientes = 50;
    const numProdutos = 10;
    const numFaturado = 10;

    function getRandomDate(startYear, endYear) {
      const start = new Date(startYear, 0, 1);
      const end = new Date(endYear, 11, 31);
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    for (let i = 1; i <= numContratos; i++) {
      let id_produto, quantidade, nome_indice;

      if (i === 1) {
        id_produto = 1;
        quantidade = 100;
        nome_indice = 'ipca';
      } else if (i === 2) {
        id_produto = 2;
        quantidade = 200;
        nome_indice = 'igpm';
      } else {
        id_produto = (i % numProdutos) + 1;
        quantidade = null;
        nome_indice = null;
      }

      const proximoReajuste = getRandomDate(2010, 2026);
      
      contratos.push({
        id_cliente: (i % numClientes) + 1,
        id_produto,
        faturado: 0,
        id_faturado: (i % numFaturado) + 1,
        dia_vencimento: (i % 30) + 1,
        indice_reajuste: Math.random() * 5,
        proximo_reajuste: proximoReajuste,
        status: 'ativo',
        duracao: 12 * (i % 3 + 1),
        valor_mensal: (Math.random() * 1000).toFixed(2),
        quantidade,
        descricao: `Descrição do contrato ${i}`,
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
