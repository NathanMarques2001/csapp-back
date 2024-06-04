module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('contatos_comerciais', 'conteudo', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('contatos_comerciais', 'conteudo', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
