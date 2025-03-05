const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class ResetSenha extends Model {
  static init(sequelize) {
    super.init({
      hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      tableName: 'reset_senha'
    });

    this.beforeCreate((hashReset) => {
      hashReset.hash = uuidv4();
      hashReset.expiresAt = new Date(Date.now() + 30 * 60000); // 30 minutos
    });
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuarios' });
  }
}

module.exports = ResetSenha;
