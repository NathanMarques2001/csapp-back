const ContatoTecnico = require('../models/ContatoTecnico');

module.exports = (app) => {
  app.get('/contato-tecnico', (req, res) => {
    res.send('TODOS OS CONTATOS TÉCNICOS');
  });

  app.get('/contato-tecnico/:id', (req, res) => {
    res.send('CONTATOS TÉCNICOS DO contato COM ID: ' + req.params.id);
  });

  app.post('/contato-tecnico', (req, res) => {
    res.send('CONTATO TÉCNICO CRIADO');
  });

  app.put('/contato-tecnico/:id', (req, res) => {
    res.send('CONTATO TÉCNICO ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/contato-tecnico/:id', (req, res) => {
    res.send('CONTATO TÉCNICO DELETADO COM ID: ' + req.params.id);
  });
}