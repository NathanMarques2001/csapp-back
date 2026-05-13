const path = require("path");
const dotenvResult = require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

if (dotenvResult.error) {
  console.error("[Index.js] Error loading .env:", dotenvResult.error);
} else {
  console.log("[Index.js] .env loaded successfully. Keys found:", Object.keys(dotenvResult.parsed || {}).length);
}

require("./database");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authConfig = require("./config/auth");
require("./config/passportConfig.js");
const cors = require("cors");
const usuarioRoutes = require("./modules/usuario/usuario.routes.js");
const produtoRoutes = require("./modules/produto/produto.routes.js");
const logsRoutes = require("./modules/log/log.routes.js");
const fatosImportantesRoutes = require("./modules/fatos-importantes/fatos-importantes.routes.js");
const fabricantesRoutes = require("./modules/fabricante/fabricante.routes.js");
const contratosRoutes = require("./modules/contrato/contrato.routes.js");
const contatosTecnicosRoutes = require("./modules/contato-tecnico/contato-tecnico.routes.js");
const contatosComerciaisRoutes = require("./modules/contato-comercial/contato-comercial.routes.js");
const clienteRoutes = require("./modules/cliente/cliente.routes.js");
const segmentosRoutes = require("./modules/segmento/segmento.routes.js");
const faturadosRoutes = require("./modules/faturado/faturado.routes.js");
const resetSenhaRoutes = require("./modules/reset-senha/reset-senha.routes.js");
const vencimentoContratos = require("./modules/vencimento-contrato/vencimento-contrato.routes.js");
const gruposEconomicosRoutes = require("./modules/grupo-economico/grupo-economico.routes.js");
const classificacoesClientesRoutes = require("./modules/classificacao-cliente/classificacao-cliente.routes.js");
const categoriasProdutosRoutes = require("./modules/categoria-produto/categoria-produto.routes.js");
const notificacoesRoutes = require("./modules/notificacao/notificacao.routes.js");
const relatoriosRoutes = require("./modules/relatorio/relatorio.routes.js");
const historicoRoutes = require("./modules/historico/historico.routes.js");
const { iniciarCronNotificacoes } = require("./cron/CronNotificacoes.js");

const port = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set("trust proxy", 1);

app.use(
  session({
    secret: authConfig.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax"
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/fatos-importantes", fatosImportantesRoutes);
app.use("/api/fabricantes", fabricantesRoutes);
app.use("/api/contratos", contratosRoutes);
app.use("/api/contatos-tecnicos", contatosTecnicosRoutes);
app.use("/api/contatos-comerciais", contatosComerciaisRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/segmentos", segmentosRoutes);
app.use("/api/faturados", faturadosRoutes);
app.use("/api/reset-senha", resetSenhaRoutes);
app.use("/api/vencimento-contratos", vencimentoContratos);
app.use("/api/grupos-economicos", gruposEconomicosRoutes);
app.use("/api/classificacoes-clientes", classificacoesClientesRoutes);
app.use("/api/categorias-produtos", categoriasProdutosRoutes);
app.use("/api/notificacoes", notificacoesRoutes);
app.use("/api/relatorios", relatoriosRoutes);
app.use("/api/historico", historicoRoutes);

if (process.env.NODE_ENV !== "test") {
  require("./cron/CronHistorico.js");
  iniciarCronNotificacoes();
}

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    const agora = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Iniciado em: ${agora}`);
  });
}

module.exports = app;
