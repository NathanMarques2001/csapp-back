"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criação da tabela grupos_economicos
    await queryInterface.createTable("grupos_economicos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nps: {
        type: Sequelize.INTEGER,
      },
      id_segmento: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("ativo", "inativo"),
        allowNull: false,
        defaultValue: "ativo",
      },
      tipo: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Tornar campos opcionais na tabela clientes
    await Promise.all([
      queryInterface.changeColumn("clientes", "id_usuario", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.changeColumn("clientes", "nps", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.changeColumn("clientes", "id_segmento", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);

    // Adicionar id_grupo_economico e tipo_unidade na tabela clientes
    await queryInterface.addColumn("clientes", "id_grupo_economico", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "grupos_economicos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("clientes", "tipo_unidade", {
      type: Sequelize.ENUM("matriz", "filial"),
      allowNull: false,
      defaultValue: "matriz",
    });
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("clientes", "tipo_unidade"),
      queryInterface.removeColumn("clientes", "id_grupo_economico"),
    ]);

    await Promise.all([
      queryInterface.changeColumn("clientes", "id_usuario", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.changeColumn("clientes", "nps", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.changeColumn("clientes", "id_segmento", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]);

    await queryInterface.dropTable("grupos_economicos");

    // Drop enums (apenas para PostgreSQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_grupos_economicos_status";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_clientes_tipo_unidade";',
    );
  },
};
