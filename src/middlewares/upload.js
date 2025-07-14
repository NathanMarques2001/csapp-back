const multer = require("multer");

const storage = multer.memoryStorage(); // salva em memória para facilitar leitura com XLSX
const upload = multer({ storage });

module.exports = upload;
