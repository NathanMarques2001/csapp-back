const Contrato = require('../models/Contrato');

module.exports = (app) => {
  app.get('/contratos', (req, res) => {
    res.send('TODOS OS CONTRATOS');
  });

  app.get('/contratos/:id', (req, res) => {
    res.send('CONTRATO COM ID: ' + req.params.id);
  });

  app.post('/contratos', (req, res) => {
    res.send('CONTRATO CRIADO');
  });

  app.put('/contratos/:id', (req, res) => {
    res.send('CONTRATO ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/contratos/:id', (req, res) => {
    res.send('CONTRATO DELETADO COM ID: ' + req.params.id);
  });
}