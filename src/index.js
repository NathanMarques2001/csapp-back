require('./database');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passportConfig.js');
const cors = require('cors');
const usuarioRoutes = require('./routes/UsuariosRoutes.js');
const produtoRoutes = require('./routes/ProdutosRoutes.js');
const logsRoutes = require('./routes/LogsRoutes.js');
const fatosImportantesRoutes = require('./routes/FatosImportantesRoutes.js');
const fabricantesRoutes = require('./routes/FabricantesRoutes.js');
const contratosRoutes = require('./routes/ContratosRoutes.js');
const contatosTecnicosRoutes = require('./routes/ContatosTecnicosRoutes.js');
const contatosComerciaisRoutes = require('./routes/ContatosComerciaisRoutes.js');
const clienteRoutes = require('./routes/ClientesRoutes.js');
const segmentosRoutes = require('./routes/SegmentosRoutes.js');
const faturadosRoutes = require('./routes/FaturadosRoutes.js');
const reajustaContratosRoutes = require('./routes/ReajustaContratosRoutes.js');
const resetSenhaRoutes = require('./routes/ResetSenhaRoutes.js');
const vencimentoContratos = require('./routes/VencimentoContratosRoute.js');

const port = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(session({
  secret: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // coloca algo seguro, de preferência variável de ambiente
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true se for HTTPS (produção)
    maxAge: 60 * 60 * 1000 // 1 hora
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/fatos-importantes', fatosImportantesRoutes);
app.use('/api/fabricantes', fabricantesRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/contatos-tecnicos', contatosTecnicosRoutes);
app.use('/api/contatos-comerciais', contatosComerciaisRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/segmentos', segmentosRoutes);
app.use('/api/faturados', faturadosRoutes);
app.use('/api/reajusta-contratos', reajustaContratosRoutes);
app.use('/api/reset-senha', resetSenhaRoutes);
app.use('/api/vencimento-contratos', vencimentoContratos);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});