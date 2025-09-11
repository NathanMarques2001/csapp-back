const fs = require("fs");
const path = require("path");

const secretsPath = path.join("/var/www/scrt/db.json");
//const secretsPath = path.join(
// "C:/Users/nathan.brandao/OneDrive - FUNDAFFEMG/Documentos/dev/scrts/db.json",
//);

function loadSecrets() {
  try {
    const rawData = fs.readFileSync(secretsPath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Erro ao carregar secrets.json:", error.message);
    process.exit(1);
  }
}

const secrets = loadSecrets();

module.exports = {
  host: secrets.DB_HOST,
  dialect: "mysql",
  username: secrets.DB_USER,
  password: secrets.DB_PASS,
  database: secrets.DB_NAME,
  timezone: "-03:00", // fuso fixo do servidor
  dialectOptions: {
    useUTC: false,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
};

