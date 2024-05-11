const { Model, DataTypes } = require('sequelize');

class ContatoTecnico extends Model {
  static init(sequelize) {
    super.init({
      id_contrato: DataTypes.INTEGER,
      conteudo: DataTypes.STRING
    }, {
      sequelize
    });
  }
}

module.exports = ContatoTecnico;