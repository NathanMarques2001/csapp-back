const CategoriaProdutoService = require('./categoria-produto.service');
const catchAsync = require('../../utils/catchAsync');

class CategoriaProdutoController {
  indexAll = catchAsync(async (req, res) => {
    const categorias = await CategoriaProdutoService.findAll();
    return res.status(200).json({ categorias });
  });

  index = catchAsync(async (req, res) => {
    const { id } = req.params;
    const categoria = await CategoriaProdutoService.findById(id);
    return res.status(200).json({ categoria });
  });

  store = catchAsync(async (req, res) => {
    const { nome, status } = req.body;
    const novaCategoria = await CategoriaProdutoService.create({ nome, status });
    return res.status(201).json({
      message: 'Categoria criada com sucesso!',
      categoria: novaCategoria,
    });
  });

  update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { nome, status } = req.body;
    const categoria = await CategoriaProdutoService.update(id, { nome, status });
    return res.status(200).json({ message: 'Categoria atualizada com sucesso!', categoria });
  });
}

module.exports = new CategoriaProdutoController();
