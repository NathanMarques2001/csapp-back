const sequelize = require('sequelize');
const dbConfig = require('../config/Database.js');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Log = require('../models/Log');
const FatosImportantes = require('../models/FatosImportantes');
const Fabricante = require('../models/Fabricante');
const Contrato = require('../models/Contrato');
const ContatoTecnico = require('../models/ContatoTecnico');
const ContatoComercial = require('../models/ContatoComercial');
const Cliente = require('../models/Cliente');

const connection = new sequelize(dbConfig);

Usuario.init(connection);
Produto.init(connection);
Log.init(connection);
FatosImportantes.init(connection);
Fabricante.init(connection);
Contrato.init(connection);
ContatoTecnico.init(connection);
ContatoComercial.init(connection);
Cliente.init(connection);

module.exports = connection;