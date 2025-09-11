const Contrato = require("../models/Contrato");
const Cliente = require("../models/Cliente");
const Produto = require("../models/Produto");
const Faturado = require("../models/Faturado");
const Log = require("../models/Log");
const Usuario = require("../models/Usuario");
const VencimentoContratos = require("../models/VencimentoContratos");
const classifyCustomers = require("../utils/classifyCustomers");
const XLSX = require("xlsx");
const removeAccents = require("remove-accents");

async function tratarQuantidade(id_produto, quantidade) {
  let quantidadeFinal = quantidade;
  let aviso = null;

  if (quantidade === undefined || quantidade === null || !id_produto) {
    return { quantidadeFinal: quantidade, aviso: null };
  }

  const produto = await Produto.findByPk(id_produto, { attributes: ["nome"] });
  if (!produto) {
    return { quantidadeFinal: quantidade, aviso: null };
  }

  const nomeNormalizado = removeAccents(produto.nome.trim().toLowerCase());
  const permiteQuantidade =
    nomeNormalizado.includes("backup") || nomeNormalizado.includes("antivirus");

  if (!permiteQuantidade) {
    aviso = `A quantidade '${quantidade}' foi removida (definida como nula), pois o produto '${produto.nome}' não utiliza este campo.`;
    quantidadeFinal = null;
  }

  return { quantidadeFinal, aviso };
}

function normalizarValor(valor) {
  if (valor instanceof Date) {
    return valor.toISOString().split("T")[0]; // só a data
  }
  if (typeof valor === "number") {
    return valor.toString();
  }
  if (typeof valor === "string" && !isNaN(valor)) {
    return parseFloat(valor).toString(); // trata decimais tipo "2500.00"
  }
  return valor;
}

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

      const { quantidadeFinal, aviso } = await tratarQuantidade(
        id_produto,
        quantidade
      );

      const valor_antigo = valor_mensal;

      const contrato = await Contrato.create({
        id_cliente,
        id_produto,
        id_faturado,
        dia_vencimento,
        indice_reajuste,
        nome_indice,
        proximo_reajuste,
        status,
        duracao,
        valor_mensal,
        quantidade: quantidadeFinal,
        descricao,
        data_inicio,
        tipo_faturamento,
        valor_antigo
      });

      await classifyCustomers();

      const inicio = new Date(data_inicio);
      const vencimento = new Date(inicio.setMonth(inicio.getMonth() + duracao));
      await VencimentoContratos.create({
        id_contrato: contrato.id,
        status: status,
        data_vencimento: vencimento,
      });

      let message = "Contrato criado com sucesso!";
      if (aviso) {
        message += ` (Aviso: ${aviso})`;
      }

      return res.status(201).send({ message, contrato });
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
        nome_usuario,
        id_usuario
      } = req.body;
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);
      if (!contrato) {
        return res.status(404).send({ message: "Contrato não encontrado!" });
      }

      const dadosAntigos = contrato.toJSON();

      const { quantidadeFinal, aviso } = await tratarQuantidade(
        id_produto,
        quantidade
      );

      let valor_antigo = contrato.valor_antigo;

      if (normalizarValor(contrato.valor_mensal) !== normalizarValor(valor_mensal)) {
        valor_antigo = contrato.valor_mensal;
      }

      await contrato.update({
        id_cliente,
        id_produto,
        id_faturado,
        dia_vencimento,
        indice_reajuste,
        nome_indice,
        proximo_reajuste,
        status,
        duracao,
        valor_mensal,
        quantidade: quantidadeFinal,
        descricao,
        data_inicio,
        tipo_faturamento,
        valor_antigo
      });

      const dadosNovos = contrato.toJSON();

      // Monta lista de alterações
      const alteracoes = [];
      for (let campo in dadosNovos) {
        if (["createdAt", "updatedAt"].includes(campo)) continue; // ignora

        const antes = normalizarValor(dadosAntigos[campo]);
        const depois = normalizarValor(dadosNovos[campo]);

        if (antes !== depois) {
          alteracoes.push(`${campo}: '${antes}' → '${depois}'`);
        }
      }

      if (alteracoes.length > 0) {
        // Resolve nome do usuário: usa nome_usuario direto ou obtém pelo id_usuario quando fornecido
        let nomeDoUsuario = nome_usuario;
        if (!nomeDoUsuario && id_usuario) {
          const usuario = await Usuario.findByPk(id_usuario, { attributes: ["nome"] });
          nomeDoUsuario = usuario ? usuario.nome : null;
        }
        if (!nomeDoUsuario) nomeDoUsuario = "Sistema"; // fallback para evitar null que quebre a migration

        await Log.create({
          nome_usuario: nomeDoUsuario,
          id_contrato: contrato.id,
          alteracao: alteracoes.join("; "),
        });
      }

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

      let message = "Contrato atualizado com sucesso!";
      if (aviso) {
        message += ` (Aviso: ${aviso})`;
      }

      return res.status(200).send({ message, alteracoes });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao atualizar o contrato." });
    }
  }
  ,

  async importarContratosExcel(req, res) {
    if (!req.file) {
      return res.status(400).send({ message: "Arquivo não enviado." });
    }

    const erros = [],
      sucessos = [],
      avisos = [];
    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
      cellDates: true,
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = XLSX.utils.sheet_to_json(sheet);

    for (const [index, row] of dados.entries()) {
      const linhaExcel = index + 2;

      try {
        let { quantidade, ...demaisCampos } = row;
        const { cpf_cnpj, nome_produto, nome_faturado, ...outrosCampos } =
          demaisCampos;

        if (!cpf_cnpj || !nome_produto) {
          erros.push({
            linha: linhaExcel,
            motivo: "CPF/CNPJ ou Nome do Produto não preenchidos.",
          });
          continue;
        }

        const cliente = await Cliente.findOne({ where: { cpf_cnpj } });
        if (!cliente) {
          erros.push({
            linha: linhaExcel,
            motivo: `Cliente com CPF/CNPJ '${cpf_cnpj}' não encontrado.`,
          });
          continue;
        }

        const produto = await Produto.findOne({
          where: { nome: nome_produto },
        });
        if (!produto) {
          erros.push({
            linha: linhaExcel,
            motivo: `Produto '${nome_produto}' não encontrado.`,
          });
          continue;
        }

        const nomeNormalizado = produto.nome.toLowerCase();
        const permiteQuantidade =
          nomeNormalizado.includes("backup") ||
          nomeNormalizado.includes("antivirus");

        // --- LÓGICA DE TRATAMENTO DA QUANTIDADE ---
        if (
          quantidade !== undefined &&
          quantidade !== null &&
          !permiteQuantidade
        ) {
          avisos.push({
            linha: linhaExcel,
            motivo: `A quantidade '${quantidade}' foi removida (nula), pois o produto '${produto.nome}' não utiliza este campo.`,
          });
          quantidade = null; // Força o valor para null
        }

        const contratoExistente = await Contrato.findOne({
          where: { id_cliente: cliente.id, id_produto: produto.id },
        });

        if (contratoExistente) {
          // --- LÓGICA DE ATUALIZAÇÃO ---
          const dadosParaAtualizar = { ...outrosCampos };
          if (row.quantidade !== undefined)
            dadosParaAtualizar.quantidade = quantidade;

          if (nome_faturado) {
            const entidadeFaturada = await Faturado.findOne({
              where: { nome: nome_faturado },
            });
            if (entidadeFaturada)
              dadosParaAtualizar.id_faturado = entidadeFaturada.id;
            else
              avisos.push({
                linha: linhaExcel,
                motivo: `(UPDATE) Faturado '${nome_faturado}' não encontrado, faturado original mantido.`,
              });
          }

          if (Object.keys(dadosParaAtualizar).length > 0) {
            await contratoExistente.update(dadosParaAtualizar);
            sucessos.push({
              linha: linhaExcel,
              acao: `Contrato ID ${contratoExistente.id} atualizado.`,
            });
          } else {
            sucessos.push({
              linha: linhaExcel,
              acao: "Nenhum dado novo para atualizar.",
            });
          }
        } else {
          // --- LÓGICA DE CRIAÇÃO ---
          const camposObrigatorios = { nome_faturado, ...outrosCampos };
          const camposFaltantes = Object.entries(camposObrigatorios)
            .filter(
              ([, value]) =>
                value === undefined || value === null || value === ""
            )
            .map(([key]) => key);

          if (camposFaltantes.length > 0) {
            erros.push({
              linha: linhaExcel,
              motivo: `Campos obrigatórios não preenchidos: ${camposFaltantes.join(
                ", "
              )}.`,
            });
            continue;
          }

          const entidadeFaturada = await Faturado.findOne({
            where: { nome: nome_faturado },
          });
          if (!entidadeFaturada) {
            erros.push({
              linha: linhaExcel,
              motivo: `(CREATE) Faturado '${nome_faturado}' não encontrado.`,
            });
            continue;
          }

          const dadosParaCriar = {
            id_cliente: cliente.id,
            id_produto: produto.id,
            id_faturado: entidadeFaturada.id,
            quantidade,
            ...outrosCampos,
          };
          const contratoCriado = await Contrato.create(dadosParaCriar);

          const vencimento = new Date(dadosParaCriar.data_inicio);
          vencimento.setMonth(vencimento.getMonth() + dadosParaCriar.duracao);
          await VencimentoContratos.create({
            id_contrato: contratoCriado.id,
            status: dadosParaCriar.status,
            data_vencimento: vencimento,
          });

          sucessos.push({
            linha: linhaExcel,
            acao: `Novo contrato ID ${contratoCriado.id} criado.`,
          });
        }
      } catch (error) {
        erros.push({
          linha: linhaExcel,
          motivo: `Erro inesperado: ${error.message}`,
        });
      }
    }

    // --- Resposta Final com Relatório Completo ---
    await classifyCustomers();

    const statusFinal = erros.length > 0 ? 422 : 200;
    let mensagemFinal = `${sucessos.length} linha(s) processada(s) com sucesso.`;
    if (erros.length > 0)
      mensagemFinal += ` ${erros.length} linha(s) com erros.`;
    if (avisos.length > 0)
      mensagemFinal += ` ${avisos.length} linha(s) com avisos.`;

    return res.status(statusFinal).send({
      message: mensagemFinal,
      summary: {
        sucesso: sucessos.length,
        falhas: erros.length,
        avisos: avisos.length,
      },
      erros,
      avisos,
    });
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
