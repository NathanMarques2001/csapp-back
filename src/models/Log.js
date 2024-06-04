const { Model, DataTypes } = require('sequelize');

class Log extends Model {
  static init(sequelize) {
    super.init({
      id_usuario: DataTypes.INTEGER,
      id_contrato: DataTypes.INTEGER,
      alteracao: DataTypes.TEXT
    }, {
      sequelize,
      tableName: 'logs'
    });
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuarios' });
    this.belongsTo(models.Contrato, { foreignKey: 'id_contrato', as: 'contratos' });
  }
  
}

module.exports = Log;
