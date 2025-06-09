const fs = require('fs');
const path = require('path');

//const secretsPath = path.join('C:\\Users\\NATHAN.BRANDAO\\Documents\\dev\\scrts\\db.json');

// function loadSecrets() {
//   try {
//     const rawData = fs.readFileSync(secretsPath, 'utf8');
//     return JSON.parse(rawData);
//   } catch (error) {
//     console.error('Erro ao carregar secrets.json:', error.message);
//     process.exit(1);
//   }
// }

// const secrets = loadSecrets();

module.exports = {
  host: "localhost",
  dialect: 'mysql',
  username: "root",
  password: "admin",
  database: "sistema_gerenciamento_contratos",
  define: {
    timestamps: true,
    underscored: true,
  },
}
