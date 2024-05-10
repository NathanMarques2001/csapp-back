'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('fatos_importantes', {

    });

  },

  async down(queryInterface, Sequelize) {

    return queryInterface.dropTable('fatos_importantes');

  }
};
