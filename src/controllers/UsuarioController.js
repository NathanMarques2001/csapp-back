const Usuario = require('../models/Usuario');

module.exports = (app) => {
  app.get('/usuarios', (req, res) => {
    res.send('TODOS OS USUÁRIOS');
  });

  app.get('/usuarios/:id', (req, res) => {
    res.send('USUÁRIO COM ID: ' + req.params.id);
  });

  app.post('/usuarios', (req, res) => {
    res.send('USUÁRIO CRIADO');
  });

  app.put('/usuarios/:id', (req, res) => {
    res.send('USUÁRIO ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/usuarios/:id', (req, res) => {
    res.send('USUÁRIO DELETADO COM ID: ' + req.params.id);
  });
}