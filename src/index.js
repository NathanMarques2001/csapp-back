require("./database");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
//const authConfig = require("/var/www/scrt/secret.json");
const authConfig = require("C:/Users/nathan.brandao/OneDrive - FUNDAFFEMG/Documentos/dev/scrts/secret.json");
require("./config/passportConfig.js");
const cors = require("cors");
const usuarioRoutes = require("./routes/UsuariosRoutes.js");
const produtoRoutes = require("./routes/ProdutosRoutes.js");
const logsRoutes = require("./routes/LogsRoutes.js");
const fatosImportantesRoutes = require("./routes/FatosImportantesRoutes.js");
const fabricantesRoutes = require("./routes/FabricantesRoutes.js");
const contratosRoutes = require("./routes/ContratosRoutes.js");
const contatosTecnicosRoutes = require("./routes/ContatosTecnicosRoutes.js");
const contatosComerciaisRoutes = require("./routes/ContatosComerciaisRoutes.js");
const clienteRoutes = require("./routes/ClientesRoutes.js");
const segmentosRoutes = require("./routes/SegmentosRoutes.js");
const faturadosRoutes = require("./routes/FaturadosRoutes.js");
const reajustaContratosRoutes = require("./routes/ReajustaContratosRoutes.js");
const resetSenhaRoutes = require("./routes/ResetSenhaRoutes.js");
const vencimentoContratos = require("./routes/VencimentoContratosRoute.js");
const gruposEconomicosRoutes = require("./routes/GruposEconomicosRoutes.js");
const classificacoesClientesRoutes = require("./routes/ClassificacoesClientesRoutes.js");
const categoriasProdutosRoutes = require("./routes/CategoriasProdutosRoutes.js");

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
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 60 * 60 * 1000,
    },
  }),
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
app.use("/api/reajusta-contratos", reajustaContratosRoutes);
app.use("/api/reset-senha", resetSenhaRoutes);
app.use("/api/vencimento-contratos", vencimentoContratos);
app.use("/api/grupos-economicos", gruposEconomicosRoutes);
app.use("/api/classificacoes-clientes", classificacoesClientesRoutes);
app.use("/api/categorias-produtos", categoriasProdutosRoutes);

app.listen(port, () => {
  const agora = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Iniciado em: ${agora}`);
});
