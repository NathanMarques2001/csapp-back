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
const Segmento = require('../models/Segmento');
const Faturado = require('../models/Faturado');

const connection = new sequelize(dbConfig);

const tables = [Usuario, Produto, Log, FatosImportantes, Fabricante, Contrato, ContatoTecnico, ContatoComercial, Cliente, Segmento, Faturado];

tables.forEach(table => {
  table.init(connection);
});

tables.forEach(table => {
  table.associate(connection.models);
});

module.exports = connection;