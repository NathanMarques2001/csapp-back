'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_criar_reprocessamento
      AFTER UPDATE ON contratos_erros_reajuste
      FOR EACH ROW
      BEGIN
        -- Verifica se tentativas_reajuste atingiu 10
        IF NEW.tentativas_reajuste = 10 THEN
          -- Insere um registro na tabela reprocessamentos_contratos
          INSERT INTO reprocessamentos_contratos (id_contrato, erro)
          VALUES (NEW.id_contrato, NEW.erro);
        END IF;
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_criar_reprocessamento;
    `);
  }
};
