'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('clientes', {
    });
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('clientes');

  }
};
