const ContatoTecnico = require('../models/ContatoTecnico');
const Contrato = require('../models/Contrato');

module.exports = {
  async index(req, res) {
    try {
      const { id_contrato } = req.params;

      const contrato = await Contrato.findByPk(id_contrato, {
        include: { association: 'contatos_tecnicos' }
      });

      if (!contrato) {
        return res.status(404).send({ message: 'Contrato não encontrado!' });
      }

      if (contrato.contatos_tecnicos.length == 0) {
        return res.status(404).send({ message: 'Nenhum contato técnico cadastrado!' });
      }

      return res.status(200).send({ contatos_tecnicos: contrato.contatos_tecnicos });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar os contatos técnicos.' });
    }
  },

  async indexAll(req, res) {
    try {
      const contatosTecnicos = await ContatoTecnico.findAll();

      if (contatosTecnicos.length == 0) {
        return res.status(404).send({ message: 'Nenhum contato técnico cadastrado!' });
      }

      return res.status(200).send({ contatosTecnicos });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar os contatos técnicos.' });
    }
  },

  async store(req, res) {
    try {
      const { id_contrato, conteudo } = req.body;

      const contatoTecnico = await ContatoTecnico.create({ id_contrato, conteudo });

      return res.status(201).send({
        message: 'Contato técnico criado com sucesso!',
        contatoTecnico
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o contato técnico.' });
    }
  },

  async update(req, res) {
    try {
      const { conteudo } = req.body;
      const { id } = req.params;

      const contatoTecnico = await ContatoTecnico.findByPk(id);

      if (!contatoTecnico) {
        return res.status(404).send({ message: 'Contato técnico não encontrado!' });
      }

      ContatoTecnico.update({ conteudo }, { where: { id: id } });

      return res.status(200).send({ message: 'Contato técnico atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o contato técnico.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const contatoTecnico = await ContatoTecnico.findByPk(id);

      if (!contatoTecnico) {
        return res.status(404).send({ message: 'Contato técnico não encontrado!' });
      }

      ContatoTecnico.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Contato técnico deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o contato técnico.' });
    }
  }
}
