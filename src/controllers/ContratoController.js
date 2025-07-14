const Contrato = require("../models/Contrato");
const Cliente = require("../models/Cliente");
const Produto = require("../models/Produto");
const Faturado = require("../models/Faturado");
const VencimentoContratos = require("../models/VencimentoContratos");
const classifyCustomers = require("../utils/classifyCustomers");
const XLSX = require("xlsx");

module.exports = {
  async index(req, res) {
    try {
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res
          .status(404)
          .send({ message: `Nenhum contrato cadastrado com id ${id}!` });
      }

      return res.status(200).send({ contrato });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar o contrato." });
    }
  },

  async indexClient(req, res) {
    try {
      const { id } = req.params;

      // Se quiser, pode validar se o cliente existe antes
      const clienteExiste = await Cliente.findByPk(id);
      if (!clienteExiste) {
        return res
          .status(404)
          .send({ message: `Cliente ${id} não encontrado!` });
      }

      const contratos = await Contrato.findAll({ where: { id_cliente: id } });

      // Mesmo que esteja vazio, é um resultado válido
      return res.status(200).send({ contratos });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar os contratos." });
    }
  },

  async indexVendedor(req, res) {
    try {
      const { id } = req.params;
      const clientes = await Cliente.findAll({ where: { id_usuario: id } });
      let contratos = [];

      for (let cliente of clientes) {
        const contratosCliente = await Contrato.findAll({
          where: { id_cliente: cliente.id },
        });
        contratos = contratos.concat(contratosCliente);
      }

      if (contratos.length == 0) {
        return res.status(404).send({ message: "Nenhum contrato cadastrado!" });
      }

      return res.status(200).send({ contratos });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar os contratos." });
    }
  },

  async indexAll(req, res) {
    try {
      const contratos = await Contrato.findAll();

      if (contratos.length == 0) {
        return res.status(404).send({ message: "Nenhum contrato cadastrado!" });
      }

      return res.status(200).send({ contratos });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar os contratos." });
    }
  },

  async store(req, res) {
    try {
      const {
        id_cliente,
        id_produto,
        faturado,
        id_faturado,
        dia_vencimento,
        indice_reajuste,
        nome_indice,
        proximo_reajuste,
        status,
        duracao,
        valor_mensal,
        quantidade,
        descricao,
        data_inicio,
        tipo_faturamento,
      } = req.body;

      const contrato = await Contrato.create({
        id_cliente,
        id_produto,
        faturado,
        id_faturado,
        dia_vencimento,
        indice_reajuste,
        nome_indice,
        proximo_reajuste,
        status,
        duracao,
        valor_mensal,
        quantidade,
        descricao,
        data_inicio,
        tipo_faturamento,
      });

      await classifyCustomers();

      const inicio = new Date(data_inicio);
      const vencimento = new Date(inicio.setMonth(inicio.getMonth() + duracao));
      await VencimentoContratos.create({
        id_contrato: contrato.id,
        status: status,
        data_vencimento: vencimento,
      });

      return res.status(201).send({
        message: "Contrato criado com sucesso!",
        contrato,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao criar o contrato." });
    }
  },

  async update(req, res) {
    try {
      const {
        id_cliente,
        id_produto,
        faturado,
        id_faturado,
        dia_vencimento,
        indice_reajuste,
        nome_indice,
        proximo_reajuste,
        status,
        duracao,
        valor_mensal,
        quantidade,
        descricao,
        data_inicio,
        tipo_faturamento,
      } = req.body;
      const { id } = req.params;
      //const containsLetters = /[a-zA-Z]/;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res.status(404).send({ message: "Contrato não encontrado!" });
      } //else if (containsLetters.test(valor_mensal)) {
      //   return res.status(400).send({ message: 'O campo valor mensal só aceita números!' });
      // } else if (containsLetters.test(quantidade)) {
      //   return res.status(400).send({ message: 'O campo quantidade só aceita números!' });
      // }

      await Contrato.update(
        {
          id_cliente,
          id_produto,
          faturado,
          id_faturado,
          dia_vencimento,
          indice_reajuste,
          nome_indice,
          proximo_reajuste,
          status,
          duracao,
          valor_mensal,
          quantidade,
          descricao,
          data_inicio,
          tipo_faturamento,
        },
        { where: { id: id } }
      );

      await classifyCustomers();

      if (data_inicio || status || duracao) {
        const inicio = data_inicio
          ? new Date(data_inicio)
          : new Date(contrato.data_inicio);
        const duracaoContrato = duracao ? duracao : contrato.duracao;
        const vencimento = new Date(
          inicio.setMonth(inicio.getMonth() + Number(duracaoContrato))
        );
        const statusContrato = status ? status : contrato.status;
        await VencimentoContratos.update(
          {
            id_contrato: contrato.id,
            status: statusContrato,
            data_vencimento: vencimento,
          },
          { where: { id_contrato: contrato.id } }
        );
      }

      return res
        .status(200)
        .send({ message: "Contrato atualizado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao atualizar o contrato." });
    }
  },

  async importarContratosExcel(req, res) {
    try {
      console.log("REQ FILE:", req.file?.originalname);

      if (!req.file) {
        return res.status(400).send({ message: "Arquivo não enviado." });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(sheet);

      for (const row of dados) {
        const {
          cpf_cnpj,
          nome_produto,
          nome_faturado, // agora é o nome do faturado
          faturado,
          dia_vencimento,
          indice_reajuste,
          nome_indice,
          proximo_reajuste,
          status,
          duracao,
          valor_mensal,
          quantidade,
          descricao,
          data_inicio,
          tipo_faturamento,
        } = row;

        // Buscar cliente
        const cliente = await Cliente.findOne({ where: { cpf_cnpj } });
        if (!cliente) {
          console.warn(`Cliente não encontrado: ${cpf_cnpj}`);
          continue;
        }

        // Buscar produto
        const produto = await Produto.findOne({
          where: { nome: nome_produto },
        });
        if (!produto) {
          console.warn(`Produto não encontrado: ${nome_produto}`);
          continue;
        }

        // Buscar faturado por nome
        const entidadeFaturada = await Faturado.findOne({
          where: { nome: nome_faturado },
        });
        if (!entidadeFaturada) {
          console.warn(`Faturado não encontrado: ${nome_faturado}`);
          continue;
        }

        // Verifica se já existe contrato
        const contratoExistente = await Contrato.findOne({
          where: {
            id_cliente: cliente.id,
            id_produto: produto.id,
          },
        });

        const dadosContrato = {
          id_cliente: cliente.id,
          id_produto: produto.id,
          faturado: faturado === 1 || faturado === "1" || faturado === true,
          id_faturado: entidadeFaturada.id,
          dia_vencimento,
          indice_reajuste,
          nome_indice,
          proximo_reajuste: proximo_reajuste
            ? new Date(proximo_reajuste)
            : null,
          status: status || "ativo",
          duracao,
          valor_mensal,
          quantidade: quantidade || 1,
          descricao: descricao || "Importado via Excel",
          data_inicio: data_inicio ? new Date(data_inicio) : new Date(),
          tipo_faturamento: tipo_faturamento || "mensal",
        };

        if (contratoExistente) {
          await contratoExistente.update(dadosContrato);
        } else {
          const contratoCriado = await Contrato.create(dadosContrato);

          const vencimento = new Date(dadosContrato.data_inicio);
          vencimento.setMonth(
            vencimento.getMonth() + parseInt(dadosContrato.duracao)
          );

          await VencimentoContratos.create({
            id_contrato: contratoCriado.id,
            status: dadosContrato.status,
            data_vencimento: vencimento,
          });
        }
      }

      await classifyCustomers();

      return res
        .status(200)
        .send({ message: "Importação concluída com sucesso." });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Erro ao importar contratos." });
    }
  },

  // async delete(req, res) {
  //   try {
  //     const { id } = req.params;

  //     const contrato = await Contrato.findByPk(id);

  //     if (!contrato) {
  //       return res.status(404).send({ message: 'Contrato não encontrado!' });
  //     }

  //     await Contrato.destroy({ where: { id: id } });

  //     return res.status(200).send({ message: 'Contrato deletado com sucesso!' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({ message: 'Ocorreu um erro ao deletar o contrato.' });
  //   }
  // }
};
