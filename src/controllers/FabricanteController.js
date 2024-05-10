const Fabricante = require('../models/Fabricante');

module.exports = (app) => {
  app.get('/fabricantes', (req, res) => {
    res.send('TODOS OS FABRICANTES');
  });

  app.post('/fabricantes', (req, res) => {
    res.send('FABRICANTE CRIADO');
  });

  app.put('/fabricantes/:id', (req, res) => {
    res.send('FABRICANTE ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/fabricantes/:id', (req, res) => {
    res.send('FABRICANTE DELETADO COM ID: ' + req.params.id);
  });
}