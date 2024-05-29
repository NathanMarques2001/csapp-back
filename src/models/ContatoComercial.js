const { Model, DataTypes } = require('sequelize');

class ContatoComercial extends Model {
  static init(sequelize) {
    super.init({
      id_contrato: DataTypes.INTEGER,
      conteudo: DataTypes.TEXT
    }, {
      sequelize,
      modelName: 'ContatoComercial',
      tableName: 'contatos_comerciais'
    });
  }

  static associate(models) {
    this.belongsTo(models.Contrato, { foreignKey: 'id_contrato', as: 'contratos' });
  }
  
}

module.exports = ContatoComercial;
