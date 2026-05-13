const request = require('supertest');
const app = require('../../index');
const CategoriaProdutoService = require('./categoria-produto.service');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

jest.mock('./categoria-produto.service');

describe('CategoriaProdutoController (Integration via Supertest)', () => {
  let tokenAuth;

  beforeAll(() => {
    tokenAuth = jwt.sign({ id: 1, tipo: 'admin' }, authConfig.secret, { expiresIn: '1h' });
  });

  beforeEach(() => { jest.clearAllMocks(); });

  describe('GET Endpoints', () => {
    it('[Success] GET /api/categorias-produtos retorna lista 200', async () => {
      CategoriaProdutoService.findAll.mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get('/api/categorias-produtos').set('Authorization', `Bearer ${tokenAuth}`);
      expect(res.status).toBe(200);
    });

    it('[Success] GET /api/categorias-produtos/:id retorna a entidade', async () => {
      CategoriaProdutoService.findById.mockResolvedValue({ id: 1 });
      const res = await request(app).get('/api/categorias-produtos/1').set('Authorization', `Bearer ${tokenAuth}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('categoria');
    });
  });

  describe('POST e PUT', () => {
    it('[Success] POST cria e retorna HTTP 201', async () => {
      CategoriaProdutoService.create.mockResolvedValue({ id: 2 });
      const res = await request(app).post('/api/categorias-produtos').set('Authorization', `Bearer ${tokenAuth}`).send({ nome: 'Test' });
      expect(res.status).toBe(201);
    });

    it('[Success] PUT atualiza e dispara HTTP 200', async () => {
      CategoriaProdutoService.update.mockResolvedValue(true);
      const res = await request(app).put('/api/categorias-produtos/1').set('Authorization', `Bearer ${tokenAuth}`).send({ nome: 'New' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('com sucesso');
    });
  });
});
