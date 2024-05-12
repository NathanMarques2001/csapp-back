const { Model, DataTypes } = require('sequelize');

class FatosImportantes extends Model {
  static init(sequelize) {
    super.init({
      id_contrato: DataTypes.INTEGER,
      conteudo: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'fatos_importantes'
    });
  }
}

module.exports = FatosImportantes;