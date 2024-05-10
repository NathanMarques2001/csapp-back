const Cliente = require('../models/Cliente');

module.exports = (app) => {
  app.get('/clientes', (req, res) => {
    res.send('TODOS OS CLIENTES');
  });

  app.get('/clientes/:id', (req, res) => {
    res.send('CLIENTE COM ID: ' + req.params.id);
  });

  app.post('/clientes', (req, res) => {
    res.send('CLIENTE CRIADO');
  });

  app.put('/clientes/:id', (req, res) => {
    res.send('CLIENTE ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/clientes/:id', (req, res) => {
    res.send('CLIENTE DELETADO COM ID: ' + req.params.id);
  });
}