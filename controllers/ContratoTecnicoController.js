const ContratoTecnico = require('../models/ContratoTecnico');

module.exports = (app) => {
  app.get('/contrato-tecnico', (req, res) => {
    res.send('TODOS OS CONTRATOS TÉCNICOS');
  });

  app.get('/contrato-tecnico/:id', (req, res) => {
    res.send('CONTRATOS TÉCNICOS DO CONTRATO COM ID: ' + req.params.id);
  });

  app.post('/contrato-tecnico', (req, res) => {
    res.send('CONTRATO TÉCNICO CRIADO');
  });

  app.put('/contrato-tecnico/:id', (req, res) => {
    res.send('CONTRATO TÉCNICO ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/contrato-tecnico/:id', (req, res) => {
    res.send('CONTRATO TÉCNICO DELETADO COM ID: ' + req.params.id);
  });
}