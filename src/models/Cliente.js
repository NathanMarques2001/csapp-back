const { Model, DataTypes } = require('sequelize');

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      razao_social: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 255],
            msg: 'A razão deve ter entre 3 e 255 caracteres'
          }
        }
      },
      nome_fantasia: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: 'O nome fantasia deve ter entre 3 e 255 caracteres'
          }
        }
      },
      cpf_cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      id_usuario: DataTypes.INTEGER,
      nps: DataTypes.INTEGER,
      id_segmento: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM,
        values: ['ativo', 'inativo']
      },
      tipo: DataTypes.STRING,
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'Data de criação inválida'
          }
        }
      },
      gestor_contratos_nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      gestor_contratos_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Email inválido'
          }
        }
      },
      gestor_contratos_nascimento: DataTypes.STRING,
      gestor_contratos_telefone_1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gestor_contratos_telefone_2: DataTypes.STRING,
      gestor_chamados_nome: DataTypes.STRING,
      gestor_chamados_email: DataTypes.STRING,
      gestor_chamados_nascimento: DataTypes.STRING,
      gestor_chamados_telefone_1: DataTypes.STRING,
      gestor_chamados_telefone_2: DataTypes.STRING,
      gestor_financeiro_nome: DataTypes.STRING,
      gestor_financeiro_email: DataTypes.STRING,
      gestor_financeiro_nascimento: DataTypes.STRING,
      gestor_financeiro_telefone_1: DataTypes.STRING,
      gestor_financeiro_telefone_2: DataTypes.STRING,
      id_grupo_economico: DataTypes.INTEGER,
      tipo_unidade: {
        type: DataTypes.ENUM,
        values: ['matriz', 'filial'],
        allowNull: false,
        defaultValue: 'matriz'
      }
    }, {
      sequelize,
      tableName: 'clientes'
    });
  }

  static associate(models) {
    this.hasMany(models.Contrato, { foreignKey: 'id_cliente', as: 'contratos' });
    this.hasMany(models.ContatoComercial, { foreignKey: 'id_cliente', as: 'contatos_comerciais' });
    this.hasMany(models.ContatoTecnico, { foreignKey: 'id_cliente', as: 'contatos_tecnicos' });
    this.hasMany(models.FatosImportantes, { foreignKey: 'id_cliente', as: 'fatos_importantes' });
    this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuarios' });
    this.belongsTo(models.Segmento, { foreignKey: 'id_segmento', as: 'segmentos' });
    this.belongsTo(models.GrupoEconomico, { foreignKey: 'id_grupo_economico', as: 'grupos_economicos' });
  }

}

module.exports = Cliente;
