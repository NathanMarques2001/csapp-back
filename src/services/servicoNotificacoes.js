const Notificacao = require("../models/Notificacao");
const Contrato = require("../models/Contrato");
const { Op } = require("sequelize");

function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // Ajuste para meses com menos dias
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function diffDays(a, b) {
  const ms = a.setHours(0,0,0,0) - b.setHours(0,0,0,0);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

async function criarNotificacaoUnica({ id_usuario, id_contrato, descricao, modulo }) {
  // Evita duplicar no mesmo dia a mesma mensagem
  const hojeInicio = new Date(); hojeInicio.setHours(0,0,0,0);
  const existe = await Notificacao.findOne({
    where: {
      id_usuario, id_contrato, modulo,
      descricao,
      created_at: { [Op.gte]: hojeInicio }
    }
  });
  if (!existe) {
    await Notificacao.create({ id_usuario, id_contrato, descricao, modulo });
  }
}

async function processarNotificacoesContratos(options = {}) {
  const diasAlvos = options.diasAlvos || [90, 60, 30, 7, 0];
  const agora = new Date();

  const contratos = await Contrato.findAll({
    where: {
        status: 'ativo'
    }
  });

  for (const contrato of contratos) {
    // --- Vencimento calculado: data_inicio + duracao (em meses)
    if (contrato.data_inicio && contrato.duracao) {
      const vencimento = addMonths(new Date(contrato.data_inicio), Number(contrato.duracao));
      const diasVenc = diffDays(new Date(vencimento), new Date(agora));

      if (diasAlvos.includes(diasVenc)) {
        const desc = diasVenc === 0
          ? `Contrato ${contrato.id} vence hoje.`
          : `Contrato ${contrato.id} vence em ${diasVenc} dia(s).`;
        await criarNotificacaoUnica({
          id_usuario: contrato.id_usuario || 2,
          id_contrato: contrato.id,
          descricao: desc,
          modulo: "Contrato"
        });
      }
    }

    // --- Próximo reajuste (data real)
    if (contrato.proximo_reajuste) {
      const diasReaj = diffDays(new Date(contrato.proximo_reajuste), new Date(agora));
      if (diasAlvos.includes(diasReaj)) {
        const desc = diasReaj === 0
          ? `Contrato ${contrato.id} tem reajuste hoje.`
          : `Contrato ${contrato.id} terá reajuste em ${diasReaj} dia(s).`;
        await criarNotificacaoUnica({
          id_usuario: contrato.id_usuario || 2,
          id_contrato: contrato.id,
          descricao: desc,
          modulo: "Reajuste"
        });
      }
    }
  }
}

module.exports = { processarNotificacoesContratos };
