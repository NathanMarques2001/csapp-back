const { Model, DataTypes } = require('sequelize');

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      cpf_cnpj: DataTypes.STRING,
      relacionamento: DataTypes.STRING,
      nps: DataTypes.INTEGER,
      seguimento: DataTypes.STRING,
      data_criacao: DataTypes.DATE,
      gestor_contratos_nome: DataTypes.STRING,
      gestor_contratos_email: DataTypes.STRING,
      gestor_contratos_nascimento: DataTypes.DATE,
      gestor_contratos_telefone_1: DataTypes.STRING,
      gestor_contratos_telefone_2: DataTypes.STRING,
      gestor_chamados_nome: DataTypes.STRING,
      gestor_chamados_email: DataTypes.STRING,
      gestor_chamados_nascimento: DataTypes.DATE,
      gestor_chamados_telefone_1: DataTypes.STRING,
      gestor_chamados_telefone_2: DataTypes.STRING,
      gestor_financeiro_nome: DataTypes.STRING,
      gestor_financeiro_email: DataTypes.STRING,
      gestor_financeiro_nascimento: DataTypes.DATE,
      gestor_financeiro_telefone_1: DataTypes.STRING,
      gestor_financeiro_telefone_2: DataTypes.STRING
    }, {
      sequelize
    });
  }
}

module.exports = Cliente;
