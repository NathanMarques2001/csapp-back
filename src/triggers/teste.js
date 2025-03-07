const axios = require('axios');

axios.post('http://localhost:8080/api/vencimento-contratos', {
  id_contrato: 1,
  status: 'ativo'
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});