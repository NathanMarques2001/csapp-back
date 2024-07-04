'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('fatos_importantes', 'id_cliente', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.removeColumn('fatos_importantes', 'id_contrato');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('fatos_importantes', 'id_contrato', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contratos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.removeColumn('fatos_importantes', 'id_cliente');
  }
};
