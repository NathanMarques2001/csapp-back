"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("clientes", "id_grupo_economico", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "grupos_economicos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("clientes", "id_grupo_economico", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "grupos_economicos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },
};
