'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('contatos_comerciais', {
    });
    
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('contatos_comerciais');

  }
};
