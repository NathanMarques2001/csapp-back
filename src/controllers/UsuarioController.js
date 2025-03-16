const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('C:\\Users\\NATHAN.BRANDAO\\Documents\\dev\\scrts\\secret.json');

function gerarToken(params = {}) {
  const expireAt = new Date();
  expireAt.setHours(6, 0, 0, 0); // Define a expiração para as 6h da manhã do dia seguinte
  expireAt.setDate(expireAt.getDate() + 1);

  return jwt.sign(params, authConfig.secret, {
    expiresIn: Math.floor(expireAt.getTime() / 1000) - Math.floor(Date.now() / 1000)
  });
}

module.exports = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ where: { email: email } });

      if (!usuario) {
        return res.status(404).send({ message: 'E-mail ou senha incorretos!' });
      }

      if (!bcrypt.compareSync(senha, usuario.senha)) {
        return res.status(404).send({ message: 'E-mail ou senha incorretos!' });
      }

      await Usuario.update({ logado: true }, { where: { id: usuario.id } });

      usuario.senha = undefined;

      const token = gerarToken({ id: usuario.id });

      return res.status(200).send({
        message: 'Usuário logado com sucesso!',
        usuario, token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao fazer login.' });
    }
  },

  async index(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).send({ message: 'Usuário não encontrado!' });
      }

      return res.status(200).send({ usuario });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar o usuário.' });
    }
  },

  async indexAll(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        order: [['nome', 'ASC']]
      });

      if (usuarios.length == 0) {
        return res.status(404).send({ message: 'Nenhum usuário cadastrado!' });
      }

      return res.status(200).send({ usuarios });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao buscar os usuários.' });
    }
  },

  async store(req, res) {
    try {
      const { nome, email, tipo, senha } = req.body;

      const usuario = await Usuario.create({ nome, email, tipo, senha });

      return res.status(201).send({
        message: 'Usuário criado com sucesso!',
        usuario
      });
    } catch (error) {
      if(error.name == 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ message: 'E-mail já cadastrado!' });
      }
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao criar o usuário.' });
    }
  },

  async update(req, res) {
    try {
      const { nome, email, tipo, senha } = req.body;
      const { id } = req.params;
  
      const usuario = await Usuario.findByPk(id);
  
      if (!usuario) {
        return res.status(404).send({ message: 'Usuário não encontrado!' });
      }
  
      usuario.nome = nome;
      usuario.email = email;
      usuario.tipo = tipo;
  
      if (senha) {
        usuario.senha = senha;
      }
  
      await usuario.save();
  
      return res.status(200).send({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao atualizar o usuário.' });
    }
  }
  ,

  async delete(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).send({ message: 'Usuário não encontrado!' });
      }

      await Usuario.destroy({ where: { id: id } });

      return res.status(200).send({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro ao deletar o usuário.' });
    }
  }
}
