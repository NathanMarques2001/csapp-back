const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      tipo: DataTypes.STRING,
      senha: DataTypes.STRING,
      logado: DataTypes.BOOLEAN
    }, {
      sequelize,
      tableName: 'usuarios',
      hooks: {
        beforeCreate: (usuario) => {
          const salt = bcrypt.genSaltSync();
          usuario.senha = bcrypt.hashSync(usuario.senha, salt);
        }
      }
    });
  }

  static associate(models) {
    this.hasMany(models.Log, { foreignKey: 'id_usuario', as: 'logs' });
  }
  
}

module.exports = Usuario;