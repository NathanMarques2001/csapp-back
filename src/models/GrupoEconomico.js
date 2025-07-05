const { Model, DataTypes } = require("sequelize");

class GrupoEconomico extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        id_usuario: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        nps: {
          type: DataTypes.INTEGER,
          validate: {
            min: {
              args: [0],
              msg: "O NPS mínimo é 0",
            },
            max: {
              args: [10],
              msg: "O NPS máximo é 10",
            },
          },
        },
        id_segmento: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["ativo", "inativo"],
        },
        tipo: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "grupos_economicos",
      },
    );
  }

  static associate(models) {
    this.hasMany(models.Cliente, {
      foreignKey: "id_grupo_economico",
      as: "clientes",
    });
    this.belongsTo(models.Usuario, {
      foreignKey: "id_usuario",
      as: "usuarios",
    });
  }
}

module.exports = GrupoEconomico;
