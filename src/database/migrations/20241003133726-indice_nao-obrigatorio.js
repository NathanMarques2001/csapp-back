"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("contratos", "indice_reajuste", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("contratos", "indice_reajuste", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },
};
