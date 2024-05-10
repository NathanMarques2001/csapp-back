const sequelize = require('sequelize');
const dbConfig = require('../config/Database.js');

const connection = new sequelize(dbConfig);



module.exports = connection;