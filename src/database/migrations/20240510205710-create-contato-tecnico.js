'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('contatos_tecnicos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_contrato: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'contratos',
          key: 'id'
        }
      },
      conteudo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_criação: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('contatos_tecnicos');

  }
};
