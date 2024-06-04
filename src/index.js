require('./database');
const express = require('express');
const usuarioRoutes = require('./routes/UsuariosRoutes.js');
const produtoRoutes = require('./routes/ProdutosRoutes.js');
const logsRoutes = require('./routes/LogsRoutes.js');
const fatosImportantesRoutes = require('./routes/FatosImportantesRoutes.js');
const fabricantesRoutes = require('./routes/FabricantesRoutes.js');
const contratosRoutes = require('./routes/ContratosRoutes.js');
const contatosTecnicosRoutes = require('./routes/ContatosTecnicosRoutes.js');
const contatosComerciaisRoutes = require('./routes/ContatosComerciaisRoutes.js');
const clienteRoutes = require('./routes/ClientesRoutes.js');

const port = 8080;
const app = express();

app.use(express.json());
app.use('/usuarios', usuarioRoutes);
app.use('/produtos', produtoRoutes);
app.use('/logs', logsRoutes);
app.use('/fatos-importantes', fatosImportantesRoutes);
app.use('/fabricantes', fabricantesRoutes);
app.use('/contratos', contratosRoutes);
app.use('/contatos-tecnicos', contatosTecnicosRoutes);
app.use('/contatos-comerciais', contatosComerciaisRoutes);
app.use('/clientes', clienteRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});