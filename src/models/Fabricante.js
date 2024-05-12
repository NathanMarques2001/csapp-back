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
}

module.exports = Fabricante;