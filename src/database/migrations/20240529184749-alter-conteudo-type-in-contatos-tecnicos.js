'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('contatos_tecnicos', 'conteudo', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('contatos_tecnicos', 'conteudo', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
