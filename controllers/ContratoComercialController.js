const ContratoComercial = require('../models/ContratoComercial');

module.exports = (app) => {
  app.get('/contrato-comercial', (req, res) => {
    res.send('TODOS OS CONTRATOS COMERCIAIS');
  });

  app.get('/contrato-comercial/:id', (req, res) => {
    res.send('CONTRATOS COMERCIAIS DO CONTRATO COM ID: ' + req.params.id);
  });

  app.post('/contrato-comercial', (req, res) => {
    res.send('CONTRATO COMERCIAL CRIADO');
  });

  app.put('/contrato-comercial/:id', (req, res) => {
    res.send('CONTRATO COMERCIAL ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/contrato-comercial/:id', (req, res) => {
    res.send('CONTRATO COMERCIAL DELETADO COM ID: ' + req.params.id);
  });
}