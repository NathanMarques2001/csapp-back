import axios from "axios";
import Email from "../services/email.js";
import Contrato from "../models/Contrato.js";
import Usuario from "../models/Usuario.js";
import Cliente from "../models/Cliente.js";

function MailAvisoVencimento(clienteNome, clienteCNPJ, vencimento, vendedorNome) {
  const subject = `🚨 O contrato do cliente ${clienteNome} vence em breve!`;
  const text = `Olá, ${vendedorNome},\n\nO contrato do seu cliente ${clienteNome} (CNPJ: ${clienteCNPJ}) vence em ${vencimento}.\n\nEntre em contato com ele para verificar a renovação e garantir a continuidade do serviço.\n\nAtenção para não perder o prazo!\n\n(Alguma assinatura)`;
  const html = `<p>Olá, ${vendedorNome},</p><p>O contrato do seu cliente ${clienteNome} (CNPJ: ${clienteCNPJ}) vence em ${vencimento}.</p><p>Entre em contato com ele para verificar a renovação e garantir a continuidade do serviço.</p><p>Atenção para não perder o prazo!</p><p>(Alguma assinatura)</p>`;

  return { subject, text, html };
}

function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, '0');  // Adiciona zero à esquerda, se necessário
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Meses começam do 0, então somamos 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


async function lembreteVencimento() {
  try {
    const url = "http://localhost:8080";
    //const url = "http://20.186.19.140";
    // Chamada para obter os contratos que vencem hoje
    const response = await axios.get(`${url}/api/vencimento-contratos/hoje`);

    const vencimentos = response.data.vencimentos;

    if (vencimentos && vencimentos.length > 0) {
      const emailService = new Email();

      for (const contratoVencimento of vencimentos) {
        const responseVencimento = await axios.get(`${url}/api/vencimento-contratos/email/${contratoVencimento.id_contrato}`);

        const { cliente_nome: clienteNome, cliente_cnpj: clienteCNPJ, usuario_nome: vendedorNome, usuario_email: vendedorEmail } = responseVencimento.data;

        const formattedVencimento = formatDateToDDMMYYYY(new Date(contratoVencimento.data_vencimento));

        const mailAviso = MailAvisoVencimento(clienteNome, clienteCNPJ, formattedVencimento, vendedorNome);

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