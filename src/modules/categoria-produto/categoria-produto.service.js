const CategoriaProdutoRepository = require('./categoria-produto.repository');
const AppError = require('../../utils/AppError');

class CategoriaProdutoService {
  async findById(id) {
    const categoria = await CategoriaProdutoRepository.findById(id);
    if (!categoria) {
      throw new AppError('Categoria não encontrada.', 404);
    }
    return categoria;
  }

  async findAll() {
    return await CategoriaProdutoRepository.findAll();
  }

  async create(data) {
    const { nome, status } = data;
    const categoriaExistente = await CategoriaProdutoRepository.findByNome(nome);
    if (categoriaExistente) {
      throw new AppError('Já existe uma categoria com esse nome.', 400);
    }

    const novaCategoria = await CategoriaProdutoRepository.create({
      nome,
      status: status || 'ativo',
    });
    return novaCategoria;
  }

  async update(id, data) {
    await this.findById(id);
    await CategoriaProdutoRepository.update(id, data);
    
    // To return the updated category
    return await CategoriaProdutoRepository.findById(id);
  }
}

module.exports = new CategoriaProdutoService();
