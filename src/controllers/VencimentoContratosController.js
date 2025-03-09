const VencimentoContratos = require('../models/VencimentoContratos');
const Contrato = require('../models/Contrato');

module.exports = {
  async getAll(req, res) {
    try {
      const vencimentos = await VencimentoContratos.findAll();
      res.status(200).json({ vencimentos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getToday(req, res) {
    try {
      const vencimentos = await VencimentoContratos.findAll({
        where: {
          data_vencimento: new Date()
        }
      });
      res.status(200).json({ vencimentos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { id_contrato, status, data_vencimento } = req.body;
      const contrato = await Contrato.findByPk(id_contrato);

      if (!contrato) {
        return res.status(404).json({ message: 'Contrato não encontrado' });
      }

      const novoVencimento = await VencimentoContratos.create({
        id_contrato,
        status,
        data_vencimento
      });

      res.status(201).json(novoVencimento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      let { status, data_vencimento } = req.body;

      const vencimento = await VencimentoContratos.findByPk(id);
      if (!vencimento) {
        return res.status(404).json({ message: 'Vencimento não encontrado' });
      }

      await vencimento.update({ status, data_vencimento });

      res.status(200).json(vencimento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ,

  async delete(req, res) {
    try {
      const { id } = req.params;
      const vencimento = await VencimentoContratos.findByPk(id);
      if (!vencimento) {
        return res.status(404).json({ message: 'Vencimento não encontrado' });
      }

      await vencimento.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}