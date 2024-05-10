const FatosImportantes = require('../models/FatosImportantes');

module.exports = (app) => {
  app.get('/fatos-importantes', (req, res) => {
    res.send('TODOS OS FATOS IMPORTANTES');
  });

  app.get('/fatos-importantes/:id', (req, res) => {
    res.send('FATOS IMPORTANTES DO CONTRATO COM ID: ' + req.params.id);
  });

  app.post('/fatos-importantes', (req, res) => {
    res.send('FATOS IMPORTANTES CRIADO');
  });

  app.put('/fatos-importantes/:id', (req, res) => {
    res.send('FATOS IMPORTANTES ATUALIZADO COM ID: ' + req.params.id);
  });

  app.delete('/fatos-importantes/:id', (req, res) => {
    res.send('FATOS IMPORTANTES DELETADO COM ID: ' + req.params.id);
  });
}