const axios = require("axios");
const Email = require("../utils/email");
const Contratos = require("../models/Contratos");
const Vendedores = require("../models/Usuario");
const Clientes = require("../models/Cliente");

function MailAvisoVencimento(clienteNome, clienteCNPJ, vencimento, vendedorNome) {
  const subject = `🚨 O contrato do cliente ${clienteNome} vence em breve!`;
  const text = `Olá, ${vendedorNome},\n\nO contrato do seu cliente ${clienteNome} (CNPJ: ${clienteCNPJ}) vence em ${vencimento}.\n\nEntre em contato com ele para verificar a renovação e garantir a continuidade do serviço.\n\nAtenção para não perder o prazo!\n\n(Alguma assinatura)`;
  const html = `<p>Olá, ${vendedorNome},</p><p>O contrato do seu cliente ${clienteNome} (CNPJ: ${clienteCNPJ}) vence em ${vencimento}.</p><p>Entre em contato com ele para verificar a renovação e garantir a continuidade do serviço.</p><p>Atenção para não perder o prazo!</p><p>(Alguma assinatura)</p>`;

  return { subject, text, html };
}

async function lembreteVencimento() {
  try {
    // Chamada para obter os contratos que vencem hoje
    // DEV
    const response = await axios.get("http://localhost:8080/api/vencimento-contratos/hoje");
    // PRD
    //const response = await axios.get("http://20.186.19.140/api/vencimento-contratos/hoje");

    if (response.data && response.data.length > 0) {
      const emailService = new Email();

      for (const contratoVencimento of response.vencimentos) {
        const contrato = await Contratos.findById(contratoVencimento.id_contrato);
        const cliente = await Clientes.findById(contrato.id_cliente);
        const vendedor = await Vendedores.findById(cliente.id_usuario);
        const vendedorNome = vendedor.nome;
        const vendedorEmail = vendedor.email;
        const clienteNome = cliente.nome_fantasia;
        const clienteCNPJ = cliente.cpf_cnpj;
        const vencimento = contratoVencimento.data_vencimento;

        const mailAviso = MailAvisoVencimento(clienteNome, clienteCNPJ, vencimento, vendedorNome);

        const emailData = {
          to: vendedorEmail,
          subject: mailAviso.subject,
          text: mailAviso.text,
          html: mailAviso.html,
        };

        await emailService.sendEmail(emailData);
        console.log(`E-mail enviado para ${vendedorEmail} sobre o contrato de ${clienteNome}.`);
      }
    } else {
      console.log("Nenhum contrato vencendo hoje.");
    }
  } catch (err) {
    console.error("Erro ao verificar vencimento de contratos:", err);
  }
}

lembreteVencimento();
