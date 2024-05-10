const ContatoComercial = require('../models/ContatoComercial');

module.exports = (app) => {
  app.get('/contato-comercial', (req, res) => {
    res.send('TODOS OS CONTATOS COMERCIAIS');
  });

  app.get('/contato-comercial/:id', (req, res) => {
    res.send('CONTATOS COMERCIAIS DO CONTRATO COM ID: ' + req.params.id);
  });

  app.post('/contato-comercial', (req, res) => {
    res.send('CONTATO COMERCIAL CRIADO');
  });

  app.put('/contato-comercial/:id', (req, res) => {
    res.send('CONTATO COMERCIAL ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/contato-comercial/:id', (req, res) => {
    res.send('CONTATO COMERCIAL DELETADO COM ID: ' + req.params.id);
  });
}