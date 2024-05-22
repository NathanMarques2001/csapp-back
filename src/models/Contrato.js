const { Model, DataTypes } = require('sequelize');

class Contrato extends Model {
  static init(sequelize) {
    super.init({
      id_cliente: DataTypes.INTEGER,
      id_produto: DataTypes.INTEGER,
      faturado: DataTypes.BOOLEAN,
      dia_vencimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isFuture(value) {
            if (new Date(value) <= new Date()) {
              throw new Error('O dia de vencimento deve ser uma data futura.');
            }
          },
        },
      },
      indice_reajuste: DataTypes.FLOAT,
      proximo_reajuste: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isFuture(value) {
            if (new Date(value) <= new Date()) {
              throw new Error('A data do próximo reajuste deve ser uma data futura.');
            }
          },
        },
      },
      status: DataTypes.STRING,
      duracao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'A duração não pode ser menor que zero.',
          },
        },
      },
      valor_mensal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'O valor mensal não pode ser menor que zero.',
          },
        },
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'A quantidade não pode ser menor que zero.',
          },
        },
      },
      email_envio: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      descricao: DataTypes.TEXT,
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
