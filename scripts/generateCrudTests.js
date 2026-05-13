const fs = require('fs');
const path = require('path');

const modules = [
  { dir: 'contato-tecnico', noun: 'ContatoTecnico', resource: 'contatos-tecnicos', hasCliente: true, hasDelete: true },
  { dir: 'contato-comercial', noun: 'ContatoComercial', resource: 'contatos-comerciais', hasCliente: true, hasDelete: true },
  { dir: 'fatos-importantes', noun: 'FatosImportantes', resource: 'fatos-importantes', hasCliente: true, hasDelete: true },
  { dir: 'historico', noun: 'Historico', resource: 'historico', hasCliente: true, hasDelete: true }
];

function generateServiceTest(mod) {
  return `const ${mod.noun}Service = require('./${mod.dir}.service');
const ${mod.noun}Repository = require('./${mod.dir}.repository');
const AppError = require('../../utils/AppError');

jest.mock('./${mod.dir}.repository');

describe('${mod.noun}Service', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('findById', () => {
    it('[Success] Retorna entidade por ID', async () => {
      ${mod.noun}Repository.findById.mockResolvedValue({ id: 1 });
      const res = await ${mod.noun}Service.findById(1);
      expect(res.id).toBe(1);
    });

    it('[Validation] Dispara 404 se não encontrado', async () => {
      ${mod.noun}Repository.findById.mockResolvedValue(null);
      await expect(${mod.noun}Service.findById(99)).rejects.toThrow(AppError);
    });
  });

  describe('findAll', () => {
    it('[Success] Lista todas as instâncias', async () => {
      ${mod.noun}Repository.findAll.mockResolvedValue([{ id: 1 }]);
      const res = await ${mod.noun}Service.findAll();
      expect(res).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('[Success] Cria com sucesso', async () => {
      ${mod.noun}Repository.create.mockResolvedValue({ id: 2, nome: 'Test' });
      const res = await ${mod.noun}Service.create({ nome: 'Test' });
      expect(res.id).toBe(2);
    });
  });

  describe('update', () => {
    it('[Success] Autoriza atualização após findById bem-sucedido', async () => {
      ${mod.noun}Repository.findById.mockResolvedValue({ id: 1 });
      ${mod.noun}Repository.update.mockResolvedValue(true);
      const res = await ${mod.noun}Service.update(1, { nome: 'New' });
      expect(res).toBeTruthy();
      expect(${mod.noun}Repository.update).toHaveBeenCalledWith(1, { nome: 'New' });
    });
  });

  ${mod.hasCliente ? "describe('findByClienteId', () => { it('[Success] Lista items de um cliente', async () => { " + mod.noun + "Repository.findByClienteId.mockResolvedValue({ contatos_tecnicos: [], contatos_comerciais: [], fatos: [] }); const res = await " + mod.noun + "Service.findByClienteId(1); expect(res).toBeDefined(); }); });" : ''}


  ${mod.hasDelete ? "describe('delete', () => { it('[Success] Apaga item por id', async () => { " + mod.noun + "Repository.findById.mockResolvedValue({ id: 1 }); " + mod.noun + "Repository.delete.mockResolvedValue(true); const res = await " + mod.noun + "Service.delete(1); expect(res).toBe(true); }); });" : ''}
});
`;
}

function generateControllerTest(mod) {
  const variableName = mod.noun.charAt(0).toLowerCase() + mod.noun.slice(1);
  return `const request = require('supertest');
const app = require('../../index');
const ${mod.noun}Service = require('./${mod.dir}.service');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

jest.mock('./${mod.dir}.service');

describe('${mod.noun}Controller (Integration via Supertest)', () => {
  let tokenAuth;

  beforeAll(() => {
    tokenAuth = jwt.sign({ id: 1, tipo: 'admin' }, authConfig.secret, { expiresIn: '1h' });
  });

  beforeEach(() => { jest.clearAllMocks(); });

  describe('GET Endpoints', () => {
    it('[Success] GET /api/${mod.resource} retorna lista 200', async () => {
      ${mod.noun}Service.findAll.mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get('/api/${mod.resource}').set('Authorization', \`Bearer \${tokenAuth}\`);
      expect(res.status).toBe(200);
    });

    it('[Success] GET /api/${mod.resource}/:id retorna a entidade', async () => {
      ${mod.noun}Service.findById.mockResolvedValue({ id: 1 });
      const res = await request(app).get('/api/${mod.resource}/1').set('Authorization', \`Bearer \${tokenAuth}\`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('${variableName}');
    });
  });

  describe('POST e PUT', () => {
    it('[Success] POST cria e retorna HTTP 201', async () => {
      ${mod.noun}Service.create.mockResolvedValue({ id: 2 });
      const res = await request(app).post('/api/${mod.resource}').set('Authorization', \`Bearer \${tokenAuth}\`).send({ nome: 'Test' });
      expect(res.status).toBe(201);
    });

    it('[Success] PUT atualiza e dispara HTTP 200', async () => {
      ${mod.noun}Service.update.mockResolvedValue(true);
      const res = await request(app).put('/api/${mod.resource}/1').set('Authorization', \`Bearer \${tokenAuth}\`).send({ nome: 'New' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('com sucesso');
    });
  });
});
`;
}

modules.forEach(mod => {
  const basePath = path.join(__dirname, '..', 'src', 'modules', mod.dir);
  if (fs.existsSync(basePath)) {
    fs.writeFileSync(path.join(basePath, mod.dir + '.service.test.js'), generateServiceTest(mod));
    fs.writeFileSync(path.join(basePath, mod.dir + '.controller.test.js'), generateControllerTest(mod));
    console.log('[GERADO] Testes passivos para:', mod.noun);
  } else {
    console.log('[AVISO] Módulo inexistente:', mod.dir);
  }
});
