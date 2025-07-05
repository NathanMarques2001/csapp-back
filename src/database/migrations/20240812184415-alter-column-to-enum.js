"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("contratos", "status", {
      type: Sequelize.ENUM("ativo", "inativo"),
      defaultValue: "ativo",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("contratos", "status", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
