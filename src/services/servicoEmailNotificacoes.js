const Email = require("./email");
const Usuario = require("../models/Usuario");
const Cliente = require("../models/Cliente");
const Contrato = require("../models/Contrato");

async function enviarEmailNotificacao({ id_usuario, id_contrato, descricao, modulo }) {
    if (!id_usuario) return;

    const usuario = await Usuario.findByPk(id_usuario);
    const contrato = await Contrato.findByPk(id_contrato);
    const cliente = await Cliente.findByPk(contrato.id_cliente);
    if (!usuario || !usuario.email) {
        console.log("[NOTIF_EMAIL] Usuário ou email não encontrado para id_usuario=", id_usuario);
        return;
    }

    const emailService = new Email();
    const subject = `Aviso de ${modulo} Contratual - ${cliente.razao_social}`;
    const text = descricao;
    // ALTERAR URL PARA PRODUÇÃO DEPOIS
    const linkContrato = `http://localhost:3000/edicao-contrato/${id_contrato}`;

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.5;">
        <p>${descricao}</p>

        <div style="margin: 24px 0;">
        <a
            href="${linkContrato}"
            target="_blank"
            style="
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            "
        >
            Acessar contrato
        </a>
        </div>

        <p style="font-size: 12px; color: #777;">
        Este é um aviso automático enviado pelo sistema.
        </p>
    </div>
    `;

    const htmlBase64 = Buffer.from(html, "utf8").toString("base64");

    try {
        await emailService.sendEmail({
            to: "nathanmarques20@yahoo.com.br",
            subject,
            text,
            html: htmlBase64,
        });
        console.log(`[NOTIF_EMAIL] Enviado para ${"nathanmarques20@yahoo.com.br"}`);
    } catch (err) {
        console.error("[NOTIF_EMAIL] Erro ao enviar email:", err);
        throw err;
    }
}

module.exports = { enviarEmailNotificacao };
