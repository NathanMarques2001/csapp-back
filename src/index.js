require('./database');
const express = require('express');
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

const port = 8080;
const app = express();

app.use(express.json());
app.use(cors());
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});