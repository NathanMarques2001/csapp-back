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
      sequelize,
      tableName: 'contratos'
    });
  }

  static associate(models) {
    this.hasMany(models.ContatoComercial, { foreignKey: 'id_contrato', as: 'contatos_comerciais' });
    this.hasMany(models.ContatoTecnico, { foreignKey: 'id_contrato', as: 'contatos_tecnicos' });
    this.hasMany(models.Log, { foreignKey: 'id_contrato', as: 'logs' });
    this.hasMany(models.FatosImportantes, { foreignKey: 'id_contrato', as: 'fatos_importantes' });
    this.belongsTo(models.Cliente, { foreignKey: 'id_cliente', as: 'clientes' });
    this.belongsTo(models.Produto, { foreignKey: 'id_produto', as: 'produtos' });
  }
}

module.exports = Contrato;