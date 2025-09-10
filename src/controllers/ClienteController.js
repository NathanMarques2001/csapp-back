const Cliente = require("../models/Cliente");
const Contrato = require("../models/Contrato");
const classifyCustomers = require("../utils/classifyCustomers");
const { cpf, cnpj } = require("cpf-cnpj-validator");
const { Op } = require("sequelize");

const EXCEPTION_LIST = ["38532573000175"]; // ITA ALIMENTOS

function validateCPFOrCNPJ(cpf_cnpj, res) {
  const documento = cpf_cnpj.replace(/[^\d]/g, "");

  if (EXCEPTION_LIST.includes(documento)) return;

  const isValid =
    (documento.length === 11 && cpf.isValid(documento)) ||
    (documento.length === 14 && cnpj.isValid(documento));

  if (!isValid) {
    return res.status(400).send({
      message: documento.length === 11 ? "CPF inválido!" : "CNPJ inválido!",
    });
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  async index(req, res) {
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).send({ message: "Cliente não encontrado!" });
      }

      return res.status(200).send({ cliente });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Erro ao buscar o cliente." });
    }
  },

  async indexGrupoEconomico(req, res) {
    try {
      const { id } = req.params;
      const clientes = await Cliente.findAll({
        where: { id_grupo_economico: id },
      });

      if (clientes.length === 0) {
        return res.status(404).send({ message: "Nenhum cliente cadastrado!" });
      }

      return res.status(200).send({ clientes });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar os clientes." });
    }
  },

  async indexAll(req, res) {
    try {
      const clientes = await Cliente.findAll({
        order: [["nome_fantasia", "ASC"]],
      });

      if (clientes.length === 0) {
        return res.status(404).send({ message: "Nenhum cliente cadastrado!" });
      }

      return res.status(200).send({ clientes });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Erro ao buscar os clientes." });
    }
  },

  async migrate(req, res) {
    try {
      const { antigo_vendedor, novo_vendedor } = req.body;

      await Cliente.update(
        { id_usuario: novo_vendedor },
        { where: { id_usuario: antigo_vendedor } },
      );

      return res
        .status(200)
        .send({ message: "Migração de clientes realizada com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao migrar os clientes." });
    }
  },

  async inactiveOrActive(req, res) {
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).send({ message: "Cliente não encontrado!" });
      }

      if (cliente.status === "ativo") {
        await Cliente.update({ status: "inativo" }, { where: { id } });
        await Contrato.update(
          { status: "inativo" },
          { where: { id_cliente: id } },
        );
        await classifyCustomers();
      } else {
        await Cliente.update({ status: "ativo" }, { where: { id } });
      }

      return res
        .status(200)
        .send({ message: "Cliente e contratos inativados com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao inativar o cliente." });
    }
  },

  async store(req, res) {
    try {
      const {
        razao_social,
        nome_fantasia,
        cpf_cnpj,
        id_usuario,
        nps,
        id_segmento,
        gestor_contratos_nome,
        gestor_contratos_email,
        gestor_contratos_nascimento,
        gestor_contratos_telefone_1,
        gestor_contratos_telefone_2,
        gestor_chamados_nome,
        gestor_chamados_email,
        gestor_chamados_nascimento,
        gestor_chamados_telefone_1,
        gestor_chamados_telefone_2,
        gestor_financeiro_nome,
        gestor_financeiro_email,
        gestor_financeiro_nascimento,
        gestor_financeiro_telefone_1,
        gestor_financeiro_telefone_2,
        id_grupo_economico,
        tipo_unidade,
      } = req.body;

      const validationError = validateCPFOrCNPJ(cpf_cnpj, res);
      if (validationError) return validationError;

      const data_criacao = formatDate(new Date());

      const cliente = await Cliente.create({
        razao_social,
        nome_fantasia,
        cpf_cnpj,
        id_usuario,
        nps,
        id_segmento,
        data_criacao,
        gestor_contratos_nome,
        gestor_contratos_email,
        gestor_contratos_nascimento,
        gestor_contratos_telefone_1,
        gestor_contratos_telefone_2,
        gestor_chamados_nome,
        gestor_chamados_email,
        gestor_chamados_nascimento,
        gestor_chamados_telefone_1,
        gestor_chamados_telefone_2,
        gestor_financeiro_nome,
        gestor_financeiro_email,
        gestor_financeiro_nascimento,
        gestor_financeiro_telefone_1,
        gestor_financeiro_telefone_2,
        id_grupo_economico,
        tipo_unidade,
      });

      return res.status(201).send({
        message: "Cliente criado com sucesso!",
        cliente,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao criar o cliente." });
    }
  },

  async update(req, res) {
    try {
      const {
        razao_social,
        nome_fantasia,
        cpf_cnpj,
        id_usuario,
        nps,
        id_segmento,
        gestor_contratos_nome,
        gestor_contratos_email,
        gestor_contratos_nascimento,
        gestor_contratos_telefone_1,
        gestor_contratos_telefone_2,
        gestor_chamados_nome,
        gestor_chamados_email,
        gestor_chamados_nascimento,
        gestor_chamados_telefone_1,
        gestor_chamados_telefone_2,
        gestor_financeiro_nome,
        gestor_financeiro_email,
        gestor_financeiro_nascimento,
        gestor_financeiro_telefone_1,
        gestor_financeiro_telefone_2,
        status,
        id_grupo_economico,
        tipo_unidade,
      } = req.body;

      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).send({ message: "Cliente não encontrado!" });
      }

      const validationError = validateCPFOrCNPJ(cpf_cnpj, res);
      if (validationError) return validationError;

      await Cliente.update(
        {
          razao_social,
          nome_fantasia,
          cpf_cnpj,
          id_usuario,
          nps,
          id_segmento,
          gestor_contratos_nome,
          gestor_contratos_email,
          gestor_contratos_nascimento,
          gestor_contratos_telefone_1,
          gestor_contratos_telefone_2,
          gestor_chamados_nome,
          gestor_chamados_email,
          gestor_chamados_nascimento,
          gestor_chamados_telefone_1,
          gestor_chamados_telefone_2,
          gestor_financeiro_nome,
          gestor_financeiro_email,
          gestor_financeiro_nascimento,
          gestor_financeiro_telefone_1,
          gestor_financeiro_telefone_2,
          status,
          id_grupo_economico,
          tipo_unidade,
        },
        { where: { id } },
      );

      await classifyCustomers();

      return res
        .status(200)
        .send({ message: "Cliente atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao atualizar o cliente." });
    }
  },

  async gestoresComNascimento(req, res) {
    try {
      const clientes = await Cliente.findAll({
        where: {
          [Op.or]: [
            { gestor_chamados_nascimento: { [Op.ne]: null } },
            { gestor_contratos_nascimento: { [Op.ne]: null } },
            { gestor_financeiro_nascimento: { [Op.ne]: null } },
          ],
        },
        order: [["nome_fantasia", "ASC"]],
      });

      if (!clientes || clientes.length === 0) {
        return res.status(404).send({ message: "Nenhum cliente encontrado!" });
      }

      return res.status(200).send({ clientes });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Erro ao buscar clientes com data de nascimento dos gestores." });
    }
  },
};
