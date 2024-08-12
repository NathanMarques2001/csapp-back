const { Model, DataTypes } = require('sequelize');

class Contrato extends Model {
  static init(sequelize) {
    super.init({
      id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      faturado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      faturado_por: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dia_vencimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      indice_reajuste: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      nome_indice: DataTypes.STRING,
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
      status: {
        type: DataTypes.ENUM,
        values: ['ativo', 'inativo'],
        allowNull: false
      },
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
        validate: {
          min: {
            args: [0],
            msg: 'A quantidade não pode ser menor que zero.',
          },
        },
      },
      descricao: DataTypes.TEXT,
    }, {
      sequelize,
      tableName: 'contratos'
    });
  }

  static associate(models) {
    this.hasMany(models.Log, { foreignKey: 'id_contrato', as: 'logs' });
    this.belongsTo(models.Cliente, { foreignKey: 'id_cliente', as: 'clientes' });
    this.belongsTo(models.Produto, { foreignKey: 'id_produto', as: 'produtos' });
  }
}

module.exports = Contrato;
