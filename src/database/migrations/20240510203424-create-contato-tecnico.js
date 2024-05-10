'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('contatos_tecnicos', {
    });

  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('contatos_tecnicos');

  }
};
