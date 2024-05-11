const { Model, DataTypes } = require('sequelize');

class Contrato extends Model {
  static init(sequelize) {
    super.init({
      id_cliente: DataTypes.INTEGER,
      id_produto: DataTypes.INTEGER,
      faturado: DataTypes.BOOLEAN,
      dia_vencimento: DataTypes.INTEGER,
      indice_reajuste: DataTypes.FLOAT,
      proximo_reajuste: DataTypes.DATE,
      status: DataTypes.STRING,
      duracao: DataTypes.INTEGER,
      valor_mensal: DataTypes.DECIMAL(10, 2),
      quantidade: DataTypes.INTEGER,
      email_envio: DataTypes.STRING,
      descricao: DataTypes.TEXT
    }, {
      sequelize
    });
  }
}

module.exports = Contrato;