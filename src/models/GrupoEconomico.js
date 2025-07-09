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
  }
}

module.exports = GrupoEconomico;
