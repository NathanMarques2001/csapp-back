'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('usuarios', {

    });

  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('usuarios');

  }
};
