const Produto = require('../models/Produto');

module.exports = (app) => {
  app.get('/produtos', (req, res) => {
    res.send('TODOS OS PRODUTOS');
  });

  app.post('/produtos', (req, res) => {
    res.send('PRODUTO CRIADO');
  });

  app.put('/produtos/:id', (req, res) => {
    res.send('PRODUTO ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/produtos/:id', (req, res) => {
    res.send('PRODUTO DELETADO COM ID: ' + req.params.id);
  });
}