'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_insert_contrato
      AFTER INSERT ON contratos
      FOR EACH ROW
      BEGIN
        INSERT INTO fila_reajustes (dt_proximo_reajuste, id_contrato, created_at, updated_at)
        VALUES (NEW.proximo_reajuste, NEW.id, NOW(), NOW());
      END;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_insert_contrato;`);
  },
};
