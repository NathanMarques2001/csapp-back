'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('fila_reajustes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dt_proximo_reajuste: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      id_contrato: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'contratos',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('fila_reajustes');
  }
};
