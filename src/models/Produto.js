const { Model, DataTypes } = require("sequelize");

class Produto extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        id_fabricante: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["ativo", "inativo"],
        },
        id_categoria_produto: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "categorias_produto",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "produtos",
      },
    );
  }

  static associate(models) {
    this.hasMany(models.Contrato, {
      foreignKey: "id_produto",
      as: "contratos",
    });
    this.belongsTo(models.Fabricante, {
      foreignKey: "id_fabricante",
      as: "fabricantes",
    });
    this.belongsTo(models.CategoriaProduto, {
      foreignKey: "id_categoria_produto",
      as: "categorias_produtos",
    });
  }
}

module.exports = Produto;
