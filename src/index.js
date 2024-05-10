const customExpress = require('../config/CustomExpress');
const port = 3000;

const custom = customExpress();
custom.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});