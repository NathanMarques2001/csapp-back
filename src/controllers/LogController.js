const Log = require('../models/Log');

module.exports = (app) => {
  app.get('/logs', (req, res) => {
    res.send('TODOS OS LOGS');
  });

  app.get('/logs/:id', (req, res) => {
    res.send('LOGS DO CONTRATO COM ID: ' + req.params.id);
  });

  app.post('/logs', (req, res) => {
    res.send('LOG CRIADO');
  });
}