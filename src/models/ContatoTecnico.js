const { Model, DataTypes } = require('sequelize');

class ContatoTecnico extends Model {
  static init(sequelize) {
    super.init({
      id_contrato: DataTypes.INTEGER,
      conteudo: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'contatos_tecnicos'
    });
  }

  static associate(models) {
    this.belongsTo(models.Contrato, { foreignKey: 'id_contrato', as: 'contratos' });
  }
  
}

module.exports = ContatoTecnico;