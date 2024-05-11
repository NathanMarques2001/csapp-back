'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      id_contrato: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'contratos',
          key: 'id'
        }
      },
      alteracao: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('logs');

  }
};
