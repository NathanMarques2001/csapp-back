const { Model, DataTypes } = require('sequelize');

class FilaReajuste extends Model {
  static init(sequelize) {
    super.init({
      id_contrato: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dt_proximo_reajuste: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      }
    }, {
      sequelize,
      tableName: 'fila_reajustes'
    });
  }

  static associate(models) {
    this.belongsTo(models.Contrato, { foreignKey: 'id_contrato', as: 'contrato' });
  }
}

module.exports = FilaReajuste;
