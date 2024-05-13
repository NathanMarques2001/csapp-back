const ContatoComercial = require('../models/ContatoComercial');
const Contrato = require('../models/Contrato');

module.exports = {
  async index(req, res) {
    try {
      const { id_contrato } = req.params;

      const contrato = await Contrato.findByPk(id_contrato, {
        include: { association: 'contatos_comerciais' }
      });

      if (!contrato) {
        return res.status(404).send({ message: 'Contrato não encontrado!' });
      }

      if (contrato.contatos_comerciais.length == 0) {
        return res.status(404).send({ message: 'Nenhum contato comercial cadastrado!' });
      }

      return res.status(200).send({ contatos_comerciais: contrato.contatos_comerciais });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar os contatos comerciais.' });
    }
  },

  async indexAll(req, res) {
    try {
      const contatosComerciais = await ContatoComercial.findAll();

      if (contatosComerciais.length == 0) {
        return res.status(404).send({ message: 'Nenhum contato comercial cadastrado!' });
      }

      return res.status(200).send({ contatosComerciais });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Erro ao buscar os contatos comerciais.' });
    }
  },

  async store(req, res) {
    try {
      const { id_contrato, conteudo } = req.body;

      const contatoComercial = await ContatoComercial.create({ id_contrato, conteudo });
      return res.status(201).send({
        message: 'Contato comercial criado com sucesso!',
        contatoComercial
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o contato comercial.' });
    }
  },

  async update(req, res) {
    try {
      const { conteudo } = req.body;
      const { id } = req.params;

      const contatoComercial = await ContatoComercial.findByPk(id);

      if (!contatoComercial) {
        return res.status(404).send({ message: 'Contato comercial não encontrado!' });
      }

      ContatoComercial.update({ conteudo }, { where: { id: id } });

      return res.status(200).send({ message: 'Contato comercial atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o contato comercial.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const contatoComercial = await ContatoComercial.findByPk(id);

      if (!contatoComercial) {
        return res.status(404).send({ message: 'Contato comercial não encontrado!' });
      }

      ContatoComercial.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Contato comercial deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o contato comercial.' });
    }
  }
}
