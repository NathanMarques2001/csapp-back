'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('clientes', 'status', {
      type: Sequelize.ENUM('ativo', 'inativo'),
      allowNull: false,
      defaultValue: 'ativo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('clientes', 'status', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
