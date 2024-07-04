'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('contatos_comerciais', 'id_cliente', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.removeColumn('contatos_comerciais', 'id_contrato');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('contatos_comerciais', 'id_contrato', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contratos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.removeColumn('contatos_comerciais', 'id_cliente');
  }
};
