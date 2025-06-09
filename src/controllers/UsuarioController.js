const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('C:\\Users\\natha\\dev\\scrts\\secret.json');
const jwksClient = require('jwks-rsa');

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

      if (!email || !senha) {
        return res.status(400).send({ message: 'E-mail e senha são obrigatórios.' });
      }

      const usuario = await Usuario.findOne({ where: { email: email } });
      const MENSAGEM_ERRO_PADRAO = 'E-mail ou senha incorretos!';

      if (!usuario) {
        return res.status(404).send({ message: MENSAGEM_ERRO_PADRAO });
      }

      // FILTRO 1: Se for uma conta Microsoft, barramos a entrada aqui.
      if (usuario.microsoft_oid && !usuario.senha) {
        // A função termina aqui para usuários Microsoft. O código abaixo NUNCA é executado para eles.
        return res.status(403).send({
          message: 'Esta conta deve ser acessada através do botão "Entrar com Microsoft".'
        });
      }

      // FILTRO 2: Se chegou até aqui, NÃO é um usuário Microsoft. 
      // Agora, garantimos que ele tenha uma senha para poder comparar.
      if (!usuario.senha) {
        // Se um usuário não-Microsoft não tiver senha por algum erro, barramos aqui.
        return res.status(404).send({ message: MENSAGEM_ERRO_PADRAO });
      }

      // PONTO SEGURO: Se o código chegou até aqui, temos certeza que `usuario.senha` contém um hash.
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(404).send({ message: MENSAGEM_ERRO_PADRAO });
      }

      // Lógica de sucesso...
      await Usuario.update({ logado: true }, { where: { id: usuario.id } });
      usuario.senha = undefined;
      const token = gerarToken({ id: usuario.id });

      return res.status(200).send({
        message: 'Usuário logado com sucesso!',
        usuario, token
      });
    } catch (error) {
      console.error('Ocorreu um erro no login:', error);
      return res.status(500).send({ message: 'Ocorreu um erro interno ao tentar fazer login.' });
    }
  },

  async loginComMicrosoft(req, res) {
    try {
      // --- ETAPAS 1 e 2 (Validação do Token) permanecem as mesmas ---
      const { microsoftToken } = req.body;
      if (!microsoftToken) return res.status(400).send({ message: 'Token da Microsoft não fornecido.' });

      const getSigningKey = (header, callback) => {
        // Cria um "cliente" que sabe onde encontrar as chaves da Microsoft
        const client = jwksClient({
          // Esta é a URL pública onde a Microsoft expõe as chaves para validação
          jwksUri: `https://login.microsoftonline.com/75504aa9-e9ba-434e-9986-779973a88e37/discovery/v2.0/keys`
        });

        // Pega a chave específica (identificada pelo 'kid' no header do token)
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            return callback(err);
          }
          // Extrai a chave pública no formato correto
          const signingKey = key.publicKey || key.rsaPublicKey;
          // Retorna a chave para o `jwt.verify`
          callback(null, signingKey);
        });
      };

      const decodedToken = await new Promise((resolve, reject) => {
        jwt.verify(microsoftToken, getSigningKey, {
          audience: 'c6d8daf9-f254-4fd6-824d-11105e3f48e9',
          issuer: `https://sts.windows.net/75504aa9-e9ba-434e-9986-779973a88e37/`
        }, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

      // --- ETAPA 3: NOVA LÓGICA DE VINCULAÇÃO DE CONTAS ---

      // 1. Tenta encontrar o usuário pelo ID da Microsoft (caso de um usuário que já retornou)
      let usuario = await Usuario.findOne({ where: { microsoft_oid: decodedToken.oid } });

      if (!usuario) {
        // Se NÃO encontrou pelo OID, pode ser a primeira vez com Microsoft. Vamos checar o e-mail.
        console.log(`Usuário com OID ${decodedToken.oid} não encontrado. Verificando e-mail: ${decodedToken.preferred_username}`);

        // 2. Tenta encontrar um usuário LOCAL já existente com o mesmo e-mail
        usuario = await Usuario.findOne({ where: { email: decodedToken.preferred_username } });

        if (usuario) {
          // 3. ENCONTROU PELO E-MAIL! Vamos vincular a conta.
          console.log(`Usuário com e-mail ${usuario.email} encontrado. Vinculando conta Microsoft.`);

          // Atualiza o registro existente com o OID da Microsoft
          await usuario.update({ microsoft_oid: decodedToken.oid });

        } else {
          // 4. Se não encontrou nem pelo OID nem pelo E-MAIL, é um usuário 100% novo.
          console.log(`Nenhum usuário existente encontrado. Criando novo usuário.`);

          // CRIA um novo usuário no seu banco
          usuario = await Usuario.create({
            nome: decodedToken.name,
            email: decodedToken.preferred_username,
            microsoft_oid: decodedToken.oid,
            tipo: 'user',
          });
        }
      }

      // --- ETAPA FINAL (Gerar token da sua aplicação) ---
      // Neste ponto, a variável 'usuario' sempre terá o registro correto (encontrado, vinculado ou criado)
      await Usuario.update({ logado: true }, { where: { id: usuario.id } });
      usuario.senha = undefined;
      const token = gerarToken({ id: usuario.id });
      return res.status(200).send({ message: 'Usuário logado com sucesso!', usuario, token });

    } catch (error) {
      // ... seu tratamento de erro
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ message: 'Ocorreu um erro de vínculo. O e-mail já pode estar em uso.' });
      }
      console.error('Erro no login com Microsoft:', error);
      return res.status(500).send({ message: 'Ocorreu um erro interno ao fazer login com a Microsoft.' });
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
      if (error.name == 'SequelizeUniqueConstraintError') {
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
