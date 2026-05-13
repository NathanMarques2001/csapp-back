const CategoriaProdutoService = require('./categoria-produto.service');
const CategoriaProdutoRepository = require('./categoria-produto.repository');
const AppError = require('../../utils/AppError');

jest.mock('./categoria-produto.repository');

describe('CategoriaProdutoService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('findById', () => {
    it('[Success] Retorna entidade por ID', async () => {
      CategoriaProdutoRepository.findById.mockResolvedValue({ id: 1 });
      const res = await CategoriaProdutoService.findById(1);
      expect(res.id).toBe(1);
    });

    it('[Validation] Dispara 404 se não encontrado', async () => {
      CategoriaProdutoRepository.findById.mockResolvedValue(null);
      await expect(CategoriaProdutoService.findById(99)).rejects.toThrow(AppError);
    });
  });

  describe('findAll', () => {
    it('[Success] Lista todas as instâncias', async () => {
      CategoriaProdutoRepository.findAll.mockResolvedValue([{ id: 1 }]);
      const res = await CategoriaProdutoService.findAll();
      expect(res).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('[Success] Cria com sucesso', async () => {
      CategoriaProdutoRepository.create.mockResolvedValue({ id: 2, nome: 'Test' });
      const res = await CategoriaProdutoService.create({ nome: 'Test' });
      expect(res.id).toBe(2);
    });
  });

  describe('update', () => {
    it('[Success] Autoriza atualização após findById bem-sucedido', async () => {
      CategoriaProdutoRepository.findById.mockResolvedValue({ id: 1 });
      CategoriaProdutoRepository.update.mockResolvedValue(true);
      const res = await CategoriaProdutoService.update(1, { nome: 'New' });
      expect(res).toBeTruthy();
      expect(CategoriaProdutoRepository.update).toHaveBeenCalledWith(1, { nome: 'New' });
    });
  });
});
