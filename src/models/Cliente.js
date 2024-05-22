const { Model, DataTypes } = require('sequelize');
const { isEmail, isDate, isMobilePhone } = require('validator');

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: 'O nome deve ter entre 3 e 255 caracteres'
          }
        }
      },
      cpf_cnpj: DataTypes.STRING,
      relacionamento: DataTypes.STRING,
      nps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'O NPS mínimo é 0'
          },
          max: {
            args: [10],
            msg: 'O NPS máximo é 10'
          }
        }
      },
      seguimento: DataTypes.STRING,
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'Data de criação inválida'
          }
        }
      },
      gestor_contratos_nome: DataTypes.STRING,
      gestor_contratos_email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'Email inválido'
          }
        }
      },
      gestor_contratos_nascimento: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: 'Data de nascimento inválida'
          }
        }
      },
      gestor_contratos_telefone_1: {
        type: DataTypes.STRING,
        validate: {
          isMobilePhone: {
            options: ['pt-BR'],
            msg: 'Telefone inválido'
          }
        }
      },
      gestor_contratos_telefone_2: {
        type: DataTypes.STRING,
        validate: {
          isMobilePhone: {
            options: ['pt-BR'],
            msg: 'Telefone inválido'
          }
        }
      },
      gestor_chamados_nome: DataTypes.STRING,
      gestor_chamados_email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'Email inválido'
          }
        }
      },
      gestor_chamados_nascimento: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: 'Data de nascimento inválida'
          }
        }
      },
      gestor_chamados_telefone_1: {
        type: DataTypes.STRING,
        validate: {
          isMobilePhone: {
            options: ['pt-BR'],
            msg: 'Telefone inválido'
          }
        }
      },
      gestor_chamados_telefone_2: {
        type: DataTypes.STRING,
        validate: {
          isMobilePhone: {
            options: ['pt-BR'],
            msg: 'Telefone inválido'
          }
        }
      },
      gestor_financeiro_nome: DataTypes.STRING,
      gestor_financeiro_email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'Email inválido'
          }
        }
      },
      gestor_financeiro_nascimento: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: 'Data de nascimento inválida'
          }
        }
      },
      gestor_financeiro_telefone_1: {
        type: DataTypes.STRING,
        validate: {
          isMobilePhone: {
            options: ['pt-BR'],
            msg: 'Telefone inválido'
          }
        }
      },
      gestor_financeiro_telefone_2: {
        type: DataTypes.STRING,
        validate: {
          isMobilePhone: {
            options: ['pt-BR'],
            msg: 'Telefone inválido'
          }
        }
      }
    }, {
      sequelize,
      tableName: 'clientes'
    });
  }

  static associate(models) {
    this.hasMany(models.Contrato, { foreignKey: 'id_cliente', as: 'contratos' });
  }

}

module.exports = Cliente;
