'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('logs', 'alteracao', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('logs', 'alteracao', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
