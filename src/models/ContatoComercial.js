const { Model, DataTypes } = require('sequelize');

class ContatoComercial extends Model {
  static init(sequelize) {
    super.init({
      id_cliente: DataTypes.INTEGER,
      conteudo: DataTypes.TEXT
    }, {
      sequelize,
      modelName: 'ContatoComercial',
      tableName: 'contatos_comerciais'
    });
  }

  static associate(models) {
    this.belongsTo(models.Cliente, { foreignKey: 'id_cliente', as: 'clientes' });
  }
  
}

module.exports = ContatoComercial;
