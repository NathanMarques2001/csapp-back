const { Model, DataTypes } = require('sequelize');

class FatosImportantes extends Model {
  static init(sequelize) {
    super.init({
      id_cliente: DataTypes.INTEGER,
      conteudo: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'fatos_importantes'
    });
  }

  static associate(models) {
    this.belongsTo(models.Cliente, { foreignKey: 'id_cliente', as: 'clientes' });
  }

}

module.exports = FatosImportantes;