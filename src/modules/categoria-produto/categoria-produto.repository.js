const CategoriaProduto = require('../../models/CategoriaProduto');

class CategoriaProdutoRepository {
  async findById(id) {
    return await CategoriaProduto.findByPk(id);
  }

  async findAll() {
    return await CategoriaProduto.findAll({
      order: [['nome', 'ASC']],
    });
  }

  async findByNome(nome) {
    return await CategoriaProduto.findOne({ where: { nome } });
  }

  async create(data) {
    return await CategoriaProduto.create(data);
  }

  async update(id, data) {
    return await CategoriaProduto.update(data, { where: { id } });
  }
}

module.exports = new CategoriaProdutoRepository();
