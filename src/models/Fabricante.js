const { Model, DataTypes } = require('sequelize');

class Fabricante extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'fabricantes'
    });
  }

  static associate(models) {
    this.hasMany(models.Produto, { foreignKey: 'id_fabricante', as: 'produtos' });
  }
  
}

module.exports = Fabricante;