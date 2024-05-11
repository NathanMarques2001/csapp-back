const { Model, DataTypes } = require('sequelize');

class Log extends Model {
  static init(sequelize) {
    super.init({
      id_usuario: DataTypes.INTEGER,
      id_contrato: DataTypes.INTEGER,
      alteracao: DataTypes.STRING
    }, {
      sequelize
    });
  }
}

module.exports = Log;